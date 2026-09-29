import fitz  # PyMuPDF

# PDF path from sanskritdocuments.org - Kaushitaki Upanishad
pdf_path = r'C:\Users\ishan\Music\dharma\dharma-granth\kaushitaki.pdf'
output_path = r'C:\Users\ishan\Music\dharma\dharma-granth\kaushitaki-extracted.txt'

print(f"Opening PDF...")
doc = fitz.open(pdf_path)

print(f"Extracting text from {len(doc)} pages...")
full_text = ""

for i, page in enumerate(doc):
    print(f"Processing page {i+1}/{len(doc)}...")
    text = page.get_text()
    full_text += f"\n\n--- Page {i+1} ---\n\n"
    full_text += text

doc.close()

print(f"Saving extracted text to {output_path}...")
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(full_text)

print("Extraction complete!")
