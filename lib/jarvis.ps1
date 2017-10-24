param(
    [Parameter(Mandatory = $true)]
    [String] $command,
    [Parameter(Mandatory = $false)]
    [String] $env,
    [Parameter(Mandatory = $false)]
    [Array] $servers,
    [Parameter (Mandatory = $false)]
    [String] $name,
    [Parameter (Mandatory = $false)]
    [String] $pillar,
    [Parameter (Mandatory = $false)]
    [String] $apppool,
    [Parameter (Mandatory = $false)]
    [String] $site,
    [Parameter (Mandatory = $false)]
    [String] $revision
)

$app_offline_file = "app_offline.htm"
# TODO: (jmorris2) Do not know why %systemroot% stopped working
# $appcmd = "%systemroot%\system32\inetsrv\appcmd"
$appcmd = "C:\Windows\system32\inetsrv\appcmd"

function Bring-Down() {
    $cred = Get-Mfg-Credentials

    Write-Output ""

    foreach ($server in $servers) {
        $session = New-PSSession -ComputerName $server -Credential $cred

        Execute-Server-Command $session "Stopping $name application pool in $env on $server..." "$appcmd stop apppool $apppool"
        Execute-Server-Command $session "Stopping $name website in $env on $server..."          "$appcmd stop site $site"

        Remove-PSSession $session
    }
}

function Bring-Up() {
    $cred = Get-Mfg-Credentials

    Write-Output ""

    foreach ($server in $servers) {
        $session = New-PSSession -ComputerName $server -Credential $cred

        Execute-Server-Command $session "Starting $name application pool in $env on $server..." "$appcmd start apppool $apppool"
        Execute-Server-Command $session "Starting $name website in $env on $server..."          "$appcmd start site $site"

        Remove-PSSession $session
    }
}

function Recycle() {
    $cred = Get-Mfg-Credentials

    Write-Output ""

    foreach ($server in $servers) {
        $session = New-PSSession -ComputerName $server -Credential $cred

        Execute-Server-Command $session "Recycling $name application pool in $env on $server..." "$appcmd recycle apppool $apppool"

        Remove-PSSession $session
    }
}

function Get-Status() {
    $cred = Get-Mfg-Credentials

    Write-Output ""

    foreach ($server in $servers) {
        $session = New-PSSession -ComputerName $server -Credential $cred

        Execute-Server-Command $session "$name application pool status in $env on $server is..." "$appcmd list apppool $apppool"
        Execute-Server-Command $session "$name website status in $env on $server is..."          "$appcmd list site $site"

        Remove-PSSession $session
    }
}

function Set-Current() {
    $server_path_base = "D:\WebSites\$pillar\$name\$env"
    $server_path_current = "$server_path_base\current"
    $server_path_current_log = "$server_path_current\log"
    $server_path_release = "$server_path_base\releases\$revision"
    $server_path_shared_log = "$server_path_base\shared\log"

    $cred = Get-Mfg-Credentials

    Write-Output ""
    Write-Output "Updating $name current link in $env..."

    foreach ($server in $servers) {
        $session = New-PSSession -ComputerName $server -Credential $cred

        # When PowerShell 5.0, try https://docs.microsoft.com/en-us/powershell/module/Microsoft.PowerShell.Management/New-Item?view=powershell-5.1
        # Example: New-Item -Path C:\LinkDir -ItemType SymbolicLink -Value F:\RealDir
        # Find a solution here: https://stackoverflow.com/a/44060418/881

        Execute-Server-Command $session "Removing current link in $env on $server..."        "CMD /C RMDIR $server_path_current"
        Execute-Server-Command $session "Linking current to $revision in $env on $server..." "CMD /C MKLINK /J $server_path_current $server_path_release"

        Execute-Server-Command $session "Removing log link in $env on $server..."            "CMD /C RMDIR $server_path_current_log"
        Execute-Server-Command $session "Linking log to current in $env on $server..."       "CMD /C MKLINK /J $server_path_current_log $server_path_shared_log"

        Remove-PSSession $session
    }
}

function Get-Mfg-Credentials() {
    $idsid = [Environment]::UserName
    $user = $idsid

    if($idsid.Contains('mfg_')) {
        $user = "amr\$idsid"
    } else {
        $user = "amr\mfg_$idsid"
    }

    return Get-Credential -UserName $user -Message 'Enter password'
}

function Execute-Server-Command($session, $message, $cmd) {
    Write-Output $message
    $sb = [scriptblock]::Create("$cmd")
    Invoke-Command -Session $session -ScriptBlock $sb
}

&$command
