$ErrorActionPreference = "Stop"
$roles = "real-estate", "insurance", "doctor", "ca-tax", "photographer", "fitness-tutor"

foreach ($role in $roles) {
    Write-Host "Building role: $role"
    npm run role $role
    npm run build
}

Write-Host "Reverting role back to doctor..."
npm run role doctor
npm run build

Write-Host "All builds completed successfully."
