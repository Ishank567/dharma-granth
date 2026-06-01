import PyPDF2
import re

def extract_pdf():
    pdf_path = r'C:\Users\ishan\Music\dharma\108-upanishads-with-upanishad-brahmam-commentary.pdf'
    
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        
        print(f'PDF Info:')
        print(f'- Pages: {len(reader.pages)}')
        
        full_text = ''
        
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            full_text += text + '\n'
            
            if (i + 1) % 10 == 0:
                print(f'Processed {i + 1}/{len(reader.pages)} pages...')
        
        print(f'- Text length: {len(full_text)}')
        
        # Save full text
        with open('extracted-upanishads.txt', 'w', encoding='utf-8') as f:
            f.write(full_text)
        print('\nExtracted text saved to extracted-upanishads.txt')
        
        # Search for specific Upanishads
        upanishads_to_find = [
            'Kaushitaki',
            'Amritabindu',
            'Kauṣītaki',
            'Amṛtabindu'
        ]
        
        print('\nSearching for Upanishads:')
        for name in upanishads_to_find:
            matches = re.findall(name, full_text, re.IGNORECASE)
            print(f'- {name}: {len(matches)} occurrences')
        
        # Find sections
        lines = full_text.split('\n')
        print(f'\nTotal lines: {len(lines)}')
        
        return full_text

if __name__ == '__main__':
    extract_pdf()
