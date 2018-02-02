param(
    [Parameter(Mandatory = $true)]
    [String] $command,
    [Parameter(Mandatory = $false)]
    [String] $iispath,
    [Parameter(Mandatory = $false)]
    [String] $iisconfig
)

function Start-IisExpress() {
    $cred = Get-Sys-Credentials
    $iisexpress = $iispath + "\iisexpress.exe"
    $args = "/config:$iisconfig /site:$site"

    Write-Output ""
    Write-Output "iisexpress: $iisexpress"
    Write-Output ""
    Write-Output "args: $args"

    Start-Process powershell -Credential $cred -ArgumentList "-noprofile -command &{Start-Process -FilePath '$iisexpress' -ArgumentList '$args'}"
}

function Get-Sys-Credentials() {
    $file = "system.xml"

    if (Test-Path $file) {
        return Import-Clixml $file
    }

    return Get-Credential -Message 'Enter User name (domain\sys_   ) and Password to run IIS Express as:'
}

&$command
