# Multilingual Rejection Remarks Templates (English, Hindi, Marathi)

REMARK_TEMPLATES = {
    "missing_document": {
        "en": [
            "Application rejected: {{missing_doc}} missing.",
            "Income certificate / mandatory document not attached with form.",
            "Document incomplete. Required certificates absent.",
            "Form submitted without uploading required {{missing_doc}} proof."
        ],
        "hi": [
            "आवेदन निरस्त: {{missing_doc}} संलग्न नहीं है।",
            "आवश्यक दस्तावेज जमा नहीं किए गए हैं।",
            "दस्तावेज अपूर्ण हैं। आय / जाति प्रमाण पत्र गायब है।",
            "पोर्टल पर {{missing_doc}} अपलोड नहीं किया गया।"
        ],
        "mr": [
            "अर्ज नाकारला: {{missing_doc}} जोडलेले नाही.",
            "आवश्यक कागदपत्रे अपूर्ण आहेत. दाखला अपलोड केला नाही.",
            "फॉर्मसोबत मूळ {{missing_doc}} सादर केले नाही.",
            "कागदपत्रांची पूर्तता झालेली नाही."
        ]
    },
    "expired_or_invalid_document": {
        "en": [
            "Income proof not valid. Certificate expired beyond 1 year validity.",
            "Submitted income certificate is outdated (>365 days old).",
            "Document validity expired. Please submit fresh current financial year certificate.",
            "Income certificate issue date exceeds allowed validity limit."
        ],
        "hi": [
            "आय प्रमाण पत्र अमान्य है। प्रमाण पत्र 1 वर्ष से अधिक पुराना है।",
            "प्रमाण पत्र की वैधता समाप्त हो चुकी है। नया प्रमाण पत्र प्रस्तुत करें।",
            "आय प्रमाण पत्र पुराना (समाप्त) पाया गया।",
            "जमा किया गया दस्तावेज वर्तमान वित्तीय वर्ष का नहीं है।"
        ],
        "mr": [
            "उत्पन्न दाखला अमान्य. १ वर्षापेक्षा जुना दाखला जोडला आहे.",
            "सादर केलेल्या उत्पन्नाच्या दाखल्याची मुदत संपलेली आहे.",
            "उत्पन्न प्रमाणपत्र मुदतबाह्य. नवीन आर्थिक वर्षाचा दाखला सादर करा.",
            "कागदपत्राची वैधता संपली आहे."
        ]
    },
    "eligibility_income": {
        "en": [
            "Rejected: Annual family income exceeds the scheme eligibility ceiling.",
            "Income ₹{{income}} is higher than prescribed limit ₹{{limit}}.",
            "Eligibility criteria not satisfied. Income above ceiling.",
            "Ineligible due to family income exceeding maximum threshold."
        ],
        "hi": [
            "अस्वीकृत: पारिवारिक वार्षिक आय निर्धारित सीमा ₹{{limit}} से अधिक है।",
            "आवेदक की आय ₹{{income}} योजना मानदंड से अधिक पाई गई।",
            "आय सीमा मानदंड पूरा नहीं हुआ।",
            "वार्षिक आय निर्धारित ceiling ₹{{limit}} से ऊपर है।"
        ],
        "mr": [
            "नाकारले: कौटुंबिक उत्पन्न योजनेच्या मर्यादेपेक्षा जास्त आहे.",
            "वार्षिक उत्पन्न ₹{{income}} हे विहित मर्यादेपेक्षा (₹{{limit}}) जास्त आढळले.",
            "उत्पन्न मर्यादा निकष पूर्ण होत नाही.",
            "कौटुंबिक उत्पन्न जास्त असल्याने अर्ज अपात्र ठरवला गेला."
        ]
    },
    "eligibility_age": {
        "en": [
            "Age limit criteria not satisfied. Applicant age {{age}} years.",
            "Applicant age does not fall within prescribed scheme range.",
            "Ineligible age group. Scheme requires age between {{min_age}} and {{max_age}}.",
            "Rejected: Overaged / underaged as per official scheme guidelines."
        ],
        "hi": [
            "आयु सीमा मानदंड पूरा नहीं हुआ। आवेदक की आयु {{age}} वर्ष है।",
            "आयु निर्धारित सीमा से बाहर है।",
            "योजना नियमों के अनुसार आवेदक की आयु अमान्य है।",
            "अस्वीकृत: आवेदक निर्धारित आयु सीमा में नहीं आता।"
        ],
        "mr": [
            "वय मर्यादा निकष पूर्ण होत नाही. अर्जदाराचे वय {{age}} वर्षे आहे.",
            "अर्जदाराचे वय विहित वयोगटात बसत नाही.",
            "अपात्र वय: योजनेसाठी आवश्यक वयोमर्यादा {{min_age}} ते {{max_age}} वर्षे आहे.",
            "वय मर्यादेचे उल्लंघन."
        ]
    },
    "eligibility_category_or_residence": {
        "en": [
            "Category / Domicile criteria not met for this scheme.",
            "Applicant is not a permanent resident of {{required_state}}.",
            "Caste category does not match scheme target beneficiary group.",
            "Domicile certificate invalid or belonging to other state."
        ],
        "hi": [
            "श्रेणी / निवास मानदंड पूरा नहीं हुआ।",
            "आवेदक {{required_state}} का स्थायी निवासी नहीं है।",
            "जाति श्रेणी योजना के लक्षित समूह से मेल नहीं खाती।",
            "डोमिसाइल प्रमाण पत्र अमान्य।"
        ],
        "mr": [
            "प्रवर्ग किंवा अधिवास (डोमिसाईल) निकष बसत नाही.",
            "अर्जदार {{required_state}} चा रहिवासी दाखला सादर करू शकला नाही.",
            "जात प्रवर्ग योजनेच्या अटींशी जुळत नाही.",
            "अधिवास प्रमाणपत्र अपूर्ण."
        ]
    },
    "document_mismatch": {
        "en": [
            "Name mismatch between Aadhaar card and Income certificate.",
            "Date of birth discrepancy across submitted documents.",
            "Applicant details do not match official database record.",
            "Name spelling variation on certificate vs application form."
        ],
        "hi": [
            "आधार कार्ड और आय प्रमाण पत्र में नाम का मिलान नहीं हुआ।",
            "दस्तावेजों के बीच जन्म तिथि में अंतर पाया गया।",
            "विवरण आधार डेटाबेस से मेल नहीं खाता।",
            "आवेदन पत्र में नाम और दस्तावेज में नाम अलग है।"
        ],
        "mr": [
            "आधार कार्ड आणि उत्पन्नाचा दाखला यांमधील नावात फरक आहे.",
            "कागदपत्रांमधील जन्मतारखेत तफावत आढळली.",
            "अर्जातील नाव आणि प्रमाणपत्रातील नावाचे साम्य नाही.",
            "माहितीची विसंगती आढळली."
        ]
    },
    "incomplete_or_incorrect_form": {
        "en": [
            "Incomplete form. Mandatory fields left blank.",
            "Bank IFSC code / Account number incorrectly entered.",
            "Form contains invalid details or missing required entries.",
            "Application incomplete at submission time."
        ],
        "hi": [
            "आवेदन पत्र अपूर्ण है। अनिवार्य विवरण खाली छोड़े गए।",
            "बैंक IFSC या खाता संख्या अमान्य है।",
            "फॉर्म में प्रविष्टियां अधूरी पाई गईं।",
            "अपूर्ण आवेदन पत्र।"
        ],
        "mr": [
            "अपूर्ण अर्ज. अनिवार्य रकाने रिकामे सोडले आहेत.",
            "बँक IFSC किंवा खाते क्रमांक चुकीचा भरला आहे.",
            "अर्जात माहिती अपूर्ण आहे.",
            "अर्ज सबमिट करताना त्रुटी."
        ]
    },
    "deadline_or_process_error": {
        "en": [
            "Application submitted after portal cutoff deadline date.",
            "Form received post deadline.",
            "Submitted through wrong application portal channel."
        ],
        "hi": [
            "अंतिम तिथि के बाद आवेदन जमा किया गया।",
            "पोर्टल कटऑफ समय समाप्त हो चुका है।",
            "गलत चैनल के माध्यम से आवेदन प्रेषित।"
        ],
        "mr": [
            "अर्जाची मुदत संपल्यानंतर अर्ज सादर केला गेला.",
            "पोर्टल बंद झाल्यानंतर अर्ज प्राप्त झाला.",
            "चुकीच्या पोर्टलवरून अर्ज दाखल."
        ]
    },
    "duplicate_application": {
        "en": [
            "Duplicate application detected under same Aadhaar number.",
            "Multiple applications filed under single beneficiary ID.",
            "Already beneficiary of another active financial scheme."
        ],
        "hi": [
            "समान आधार संख्या के तहत दोहरा आवेदन पाया गया।",
            "एक ही आवेदक द्वारा अनेक आवेदन जमा किए गए।",
            "पूर्व में इस योजना का लाभ प्राप्त हो चुका है।"
        ],
        "mr": [
            "एकाच आधार क्रमांकावर दुप्पट (Duplicate) अर्ज आढळला.",
            "एकापेक्षा जास्त अर्ज दाखल केले आहेत.",
            "पूर्वीच या योजनेचा लाभ मिळालेला आहे."
        ]
    },
    "verification_pending_or_unspecified": {
        "en": [
            "Remarks: Documents incomplete / verification pending.",
            "Rejected by District Nodal Officer without detailed remarks.",
            "Application under review by competent authority.",
            "Pending physical verification at institute level."
        ],
        "hi": [
            "टिप्पणी: दस्तावेज अपूर्ण / भौतिक सत्यापन लंबित।",
            "ज़िला अधिकारी द्वारा अस्वीकृत।",
            "प्रशासनिक कारणों से रोक लगाई गई।",
            "संस्थान स्तर पर सत्यापन लंबित।"
        ],
        "mr": [
            "टिप्पणी: कागदपत्रे अपूर्ण / पडताळणी प्रलंबित.",
            "जिल्हा अधिकाऱ्यांकडून अर्ज अमान्य.",
            "प्रशासकीय कारणास्तव अर्ज प्रलंबित.",
            "संस्थेकडून पडताळणी बाकी."
        ]
    }
}
