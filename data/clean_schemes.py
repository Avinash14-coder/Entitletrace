import os
import re
import unicodedata
import pandas as pd
import yaml
from sqlalchemy import create_engine, Column, String, Text, Integer, Float, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker

RAW_CSV_PATH = "data/raw/myscheme.csv"
CONFIG_COLUMNS_PATH = "config/columns.yaml"
SETTINGS_PATH = "config/settings.yaml"
OUTPUT_PARQUET_PATH = "data/processed/schemes.parquet"
DB_URL = "sqlite:///data/entitletrace.db"

Base = declarative_base()

class SchemeModel(Base):
    __tablename__ = "schemes"

    scheme_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    short_name = Column(String)
    level = Column(String)
    state = Column(String)
    ministry_name = Column(String)
    nodal_agency = Column(String)
    categories = Column(String)
    target_group = Column(String)
    benefit_type = Column(String)
    details = Column(Text)
    benefits = Column(Text)
    eligibility = Column(Text)
    application_process = Column(Text)
    documents_required = Column(Text)
    faqs = Column(Text)
    source_url = Column(String)

def clean_text(text):
    if pd.isna(text) or not text:
        return ""
    text = str(text)
    # Strip HTML tags
    text = re.sub(r'<[^>]+>', ' ', text)
    # Normalize unicode to NFC
    text = unicodedata.normalize('NFC', text)
    # Normalize bullet points and multiple spaces
    text = re.sub(r'[\r\n]+', '\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    return text.strip()

def process_schemes():
    if not os.path.exists(RAW_CSV_PATH):
        raise FileNotFoundError(f"Raw CSV missing at {RAW_CSV_PATH}")

    with open(CONFIG_COLUMNS_PATH, 'r', encoding='utf-8') as f:
        col_map = yaml.safe_load(f)["csv_to_canonical"]

    df = pd.read_csv(RAW_CSV_PATH)
    
    # Rename columns to canonical names
    rename_dict = {}
    for col in df.columns:
        if col in col_map:
            rename_dict[col] = col_map[col]
    df = df.rename(columns=rename_dict)

    # Clean text columns
    text_cols = ['name', 'details', 'benefits', 'eligibility', 'application_process', 'documents_required', 'faqs']
    for c in text_cols:
        if c in df.columns:
            df[c] = df[c].apply(clean_text)

    # Deduplicate on name + level + state
    df = df.drop_duplicates(subset=['name', 'level', 'state'])

    # Ensure stable scheme_id
    if 'scheme_id' not in df.columns or df['scheme_id'].isnull().any():
        df['scheme_id'] = [f"SCH_{i+1:04d}" for i in range(len(df))]

    os.makedirs("data/processed", exist_ok=True)
    df.to_parquet(OUTPUT_PARQUET_PATH, index=False)
    print(f"Cleaned schemes saved to {OUTPUT_PARQUET_PATH} ({len(df)} rows)")

    # Save to SQLite database
    engine = create_engine(DB_URL)
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()

    # Clear existing
    session.query(SchemeModel).delete()

    for _, row in df.iterrows():
        scheme_obj = SchemeModel(
            scheme_id=str(row.get('scheme_id', '')),
            name=str(row.get('name', '')),
            short_name=str(row.get('scheme_short_name', row.get('name', ''))),
            level=str(row.get('level', '')),
            state=str(row.get('state', '')),
            ministry_name=str(row.get('ministry_name', '')),
            nodal_agency=str(row.get('nodal_agency', '')),
            categories=str(row.get('categories', '')),
            target_group=str(row.get('target_group', '')),
            benefit_type=str(row.get('benefit_type', '')),
            details=str(row.get('details', '')),
            benefits=str(row.get('benefits', '')),
            eligibility=str(row.get('eligibility', '')),
            application_process=str(row.get('application_process', '')),
            documents_required=str(row.get('documents_required', '')),
            faqs=str(row.get('faqs', '')),
            source_url=str(row.get('source_url', ''))
        )
        session.add(scheme_obj)

    session.commit()
    session.close()
    print(f"SQLite database populated at {DB_URL}")

if __name__ == "__main__":
    process_schemes()
