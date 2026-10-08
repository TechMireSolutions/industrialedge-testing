$gh = "C:\Users\Jawwad Abbas\AppData\Local\Microsoft\WinGet\Packages\GitHub.cli_Microsoft.Winget.Source_8wekyb3d8bbwe\bin\gh.exe"
$git = "C:\Users\Jawwad Abbas\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd\git.exe"
$token = (& $gh auth token).Trim()
& $git add -A
& $git commit -m "fix: dynamic import canvas-confetti, add root global-error boundary and fix layout head key warnings"
& $git push "https://$token@github.com/syedjawwad313/-Industrial-Edge.git" main
