# EntitleTrace Data Annotation Guidelines

## 1. Overview
This document guides annotators performing quality checks and inter-annotator agreement (IAA) verification on rejection remarks and synthetic cases.

## 2. Taxonomy Label Definitions

1. `missing_document`: Mandatory certificate (Income, Caste, Domicile, Aadhaar, Marksheet, Vending Certificate) was not attached or uploaded.
2. `expired_or_invalid_document`: Submitted document exceeds allowed validity period (e.g., >365 days old for income certificate) or lacks official stamp.
3. `document_mismatch`: Name spelling, date of birth, or gender differs across submitted identity documents.
4. `eligibility_income`: Family annual income exceeds prescribed scheme ceiling (e.g., ₹2,50,000 for PMS-SC).
5. `eligibility_age`: Applicant age is below minimum limit or above maximum threshold.
6. `eligibility_category_or_residence`: Applicant category (SC/ST/OBC/General) or state of residence does not match scheme target beneficiary group.
7. `incomplete_or_incorrect_form`: Blank mandatory fields, invalid bank account/IFSC code, or calculation errors in form text.
8. `deadline_or_process_error`: Application submitted post portal cutoff deadline or via unapproved submission channel.
9. `duplicate_application`: Existing active application registered under same Aadhaar/member ID.
10. `verification_pending_or_unspecified`: Generic, vague administrative remark (e.g., "Verification pending") without specific details.

## 3. Label Studio Import Instructions

1. Export file available at `data/annotations/label_studio_export.json`.
2. In Label Studio:
   - Create a project named **EntitleTrace Failure Classification**.
   - Select **Text Classification** layout.
   - Configure choices matching the 10 failure categories above.
   - Import `data/annotations/label_studio_export.json`.
