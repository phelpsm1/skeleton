param(
    [Parameter(Mandatory = $true)]
    [String] $command,
    [Parameter(Mandatory = $false)]
    [String] $env,
    [Parameter(Mandatory = $false)]
    [Array] $servers,
    [Parameter(Mandatory = $false)]
    [String] $name,
    [Parameter(Mandatory = $false)]
    [String] $pillar,
    [Parameter(Mandatory = $false)]
    [String] $apppool,
    [Parameter(Mandatory = $false)]
    [String] $site,
    [Parameter(Mandatory = $false)]
    [String] $revision,
    [Parameter(Mandatory = $false)]
    [String] $drive,
    [Parameter(Mandatory = $true)]
    [String] $file,
    [Parameter(Mandatory = $false)]
    [string] $root = 'WebSites'
)

$app_offline_file = "app_offline.htm"
# TODO: (jmorris2) Do not know why %systemroot% stopped working
# $appcmd = "%systemroot%\system32\inetsrv\appcmd"
$appcmd = "C:\Windows\system32\inetsrv\appcmd"

function Bring-Down() {
    Write-Output ""

    foreach ($server in $servers) {
        $session = Get-Session($server)

        Execute-Server-Command $session "Stopping $name application pool in $env on $server..." "$appcmd stop apppool $apppool"
        Execute-Server-Command $session "Stopping $name website in $env on $server..."          "$appcmd stop site $site"

        Remove-PSSession $session
    }
}

function Bring-Up() {
    Write-Output ""

    foreach ($server in $servers) {
        $session = Get-Session($server)

        Execute-Server-Command $session "Starting $name application pool in $env on $server..." "$appcmd start apppool $apppool"
        Execute-Server-Command $session "Starting $name website in $env on $server..."          "$appcmd start site $site"

        Remove-PSSession $session
    }
}

function Recycle() {
    Write-Output ""

    foreach ($server in $servers) {
        $session = Get-Session($server)

        Execute-Server-Command $session "Recycling $name application pool in $env on $server..." "$appcmd recycle apppool $apppool"

        Remove-PSSession $session
    }
}

function Get-Status() {
    Write-Output ""

    foreach ($server in $servers) {
        $session = Get-Session($server)

        Execute-Server-Command $session "$name application pool status in $env on $server is..." "$appcmd list apppool $apppool"
        Execute-Server-Command $session "$name website status in $env on $server is..."          "$appcmd list site $site"

        Remove-PSSession $session
    }
}

function Set-Current() {
    $local_path_base = "${drive}:\$root\$pillar\$name\$env"

    $path_current = "current"
    $path_current_log = "$path_current\log"

    $path_release = "releases\$revision"
    $path_shared_log = "shared\log"

    Write-Output ""
    Write-Output "Updating $name symlinks in $env..."

    foreach ($server in $servers) {
        $session = Get-Session($server)

        # When PowerShell 5.0, try https://docs.microsoft.com/en-us/powershell/module/Microsoft.PowerShell.Management/New-Item?view=powershell-5.1
        # Example: New-Item -Path C:\LinkDir -ItemType SymbolicLink -Value F:\RealDir
        # Find a solution here: https://stackoverflow.com/a/44060418/881

        $remote_path_base = "\\$server\$pillar$\$name\$env"

        # current symlink
        If (Test-Path "$remote_path_base\$path_current") {
            Execute-Server-Command $session "Removing current link in $env on $server..." "CMD /C RMDIR $local_path_base\$path_current"
        }

        Execute-Server-Command $session "Linking current to $revision in $env on $server..." "CMD /C MKLINK /J $local_path_base\$path_current $local_path_base\$path_release"

        # log symlink (if present)
        If (Test-Path "$remote_path_base\$path_shared_log") {
            If (Test-Path "$remote_path_base\$path_current_log") {
                Execute-Server-Command $session "Removing log link in $env on $server..." "CMD /C RMDIR $local_path_base\$path_current_log"
            }

            Execute-Server-Command $session "Linking log to current in $env on $server..." "CMD /C MKLINK /J $local_path_base\$path_current_log $local_path_base\$path_shared_log"
        }

        Remove-PSSession $session
    }
}

function Get-Mfg-Credentials() {
    if (Test-Path $file) {
        return Import-Clixml $file
    }
    
    $idsid = [Environment]::UserName

    if($idsid.Contains('mfg_')) {
        $user = "amr\$idsid"
    } else {
        $user = "amr\mfg_$idsid"
    }

    return Get-Credential -UserName $user -Message 'Enter password'
}

function Get-Session($server) {
    if([Environment]::UserName.Contains('mfg_')) {
        return New-PSSession -ComputerName $server
    } else {
        $cred = Get-Mfg-Credentials
        return New-PSSession -ComputerName $server -Credential $cred
    }
}

function Execute-Server-Command($session, $message, $cmd) {
    Write-Output $message
    $sb = [scriptblock]::Create("$cmd")
    Invoke-Command -Session $session -ScriptBlock $sb
}

&$command
