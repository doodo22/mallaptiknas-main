# Script untuk test upload artikel

$uri = "http://localhost:3000/api/blog"

# Buat boundary unik
$boundary = [System.Guid]::NewGuid().ToString()

# Buat body multipart/form-data
$bodyLines = @()
$bodyLines += "--$boundary"
$bodyLines += "Content-Disposition: form-data; name=`"title`""
$bodyLines += ""
$bodyLines += "Artikel Test PowerShell"

$bodyLines += "--$boundary"
$bodyLines += "Content-Disposition: form-data; name=`"category`""
$bodyLines += ""
$bodyLines += "Test"

$bodyLines += "--$boundary"
$bodyLines += "Content-Disposition: form-data; name=`"author`""
$bodyLines += ""
$bodyLines += "Admin"

$bodyLines += "--$boundary"
$bodyLines += "Content-Disposition: form-data; name=`"content`""
$bodyLines += ""
$bodyLines += "Ini adalah artikel test yang diupload via PowerShell untuk debugging."

$bodyLines += "--$boundary--"

$body = $bodyLines -join "`r`n"

$headers = @{
    "Content-Type" = "multipart/form-data; boundary=$boundary"
}

try {
    Write-Host "Mengirim request ke $uri..." -ForegroundColor Yellow
    $response = Invoke-WebRequest -Uri $uri -Method Post -Body $body -Headers $headers
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
}