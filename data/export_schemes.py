import pandas as pd
import json

df = pd.read_parquet('data/processed/schemes.parquet')
records = df.to_dict(orient='records')
content = '// Offline fallback catalog of government schemes\nimport { Scheme } from "./api";\n\nexport const FALLBACK_SCHEMES: Scheme[] = ' + json.dumps(records, indent=2, ensure_ascii=False) + ';\n'

with open('frontend/lib/fallbackSchemes.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print(f'Successfully generated frontend/lib/fallbackSchemes.ts with {len(records)} schemes')
