$file = 'app\learn\page.tsx'
$content = [System.IO.File]::ReadAllText($file)

# Fix the mangled template literal on the difficulty span
# The broken version has a tab and no backticks
$old = "className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full }"
# Try with actual tab character
$old2 = "className={" + [char]9 + "ext-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full }"

# Build the correct replacement with proper template literal
$correct = "className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${" + [char]10 + "                            quiz.difficulty === 'beginner' ? 'bg-emerald-100 text-emerald-700' :" + [char]10 + "                            quiz.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-700' :" + [char]10 + "                            'bg-rose-100 text-rose-700'" + [char]10 + "                          }`}"

# Try replacing with LF version
$content = $content.Replace($old2, $correct)

# Also try CRLF version
$correctCRLF = $correct.Replace([char]10, [char]13 + [char]10)
$content = $content.Replace($old2.Replace([char]10, [char]13 + [char]10), $correctCRLF)

# Also try a simpler approach - just find and replace the broken pattern
# Look for the pattern with tab
$pattern = 'className=\{' + [char]9 + 'ext-xs'
$idx = $content.IndexOf($pattern)
if ($idx -ge 0) {
    # Find the end of this className
    $endIdx = $content.IndexOf('}', $idx)
    if ($endIdx -ge 0) {
        $brokenPart = $content.Substring($idx, $endIdx - $idx + 1)
        Write-Output "Found broken part: [$brokenPart]"
        $content = $content.Replace($brokenPart, $correct.Replace([char]10, [char]13 + [char]10))
    }
}

[System.IO.File]::WriteAllText($file, $content)
Write-Output 'Done'
