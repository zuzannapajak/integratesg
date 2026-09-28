$ErrorActionPreference = "Stop"

$repo = (Get-Location).Path
$tempRoot = Join-Path $env:TEMP ("integratesg-eportfolio-admin-stats-" + [guid]::NewGuid().ToString("N"))
$zipPath = Join-Path $repo "eportfolio-admin-stats-audit-input.zip"

if (Test-Path $zipPath) {
  Remove-Item $zipPath -Force
}

New-Item -ItemType Directory -Path $tempRoot -Force | Out-Null

$files = @(
  "app/[locale]/(protected)/admin/stats/page.tsx",
  "app/api/admin/stats/route.ts",
  "components/stats/admin-stats-shell.tsx",
  "components/stats/user-eportfolio-progress-table.tsx",
  "lib/admin/queries.ts",
  "lib/admin/types.ts",
  "lib/eportfolio/progress.ts",
  "lib/eportfolio/queries.ts",
  "lib/eportfolio/types.ts",
  "features/eportfolio/actions.ts",
  "prisma/schema.prisma",
  "i18n/request.ts",
  "tests/integration/eportfolio/eportfolio-progress.integration.test.ts",
  "tests/integration/eportfolio/eportfolio-actions.integration.test.ts",
  "tests/integration/eportfolio/eportfolio-queries.integration.test.ts",
  "tests/integration/dashboard/dashboard-queries.integration.test.ts",
  "tests/unit/eportfolio/eportfolio-progress.test.ts",
  "tests/unit/eportfolio/eportfolio-actions-security.test.ts"
)

$globs = @(
  "messages/admin-stats-shells/*.json",
  "prisma/migrations/*eportfolio*/*",
  "prisma/migrations/*case*study*/*"
)

$missing = New-Object System.Collections.Generic.List[string]

function Copy-RepoFile([string]$relativePath) {
  $source = Join-Path $repo $relativePath

  if (-not (Test-Path -LiteralPath $source -PathType Leaf)) {
    $missing.Add($relativePath)
    return
  }

  $destination = Join-Path $tempRoot $relativePath
  $destinationDir = Split-Path $destination -Parent

  if (-not (Test-Path $destinationDir)) {
    New-Item -ItemType Directory -Path $destinationDir -Force | Out-Null
  }

  Copy-Item -LiteralPath $source -Destination $destination -Force
}

foreach ($file in $files) {
  Copy-RepoFile $file
}

foreach ($glob in $globs) {
  $fullPattern = Join-Path $repo $glob
  $matched = @(Get-ChildItem -Path $fullPattern -File -ErrorAction SilentlyContinue)

  if ($matched.Count -eq 0) {
    $missing.Add($glob)
    continue
  }

  foreach ($item in $matched) {
    $relative = $item.FullName.Substring($repo.Length).TrimStart([char[]]"\/")
    Copy-RepoFile $relative
  }
}

$manifest = @()
$manifest += "IntegratESG ePortfolio admin stats audit input"
$manifest += "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$manifest += ""
$manifest += "Branch:"
$manifest += (git branch --show-current 2>$null)
$manifest += ""
$manifest += "HEAD:"
$manifest += (git rev-parse HEAD 2>$null)
$manifest += ""
$manifest += "Status:"
$manifest += (git status --short 2>$null)
$manifest += ""
$manifest += "Missing requested paths:"
if ($missing.Count -eq 0) {
  $manifest += "(none)"
} else {
  $manifest += $missing
}

$manifest | Set-Content -LiteralPath (Join-Path $tempRoot "_manifest.txt") -Encoding UTF8

Compress-Archive -Path (Join-Path $tempRoot "*") -DestinationPath $zipPath -Force
Remove-Item $tempRoot -Recurse -Force

Write-Host ""
Write-Host "Done."
Write-Host "Created: $zipPath"
Write-Host "Missing requested paths: $($missing.Count)"

if ($missing.Count -gt 0) {
  $missing | ForEach-Object { Write-Host " - $_" }
}
