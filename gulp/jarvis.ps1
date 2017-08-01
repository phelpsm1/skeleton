param(
    [Parameter(Mandatory = $true)]
    [String]$command,
    [Parameter(Mandatory = $false)]
    [String]$env,
    [Parameter(Mandatory = $false)]
#     [String]$action,
#     [Parameter (Mandatory = $false)]
#     [String]$rev,
#     [Parameter (Mandatory = $false)]
    [Array]$servers,
    [Parameter (Mandatory = $false)]
    [String]$name,
    [Parameter (Mandatory = $false)]
    [String]$apppool,
    [Parameter (Mandatory = $false)]
    [String]$site,
    [Parameter (Mandatory = $false)]
    [String]$app_offline_dest
)

$app_offline_file = "app_offline.htm"
$appcmd = "%systemroot%\system32\inetsrv\appcmd"

function Take-Offline() {
    Write-Output ""
    Write-Output "Taking $name offline in $env..."

    foreach ($server in $servers) {
        $dest = "\\$server\$app_offline_dest"

        Copy-Item $app_offline_file -Destination $dest

        Write-Output "...by copying $app_offline_file to $dest"
    }
}

function Take-Online() {
    Write-Output ""
    Write-Output "Bringing $name online in $env..."

    foreach ($server in $servers) {
        $file = "\\$server\$app_offline_dest\$app_offline_file"

        if (Test-Path $file) {
            Remove-Item -Path $file

            Write-Output "...by deleting $file"
        } else {
            Write-Output "...$file not found"
        }
    }
}

function Bring-Down() {
    $cred = Get-Mfg-Credentials

    Write-Output ""

    foreach ($server in $servers) {
        $session = New-PSSession -ComputerName $server -Credential $cred

        Execute-Server-Command "Stopping $name application pool in $env on $server..." "$appcmd stop apppool $apppool"
        Execute-Server-Command "Stopping $name website in $env on $server..."          "$appcmd stop site $site"

        Remove-PSSession $session
    }
}

function Bring-Up() {
    $cred = Get-Mfg-Credentials

    Write-Output ""

    foreach ($server in $servers) {
        $session = New-PSSession -ComputerName $server -Credential $cred

        Execute-Server-Command "Starting $name application pool in $env on $server..." "$appcmd start apppool $apppool"
        Execute-Server-Command "Starting $name website in $env on $server..."          "$appcmd start site $site"

        Remove-PSSession $session
    }
}

function Recycle() {
    $cred = Get-Mfg-Credentials

    Write-Output ""

    foreach ($server in $servers) {
        $session = New-PSSession -ComputerName $server -Credential $cred

        Execute-Server-Command "Recycling $name application pool in $env on $server..." "$appcmd recycle apppool $apppool"

        Remove-PSSession $session
    }
}

function Get-Status() {
    $cred = Get-Mfg-Credentials

    Write-Output ""

    foreach ($server in $servers) {
        $session = New-PSSession -ComputerName $server -Credential $cred

        Execute-Server-Command "$name application pool status in $env on $server is..." "$appcmd list apppool $apppool"
        Execute-Server-Command "$name website status in $env on $server is..."          "$appcmd list site $site"

        Remove-PSSession $session
    }
}

# function Set-Current() {
#     if($rev -eq "") {
#         $rev = Get-Revision
#     }
#
#     if($env -eq "local") {
#         Execute-Local-Command "Removing current link..." "RMDIR C:\WorkTemp\transLocal\current"
#         Execute-Local-Command "Linking current to $rev..." "MKLINK /J C:\WorkTemp\transLocal\current C:\WorkTemp\transLocal\releases\$rev"
#         return
#     }
#
#     $server_root = "D:\WebSites\Capital\Trans\$env"
#     $server_current_path = "$server_root\current"
#     $server_release_path = "$server_root\releases\$rev"
#     $cred = Get-Mfg-Credentials
#
#     foreach ($server in $servers) {
#         $session = New-PSSession -ComputerName $server -Credential $cred
#         Write-Output $server
#
#         Execute-Server-Command "Removing current link..." "RMDIR $server_current_path"
#         Execute-Server-Command "Linking current to $rev..." "MKLINK /J $server_current_path $server_release_path"
#
#         Remove-PSSession $session
#     }
# }

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

function Execute-Local-Command($message, $cmd) {
    Write-Output $message
    $sb = [scriptblock]::Create("CMD /C $cmd")
    Invoke-Command -ScriptBlock $sb
}

function Execute-Server-Command($message, $cmd) {
    Write-Output $message
    $sb = [scriptblock]::Create("$cmd")
    Invoke-Command -Session $session -ScriptBlock $sb
}

# function Get-Revision {
#     $rev = (Invoke-Expression 'svn info')[6].Split(' ')[1]
#     return $rev.replace("`n", "").replace("`r", "").replace("`t", "")
# }

&$command
