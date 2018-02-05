param(
  [Parameter(Mandatory = $true)]
  [String] $command,
  [Parameter(Mandatory = $true)]
  [String] $site,
  [Parameter(Mandatory = $true)]
  [String] $iispath,
  [Parameter(Mandatory = $true)]
  [String] $iisconfig,
  [Parameter(Mandatory = $true)]
  [String] $file
)

function Start-IisExpress() {
  $cred = Get-Sys-Credentials
  $iisexpress = $iispath + "\iisexpress.exe"
  $args = "/config:$iisconfig /site:$site"

  Write-Output "$iisexpress $args"

  Start-Process powershell -Credential $cred -ArgumentList "-noprofile -command &{Start-Process -FilePath '$iisexpress' -ArgumentList '$args'}"
}

function Get-Sys-Credentials() {
  if (Test-Path $file) {
    return Import-Clixml $file
  }

  return Get-Credential -Message 'Enter User name (domain\sys_   ) and Password to run IIS Express as:'
}

&$command
