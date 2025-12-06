# NovaLanding Pages Reorganization Script
# This script reorganizes the Pages folder structure for better organization

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "NovaLanding Pages Reorganization Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$pagesPath = "NovaLanding/Pages"
$backupPath = "NovaLanding/Pages_Backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"

# Function to create backup
function Create-Backup {
    Write-Host "Creating backup..." -ForegroundColor Yellow
    if (Test-Path $pagesPath) {
        Copy-Item -Path $pagesPath -Destination $backupPath -Recurse
        Write-Host "✓ Backup created at: $backupPath" -ForegroundColor Green
    } else {
        Write-Host "✗ Pages folder not found!" -ForegroundColor Red
        exit 1
    }
}

# Function to create directory if it doesn't exist
function Ensure-Directory {
    param([string]$path)
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
        Write-Host "  Created: $path" -ForegroundColor Gray
    }
}

# Function to move file
function Move-PageFile {
    param(
        [string]$source,
        [string]$destination
    )
    if (Test-Path $source) {
        Move-Item -Path $source -Destination $destination -Force
        Write-Host "  Moved: $(Split-Path $source -Leaf) → $destination" -ForegroundColor Green
    } else {
        Write-Host "  Skipped: $(Split-Path $source -Leaf) (not found)" -ForegroundColor Yellow
    }
}

# Ask user which phase to execute
Write-Host "Select reorganization phase:" -ForegroundColor Cyan
Write-Host "1. Phase 1: Create Dashboard folder (Recommended - Low Risk)" -ForegroundColor White
Write-Host "2. Phase 2: Rename Pages to LandingPages (Medium Risk)" -ForegroundColor White
Write-Host "3. Phase 3: Reorganize Admin section (Low Risk)" -ForegroundColor White
Write-Host "4. All Phases (Complete Reorganization)" -ForegroundColor White
Write-Host "5. Cancel" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-5)"

if ($choice -eq "5") {
    Write-Host "Operation cancelled." -ForegroundColor Yellow
    exit 0
}

# Create backup
Create-Backup
Write-Host ""

# Phase 1: Create Dashboard folder
if ($choice -eq "1" -or $choice -eq "4") {
    Write-Host "Phase 1: Creating Dashboard folder..." -ForegroundColor Cyan
    Write-Host ""
    
    # Create Dashboard folder
    $dashboardPath = "$pagesPath/Dashboard"
    Ensure-Directory $dashboardPath
    
    # Move Dashboard.cshtml to Dashboard/Index.cshtml
    Write-Host "Moving Dashboard files..." -ForegroundColor Yellow
    Move-PageFile "$pagesPath/Dashboard.cshtml" "$dashboardPath/Index.cshtml"
    Move-PageFile "$pagesPath/Dashboard.cshtml.cs" "$dashboardPath/Index.cshtml.cs"
    
    # Move Profile to Dashboard folder
    Write-Host "Moving Profile files..." -ForegroundColor Yellow
    Move-PageFile "$pagesPath/Profile.cshtml" "$dashboardPath/Profile.cshtml"
    Move-PageFile "$pagesPath/Profile.cshtml.cs" "$dashboardPath/Profile.cshtml.cs"
    
    Write-Host ""
    Write-Host "✓ Phase 1 completed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Update Dashboard/Index.cshtml.cs namespace to: NovaLanding.Pages.Dashboard" -ForegroundColor White
    Write-Host "2. Update Dashboard/Profile.cshtml.cs namespace to: NovaLanding.Pages.Dashboard" -ForegroundColor White
    Write-Host "3. Update navigation links in _Sidebar.cshtml and _Header.cshtml" -ForegroundColor White
    Write-Host "4. Test the application" -ForegroundColor White
    Write-Host ""
}

# Phase 2: Rename Pages to LandingPages
if ($choice -eq "2" -or $choice -eq "4") {
    Write-Host "Phase 2: Renaming Pages to LandingPages..." -ForegroundColor Cyan
    Write-Host ""
    
    $oldPagesPath = "$pagesPath/Pages"
    $newPagesPath = "$pagesPath/LandingPages"
    
    if (Test-Path $oldPagesPath) {
        Rename-Item -Path $oldPagesPath -NewName "LandingPages"
        Write-Host "✓ Renamed: Pages → LandingPages" -ForegroundColor Green
    } else {
        Write-Host "✗ Pages folder not found!" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "✓ Phase 2 completed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Update namespace in LandingPages/*.cshtml.cs files" -ForegroundColor White
    Write-Host "2. Update all route references from /Pages to /LandingPages" -ForegroundColor White
    Write-Host "3. Update navigation links" -ForegroundColor White
    Write-Host "4. Test the application" -ForegroundColor White
    Write-Host ""
}

# Phase 3: Reorganize Admin section
if ($choice -eq "3" -or $choice -eq "4") {
    Write-Host "Phase 3: Reorganizing Admin section..." -ForegroundColor Cyan
    Write-Host ""
    
    $adminPath = "$pagesPath/Admin"
    
    # Create Admin subfolders
    Write-Host "Creating Admin subfolders..." -ForegroundColor Yellow
    Ensure-Directory "$adminPath/Templates"
    Ensure-Directory "$adminPath/Users"
    Ensure-Directory "$adminPath/Settings"
    Ensure-Directory "$adminPath/ActivityLogs"
    
    # Move Templates files
    Write-Host "Moving Templates files..." -ForegroundColor Yellow
    Move-PageFile "$adminPath/Templates.cshtml" "$adminPath/Templates/Index.cshtml"
    Move-PageFile "$adminPath/Templates.cshtml.cs" "$adminPath/Templates/Index.cshtml.cs"
    
    Write-Host ""
    Write-Host "✓ Phase 3 completed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Update namespace in Admin/Templates/Index.cshtml.cs" -ForegroundColor White
    Write-Host "2. Create Index.cshtml files for Users, Settings, ActivityLogs" -ForegroundColor White
    Write-Host "3. Update navigation links" -ForegroundColor White
    Write-Host "4. Test the application" -ForegroundColor White
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Reorganization Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backup location: $backupPath" -ForegroundColor Yellow
Write-Host ""
Write-Host "To rollback, run:" -ForegroundColor Yellow
Write-Host "  Remove-Item -Path '$pagesPath' -Recurse -Force" -ForegroundColor Gray
Write-Host "  Rename-Item -Path '$backupPath' -NewName 'Pages'" -ForegroundColor Gray
Write-Host ""
Write-Host "Remember to:" -ForegroundColor Cyan
Write-Host "  1. Update namespaces in moved .cs files" -ForegroundColor White
Write-Host "  2. Update route references in navigation" -ForegroundColor White
Write-Host "  3. Update any hardcoded paths in controllers" -ForegroundColor White
Write-Host "  4. Test all pages thoroughly" -ForegroundColor White
Write-Host "  5. Update documentation" -ForegroundColor White
Write-Host ""
Write-Host "✓ Script completed successfully!" -ForegroundColor Green
