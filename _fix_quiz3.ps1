$file = 'app\learn\page.tsx'
$content = [System.IO.File]::ReadAllText($file)

$old = '<span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">{quiz.difficulty}</span>'

# Build replacement with explicit CRLF
$nl = [char]13 + [char]10
$new = '<span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${' + $nl + '                            quiz.difficulty === ' + [char]39 + 'beginner' + [char]39 + ' ? ' + [char]39 + 'bg-emerald-100 text-emerald-700' + [char]39 + ' :' + $nl + '                            quiz.difficulty === ' + [char]39 + 'intermediate' + [char]39 + ' ? ' + [char]39 + 'bg-amber-100 text-amber-700' + [char]39 + ' :' + $nl + '                            ' + [char]39 + 'bg-rose-100 text-rose-700' + [char]39 + $nl + '                          }`}>{quiz.difficulty}</span>'

$content = $content.Replace($old, $new)
[System.IO.File]::WriteAllText($file, $content)
Write-Output 'Done'
