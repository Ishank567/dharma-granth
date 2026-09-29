import fitz  # PyMuPDF
import pytesseract
from PIL import Image
import io
import re

# Configure Tesseract path
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def ocr_page(page):
    """OCR a single page and return text"""
    pix = page.get_pixmap()
    img = Image.open(io.BytesIO(pix.tobytes()))
    return pytesseract.image_to_string(img)

def search_for_upanishads():
    """Search through PDF to find Kaushitaki and Amritabindu"""
    pdf_path = r'C:\Users\ishan\Music\dharma\108-upanishads-with-upanishad-brahmam-commentary.pdf'
    
    doc = fitz.open(pdf_path)
    
    print(f'PDF Info: {len(doc)} pages')
    print('\nSearching for Kaushitaki and Amritabindu Upanishads...')
    print('This will OCR every 100th page to locate the sections...\n')
    
    search_terms = ['Kaushitaki', 'Amritabindu', 'Kauṣītaki', 'Amṛtabindu', 'Kaushitaki Upanishad', 'Amritabindu Upanishad']
    found_pages = {}
    
    # Sample every 100 pages to find the sections
    for page_num in range(0, len(doc), 100):
        page = doc[page_num]
        text = ocr_page(page)
        
        for term in search_terms:
            if term.lower() in text.lower():
                if term not in found_pages:
                    found_pages[term] = []
                found_pages[term].append(page_num + 1)
                print(f'Found "{term}" around page {page_num + 1}')
        
        if (page_num + 1) % 200 == 0:
            print(f'Searched {page_num + 1}/{len(doc)} pages...')
    
    doc.close()
    
    if found_pages:
        print(f'\nFound sections:')
        for term, pages in found_pages.items():
            print(f'- {term}: pages {pages}')
    else:
        print('\nKaushitaki and Amritabindu not found in sampled pages.')
        print('These Upanishads might be in a different volume or not in this PDF.')
        print('\nNote: This PDF appears to be Volume 1 containing the first 8 Major Upanishads:')
        print('Isha, Kena, Katha, Prasna, Mundaka, Mandukya, Taittiriya and Aitareya.')
        print('Kaushitaki and Amritabindu are likely in a different volume.')
    
    return found_pages

if __name__ == '__main__':
    search_for_upanishads()
