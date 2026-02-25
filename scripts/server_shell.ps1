param(
  [ValidateSet("frontend","backend")]
  [string]$Target = "frontend"
)

$ErrorActionPreference = "Stop"

$path = "/var/www/osteps/Osteps"
if ($Target -eq "backend") {
  $path = "/var/www/laravel"
}

$cmd = "cd $path ; exec bash -l"
ssh root@dashboard.osteps.com $cmd
