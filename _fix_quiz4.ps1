$file = 'app\learn\page.tsx'
$content = [System.IO.File]::ReadAllText($file)

# Fix the extra quote before ${
$content = $content.Replace("rounded-full '${", "rounded-full ${")
# Fix the extra quote after }
$content = $content.Replace("}'`}>{quiz.difficulty}", "}`}>{quiz.difficulty}")

[System.IO.File]::WriteAllText($file, $content)
Write-Output 'Done'
