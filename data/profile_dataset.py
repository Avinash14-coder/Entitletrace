import os
import pandas as pd
import yaml

RAW_CSV_PATH = "data/raw/myscheme.csv"
CONFIG_COLUMNS_PATH = "config/columns.yaml"
OUTPUT_REPORT_PATH = "docs/DATASET_REPORT.md"

def profile():
    if not os.path.exists(RAW_CSV_PATH):
        raise FileNotFoundError(f"Raw CSV not found at {RAW_CSV_PATH}")

    df = pd.read_csv(RAW_CSV_PATH)
    
    with open(CONFIG_COLUMNS_PATH, 'r', encoding='utf-8') as f:
        col_map = yaml.safe_load(f)

    mapped_cols = col_map.get("csv_to_canonical", {})

    report_lines = []
    report_lines.append("# EntitleTrace Data Profiling Report\n")
    report_lines.append(f"**Dataset File:** `{RAW_CSV_PATH}`")
    report_lines.append(f"**Total Rows:** {len(df)}")
    report_lines.append(f"**Total Columns:** {len(df.columns)}\n")

    report_lines.append("## 1. Column Inventory & Data Types\n")
    report_lines.append("| Column Name | Canonical Mapping | Data Type | Null Count | Null % |")
    report_lines.append("|---|---|---|---|---|")

    for col in df.columns:
        canonical = mapped_cols.get(col, "Unmapped / Extra")
        dtype = str(df[col].dtype)
        null_cnt = df[col].isnull().sum()
        null_pct = round((null_cnt / len(df)) * 100, 2)
        report_lines.append(f"| `{col}` | `{canonical}` | `{dtype}` | {null_cnt} | {null_pct}% |")

    report_lines.append("\n## 2. Text Column Length Analysis\n")
    report_lines.append("| Column Name | Avg Character Length | Max Length | Min Length |")
    report_lines.append("|---|---|---|---|")
    
    text_cols = [c for c in df.columns if df[c].dtype == 'object']
    for c in text_cols:
        lengths = df[c].fillna("").astype(str).str.len()
        report_lines.append(f"| `{c}` | {lengths.mean():.1f} | {lengths.max()} | {lengths.min()} |")

    report_lines.append("\n## 3. Categorical Breakdown\n")
    for cat_col in ["level", "state", "categories", "target_group", "benefit_type"]:
        if cat_col in df.columns:
            report_lines.append(f"### Distinct values in `{cat_col}`:\n")
            val_counts = df[cat_col].value_counts().head(10)
            for val, cnt in val_counts.items():
                report_lines.append(f"- **{val}**: {cnt} schemes")
            report_lines.append("")

    report_lines.append("\n## 4. Eligibility & Documents Required Formatting\n")
    report_lines.append("Analysis of formatting structure (bullets, numbered lists, plain text, HTML tags):\n")
    
    for field in ["eligibility", "documents_required"]:
        if field in df.columns:
            sample_text = str(df[field].dropna().iloc[0]) if not df[field].dropna().empty else ""
            has_bullets = any(b in sample_text for b in ["•", "-", "*"])
            has_numbers = any(f"{i}." in sample_text for i in range(1, 10))
            has_html = "<" in sample_text and ">" in sample_text
            report_lines.append(f"- **`{field}`**: Has Bullet points: `{has_bullets}`, Numbered lists: `{has_numbers}`, HTML Remnants: `{has_html}`")

    report_lines.append("\n## 5. Sample Rows Preview\n")
    report_lines.append("```json")
    sample_data = df.head(3).to_dict(orient="records")
    import json
    report_lines.append(json.dumps(sample_data, indent=2, ensure_ascii=False))
    report_lines.append("```\n")

    os.makedirs("docs", exist_ok=True)
    with open(OUTPUT_REPORT_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(report_lines))

    print(f"Dataset report written to {OUTPUT_REPORT_PATH}")

if __name__ == "__main__":
    profile()
