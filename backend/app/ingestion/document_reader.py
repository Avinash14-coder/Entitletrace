import os
import fitz  # PyMuPDF
import docx
from typing import BinaryIO

def extract_text_from_file(file_bytes: bytes, filename: str) -> dict:
    """
    Extracts text page-by-page from uploaded documents (PDF, DOCX, TXT, Images).
    """
    ext = os.path.splitext(filename)[1].lower()
    pages = []
    warnings = []

    if ext == ".pdf":
        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            for page_num, page in enumerate(doc):
                text = page.get_text()
                pages.append({
                    "page_number": page_num + 1,
                    "text": text.strip()
                })
            doc.close()
        except Exception as e:
            warnings.append(f"PDF extraction error: {str(e)}")

    elif ext in [".docx", ".doc"]:
        try:
            import io
            doc = docx.Document(io.BytesIO(file_bytes))
            full_text = []
            for p in doc.paragraphs:
                if p.text.strip():
                    full_text.append(p.text.strip())
            pages.append({
                "page_number": 1,
                "text": "\n".join(full_text)
            })
        except Exception as e:
            warnings.append(f"DOCX extraction error: {str(e)}")

    elif ext in [".txt", ".csv", ".json", ".md"]:
        try:
            text = file_bytes.decode("utf-8", errors="ignore")
            pages.append({
                "page_number": 1,
                "text": text.strip()
            })
        except Exception as e:
            warnings.append(f"Text file reading error: {str(e)}")

    elif ext in [".png", ".jpg", ".jpeg"]:
        warnings.append("OCR engine (PaddleOCR/Tesseract) not installed locally. Uploaded image text could not be extracted.")
        pages.append({
            "page_number": 1,
            "text": f"[Image file {filename} uploaded - OCR pending]"
        })

    else:
        warnings.append(f"Unsupported file extension: {ext}")

    full_extracted_text = "\n\n".join([f"--- Page {p['page_number']} ---\n{p['text']}" for p in pages if p['text']])

    return {
        "filename": filename,
        "extension": ext,
        "total_pages": len(pages),
        "pages": pages,
        "full_text": full_extracted_text,
        "warnings": warnings
    }
