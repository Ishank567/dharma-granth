# Installing Tesseract OCR on Windows

## Step 1: Download Tesseract

1. Go to the official Tesseract GitHub releases:
   https://github.com/UB-Mannheim/tesseract/wiki

2. Download the latest Windows installer (64-bit recommended):
   - Look for "tesseract-ocr-w64-setup-5.x.x.exe" (or latest version)

3. Run the installer

## Step 2: Install Tesseract

During installation:
- **Important**: Note the installation path (default is usually `C:\Program Files\Tesseract-OCR`)
- Check "Add to PATH" if available, or we'll configure it manually

## Step 3: Verify Installation

Open PowerShell and run:
```powershell
tesseract --version
```

If it shows the version, installation is successful.

## Step 4: Configure Python Script

If Tesseract is not in PATH, update the Python script with the path:
```python
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
```

## Step 5: Run OCR

Once installed, run:
```powershell
python extract-pdf-ocr.py
```

This will attempt OCR on the PDF to extract text.
