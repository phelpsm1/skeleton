param(
    [Parameter(Mandatory = $true)]
    [String]$command,
    [Parameter(Mandatory = $false)]
    [String]$env,
    [Parameter(Mandatory = $true)]
#     [String]$action,
#     [Parameter (Mandatory = $false)]
#     [String]$rev,
#     [Parameter (Mandatory = $false)]
    [Array]$servers,
    [Parameter (Mandatory = $true)]
    [String]$name,
    [Parameter (Mandatory = $true)]
    [String]$apppool,
    [Parameter (Mandatory = $true)]
    [String]$site,
    [Parameter (Mandatory = $true)]
    [String]$app_offline_dest
)

$app_offline_file = "app_offline.htm"

function Take-Offline() {
    Write-Output "Taking $name offline in $env..."

    foreach ($server in $servers) {
        $dest = "\\$server\$app_offline_dest"

        Copy-Item $app_offline_file -Destination $dest

        Write-Output "...by copying $app_offline_file to $dest"
    }
}

function Take-Online() {
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

    foreach ($server in $servers) {
        $session = New-PSSession -ComputerName $server -Credential $cred

        Write-Output ""
        Write-Output "Stopping $name in $env on $server..."
        Write-Output ""

        Execute-Server-Command "Stopping application pool..." "%systemroot%\system32\inetsrv\appcmd stop apppool $apppool"

        Execute-Server-Command "Stopping website..." "%systemroot%\system32\inetsrv\appcmd stop site $site"

        Remove-PSSession $session
    }
}

function Bring-Up() {
    $cred = Get-Mfg-Credentials

    foreach ($server in $servers) {
        $session = New-PSSession -ComputerName $server -Credential $cred

        Write-Output ""
        Write-Output "Starting $name in $env on $server..."
        Write-Output ""

        Execute-Server-Command "Starting application pool..." "%systemroot%\system32\inetsrv\appcmd start apppool $apppool"

        Execute-Server-Command "Starting website..." "%systemroot%\system32\inetsrv\appcmd start site $site"

        Remove-PSSession $session
    }
}

# function Get-Status() {
#     # if($env -eq "local") {
#     #     return
#     # }
#
#     # $cred = Get-Mfg-Credentials
#
#     foreach ($server in $servers) {
#         # $session = New-PSSession -ComputerName $server -Credential $cred
#
#         Write-Output ""
#         Write-Output "Getting application pool status for $env on $server..."
#         Write-Output ""
#
#         # Execute-Server-Command "Application pool status is..." "%systemroot%\system32\inetsrv\appcmd list apppool Trans$env"
#
#         # Remove-PSSession $session
#     }
# }

# function Recycle() {
#     if($env -eq "local") {
#         return
#     }
#
#     $cred = Get-Mfg-Credentials
#
#     foreach ($server in $servers) {
#         $session = New-PSSession -ComputerName $server -Credential $cred
#
#         Write-Output ""
#         Write-Output "Recycling Trans in $env on $server..."
#         Write-Output ""
#
#         Execute-Server-Command "Recycling  application pool..." "%systemroot%\system32\inetsrv\appcmd recycle apppool Trans$env"
#
#         Remove-PSSession $session
#     }
# }

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

# function Execute-Local-Command($message, $cmd) {
#     Write-Output $message
#     $sb = [scriptblock]::Create("CMD /C $cmd")
#     Invoke-Command -ScriptBlock $sb
# }

# function Execute-Server-Command($message, $cmd) {
#     Write-Output $message
#     $sb = [scriptblock]::Create("CMD /C $cmd")
#     Invoke-Command -Session $session -ScriptBlock $sb
# }

# function Get-Revision {
#     $rev = (Invoke-Expression 'svn info')[6].Split(' ')[1]
#     return $rev.replace("`n", "").replace("`r", "").replace("`t", "")
# }

&$command
