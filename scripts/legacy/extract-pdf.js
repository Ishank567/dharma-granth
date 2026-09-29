const fs = require('fs');

async function extractPDF() {
  const pdfPath = 'C:\\Users\\ishan\\Music\\dharma\\108-upanishads-with-upanishad-brahmam-commentary.pdf';
  
  // Use a simple approach with child process to call pdftotext if available
  // Or we can try a different library
  
  console.log('Attempting to extract PDF using system tools...');
  
  // Try using PowerShell to extract text
  const { exec } = require('child_process');
  
  return new Promise((resolve, reject) => {
    exec(`powershell -Command "Add-Type -AssemblyName System.Drawing; $pdf = [System.Drawing.Image]::FromFile('${pdfPath}'); Write-Host 'Pages: ' + $pdf.GetFrameCount([System.Drawing.Imaging.FrameDimension]::Page); $pdf.Dispose()"`, (error, stdout, stderr) => {
      if (error) {
        console.error('PowerShell approach failed:', error);
        reject(error);
        return;
      }
      console.log(stdout);
      resolve(stdout);
    });
  });
}

extractPDF().catch(console.error);
