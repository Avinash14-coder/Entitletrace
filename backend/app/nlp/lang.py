import re
from langdetect import detect, DetectorFactory

DetectorFactory.seed = 42

def detect_language(text: str) -> str:
    """
    Detects language of input text (en, hi, mr).
    Uses script inspection fallback for Devanagari (Hindi/Marathi).
    """
    if not text or len(text.strip()) == 0:
        return "en"

    # Check for Devanagari Unicode range (\u0900-\u097F)
    devanagari_chars = len(re.findall(r'[\u0900-\u097F]', text))
    total_chars = len(re.findall(r'\w', text))

    if total_chars > 0 and (devanagari_chars / total_chars) > 0.3:
        # Check specific Marathi indicator words
        marathi_markers = ["आहे", "नाकारला", "झाले", "केले", "उत्पन्न", "दाखला", "फॉर्म", "माहिती"]
        if any(marker in text for marker in marathi_markers):
            return "mr"
        return "hi"

    try:
        detected = detect(text)
        if detected in ["hi", "mr", "en"]:
            return detected
    except Exception:
        pass

    return "en"
