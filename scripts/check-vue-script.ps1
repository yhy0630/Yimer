param(
	[Parameter(Mandatory = $true, Position = 0)]
	[string]$Path
)

$resolvedPath = Resolve-Path -LiteralPath $Path -ErrorAction Stop
$utf8 = New-Object System.Text.UTF8Encoding($false)
$raw = [System.IO.File]::ReadAllText($resolvedPath.Path, $utf8)
$match = [System.Text.RegularExpressions.Regex]::Match(
	$raw,
	'(?s)<script(?:\s[^>]*)?>\s*(.*?)\s*</script>'
)

if (-not $match.Success) {
	Write-Error "script block not found in $Path"
	exit 1
}

$tmpPath = Join-Path $PWD '__tmp_vue_script_check__.js'
$exitCode = 0

try {
	[System.IO.File]::WriteAllText($tmpPath, $match.Groups[1].Value, $utf8)
	node --check $tmpPath
	$exitCode = $LASTEXITCODE
}
finally {
	if (Test-Path -LiteralPath $tmpPath) {
		Remove-Item -LiteralPath $tmpPath -Force -ErrorAction SilentlyContinue
	}
}

exit $exitCode
