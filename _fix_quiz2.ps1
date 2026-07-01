$file = 'app\learn\page.tsx'
$content = [System.IO.File]::ReadAllText($file)

# Replace the simplified span with a proper conditional className
$old = '<span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">{quiz.difficulty}</span>'
$new = '<span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ' + "'" + '${' + [char]10 + '                            quiz.difficulty === ' + "'" + 'beginner' + "'" + ' ? ' + "'" + 'bg-emerald-100 text-emerald-700' + "'" + ' :' + [char]10 + '                            quiz.difficulty === ' + "'" + 'intermediate' + "'" + ' ? ' + "'" + 'bg-amber-100 text-amber-700' + "'" + ' :' + [char]10 + '                            ' + "'" + 'bg-rose-100 text-rose-700' + "'" + [char]10 + '                          }' + "'" + '`}>{quiz.difficulty}</span>'

# Convert LF to CRLF
$new = $new.Replace([char]10, [char]13 + [char]10)

$content = $content.Replace($old, $new)
[System.IO.File]::WriteAllText($file, $content)
Write-Output 'Done'
