# EntitleTrace Data Profiling Report

**Dataset File:** `data/raw/myscheme.csv`
**Total Rows:** 12
**Total Columns:** 27

## 1. Column Inventory & Data Types

| Column Name | Canonical Mapping | Data Type | Null Count | Null % |
|---|---|---|---|---|
| `scheme_id` | `scheme_id` | `object` | 0 | 0.0% |
| `scheme_name` | `name` | `object` | 0 | 0.0% |
| `scheme_short_name` | `Unmapped / Extra` | `object` | 0 | 0.0% |
| `level` | `level` | `object` | 0 | 0.0% |
| `state` | `state` | `object` | 0 | 0.0% |
| `ministry_name` | `Unmapped / Extra` | `object` | 0 | 0.0% |
| `nodal_agency` | `Unmapped / Extra` | `object` | 0 | 0.0% |
| `categories` | `categories` | `object` | 0 | 0.0% |
| `target_group` | `target_group` | `object` | 0 | 0.0% |
| `benefit_type` | `benefit_type` | `object` | 0 | 0.0% |
| `details` | `details` | `object` | 0 | 0.0% |
| `benefits` | `benefits` | `object` | 0 | 0.0% |
| `eligibility` | `eligibility` | `object` | 0 | 0.0% |
| `application_process` | `application_process` | `object` | 0 | 0.0% |
| `documents_required` | `documents_required` | `object` | 0 | 0.0% |
| `faqs` | `faqs` | `object` | 0 | 0.0% |
| `source_url` | `source_url` | `object` | 0 | 0.0% |
| `tags` | `Unmapped / Extra` | `object` | 0 | 0.0% |
| `gender_eligibility` | `Unmapped / Extra` | `object` | 0 | 0.0% |
| `min_age` | `Unmapped / Extra` | `int64` | 0 | 0.0% |
| `max_age` | `Unmapped / Extra` | `int64` | 0 | 0.0% |
| `caste_category` | `Unmapped / Extra` | `object` | 0 | 0.0% |
| `income_ceiling` | `Unmapped / Extra` | `int64` | 0 | 0.0% |
| `disability_percentage` | `Unmapped / Extra` | `int64` | 0 | 0.0% |
| `residence_type` | `Unmapped / Extra` | `object` | 0 | 0.0% |
| `marital_status` | `Unmapped / Extra` | `object` | 0 | 0.0% |
| `created_at` | `Unmapped / Extra` | `object` | 0 | 0.0% |

## 2. Text Column Length Analysis

| Column Name | Avg Character Length | Max Length | Min Length |
|---|---|---|---|
| `scheme_id` | 16.0 | 21 | 8 |
| `scheme_name` | 34.7 | 55 | 19 |
| `scheme_short_name` | 7.9 | 14 | 4 |
| `level` | 6.5 | 7 | 5 |
| `state` | 9.7 | 13 | 9 |
| `ministry_name` | 40.8 | 60 | 19 |
| `nodal_agency` | 27.7 | 50 | 7 |
| `categories` | 31.2 | 46 | 17 |
| `target_group` | 18.5 | 40 | 5 |
| `benefit_type` | 25.2 | 58 | 13 |
| `details` | 153.9 | 212 | 126 |
| `benefits` | 134.2 | 206 | 92 |
| `eligibility` | 317.2 | 411 | 126 |
| `application_process` | 179.4 | 284 | 87 |
| `documents_required` | 235.2 | 352 | 64 |
| `faqs` | 102.9 | 178 | 78 |
| `source_url` | 28.7 | 42 | 20 |
| `tags` | 40.8 | 51 | 28 |
| `gender_eligibility` | 3.5 | 6 | 3 |
| `caste_category` | 3.8 | 13 | 2 |
| `residence_type` | 3.7 | 5 | 3 |
| `marital_status` | 3.5 | 6 | 3 |
| `created_at` | 10.0 | 10 | 10 |

## 3. Categorical Breakdown

### Distinct values in `level`:

- **Central**: 9 schemes
- **State**: 3 schemes

### Distinct values in `state`:

- **All India**: 9 schemes
- **Maharashtra**: 2 schemes
- **Uttar Pradesh**: 1 schemes

### Distinct values in `categories`:

- **Education, Student Welfare**: 1 schemes
- **Agriculture, Direct Benefit Transfer**: 1 schemes
- **Housing, Urban Development**: 1 schemes
- **Women Welfare, Social Security**: 1 schemes
- **Financial Services, Micro Credit**: 1 schemes
- **Education, Secondary Education**: 1 schemes
- **Health, Insurance**: 1 schemes
- **Girl Child Welfare, Social Security**: 1 schemes
- **Urban Infrastructure, Electric Mobility**: 1 schemes
- **Financial Services, Entrepreneurship**: 1 schemes

### Distinct values in `target_group`:

- **Students**: 2 schemes
- **Farmers**: 1 schemes
- **Urban Poor, EWS, LIG**: 1 schemes
- **Women**: 1 schemes
- **Street Vendors**: 1 schemes
- **Low Income Families, Senior Citizens**: 1 schemes
- **Girl Child, Families**: 1 schemes
- **Urban Citizens, Public Transit**: 1 schemes
- **SC/ST Entrepreneurs, Women Entrepreneurs**: 1 schemes
- **Artisans and Craftsmen**: 1 schemes

### Distinct values in `benefit_type`:

- **Financial Assistance**: 3 schemes
- **Cash Transfer**: 2 schemes
- **Subsidy / Financial Assistance**: 1 schemes
- **Collateral-Free Micro Credit**: 1 schemes
- **Cashless Health Insurance**: 1 schemes
- **Cash Transfer (Stage-wise)**: 1 schemes
- **In-Kind / Infrastructure Support**: 1 schemes
- **Bank Credit / Loan**: 1 schemes
- **Composite (Skill Training, Tool Kit & Concessional Credit)**: 1 schemes


## 4. Eligibility & Documents Required Formatting

Analysis of formatting structure (bullets, numbered lists, plain text, HTML tags):

- **`eligibility`**: Has Bullet points: `True`, Numbered lists: `True`, HTML Remnants: `False`
- **`documents_required`**: Has Bullet points: `False`, Numbered lists: `True`, HTML Remnants: `False`

## 5. Sample Rows Preview

```json
[
  {
    "scheme_id": "SCH_POST_MATRIC_SC",
    "scheme_name": "Post Matric Scholarship for SC Students",
    "scheme_short_name": "PMS-SC",
    "level": "Central",
    "state": "All India",
    "ministry_name": "Ministry of Social Justice and Empowerment",
    "nodal_agency": "Department of Social Justice and Empowerment",
    "categories": "Education, Student Welfare",
    "target_group": "Students",
    "benefit_type": "Financial Assistance",
    "details": "Post Matric Scholarship scheme for Scheduled Caste (SC) students aims to provide financial support to SC students studying at post-matriculation or post-secondary stage to enable them to complete their education.",
    "benefits": "Full tuition fee reimbursement and maintenance allowance ranging from ₹2,500 to ₹13,500 per annum based on course category.",
    "eligibility": "1. Applicant must belong to Scheduled Caste (SC) category.\n2. Applicant must be a permanent resident of India.\n3. The annual income of applicant's parents/guardian from all sources must not exceed ₹2,500,000 (₹2.5 Lakh) per annum.\n4. Applicant must be pursuing recognized post-matriculation courses in approved institutions.\n5. Age must be between 16 and 35 years at time of application.",
    "application_process": "1. Register on National Scholarship Portal (NSP) or State Scholarship Portal.\n2. Upload income certificate, caste certificate, and academic marksheets.\n3. Submit application online before the deadline of 31st October.\n4. Institution verification followed by district officer approval.",
    "documents_required": "1. Valid Income Certificate issued by competent authority (Max 1 year old).\n2. SC Caste Certificate issued by competent magistrate.\n3. Aadhaar Card linked with active bank account.\n4. Previous year Marksheet / Passing Certificate.\n5. Bank Passbook copy showing IFSC and Account Number.\n6. Institution Fee Receipt.",
    "faqs": "Q: What is the maximum income limit?\nA: ₹2,50,000 per annum.\nQ: Is income certificate mandatory every year?\nA: Yes, a valid income certificate issued within 365 days is required.",
    "source_url": "https://scholarships.gov.in/pms-sc",
    "tags": "scholarship, sc, education, post-matric",
    "gender_eligibility": "All",
    "min_age": 16,
    "max_age": 35,
    "caste_category": "SC",
    "income_ceiling": 250000,
    "disability_percentage": 0,
    "residence_type": "All",
    "marital_status": "All",
    "created_at": "2026-03-01"
  },
  {
    "scheme_id": "SCH_PM_KISAN",
    "scheme_name": "PM Kisan Samman Nidhi",
    "scheme_short_name": "PM-KISAN",
    "level": "Central",
    "state": "All India",
    "ministry_name": "Ministry of Agriculture and Farmers Welfare",
    "nodal_agency": "Department of Agriculture",
    "categories": "Agriculture, Direct Benefit Transfer",
    "target_group": "Farmers",
    "benefit_type": "Cash Transfer",
    "details": "PM-KISAN provides income support to all landholding farmer families across the country to enable them to take care of expenses related to agriculture and domestic needs.",
    "benefits": "Financial benefit of ₹6,000 per year transferred in three equal instalments of ₹2,000 every four months directly into bank accounts.",
    "eligibility": "1. Applicant farmer family must own cultivable land registered in their name.\n2. Both small and marginal farmers are eligible.\n3. Institutional landholders, serving/retired government employees, and income tax payers in last assessment year are ineligible.\n4. Applicant must have completed mandatory e-KYC.",
    "application_process": "1. Apply via PM-KISAN online portal or CSC center.\n2. Enter land record (Khata/Khasra) details and Aadhaar number.\n3. Complete land seeding verification by local Revenue Officer.",
    "documents_required": "1. Land Ownership Document (7/12 extract / Khatauni / Jamabandi).\n2. Aadhaar Card of head of family.\n3. Aadhaar-seeded Bank Account details.\n4. Active Mobile Number for e-KYC OTP verification.",
    "faqs": "Q: Are income tax payers eligible?\nA: No, individuals paying income tax are excluded.",
    "source_url": "https://pmkisan.gov.in",
    "tags": "farmer, agriculture, dbt, land",
    "gender_eligibility": "All",
    "min_age": 18,
    "max_age": 100,
    "caste_category": "All",
    "income_ceiling": 0,
    "disability_percentage": 0,
    "residence_type": "Rural",
    "marital_status": "All",
    "created_at": "2026-03-01"
  },
  {
    "scheme_id": "SCH_PMAY_URBAN",
    "scheme_name": "Pradhan Mantri Awas Yojana - Urban",
    "scheme_short_name": "PMAY-U",
    "level": "Central",
    "state": "All India",
    "ministry_name": "Ministry of Housing and Urban Affairs",
    "nodal_agency": "Housing Authority",
    "categories": "Housing, Urban Development",
    "target_group": "Urban Poor, EWS, LIG",
    "benefit_type": "Subsidy / Financial Assistance",
    "details": "PMAY-U addresses urban housing shortage among EWS/LIG and MIG categories including slum dwellers by ensuring a pucca house to all eligible urban families.",
    "benefits": "Interest subsidy up to ₹2.67 Lakh on housing loans or direct financial assistance of ₹1.5 Lakh for house construction.",
    "eligibility": "1. Beneficiary family should not own a pucca house anywhere in India.\n2. Annual family income for EWS category must not exceed ₹3,000,000 (₹3 Lakh).\n3. Annual family income for LIG category must not exceed ₹6,000,000 (₹6 Lakh).\n4. Family must comprise husband, wife, and unmarried children.",
    "application_process": "1. Apply online at PMAY-U official portal or through Urban Local Body (ULB).\n2. Submit income certificate, land documents, and Aadhaar.\n3. Verification by Municipal Corporation / ULB inspection team.",
    "documents_required": "1. Income Certificate showing annual family income ≤ ₹300,000 for EWS.\n2. Aadhaar Card of all family members.\n3. Domicile / Residence Proof of urban area.\n4. Land Ownership proof or allotment letter.\n5. Affidavit affirming no ownership of pucca house anywhere in India.",
    "faqs": "Q: Can a single person apply?\nA: Family definition requires nuclear family status unless senior citizen.",
    "source_url": "https://pmaymis.gov.in",
    "tags": "housing, urban, subsidy, ews",
    "gender_eligibility": "All",
    "min_age": 21,
    "max_age": 70,
    "caste_category": "All",
    "income_ceiling": 300000,
    "disability_percentage": 0,
    "residence_type": "Urban",
    "marital_status": "All",
    "created_at": "2026-03-01"
  }
]
```
