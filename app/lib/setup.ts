var otpauth = require('otpauth')
var QRCode = require('qrcode')

var fs = require('fs')

try {
  const secret = new otpauth.Secret({ size: 20 })

  let totp = new otpauth.TOTP({
    issuer: "",
    label: "Password Vault",
    algorithm: "SHA1",
    digits: 6,
    secret: secret,
  })
  

  let otpauth_url = totp.toString()
  QRCode.toDataURL(otpauth_url, function (err: string, url: string) {
    let fileContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>2FA QR-Code</title>
</head>
<body>
  <h2>Secret: ${secret.base32}</h2>
  <img src="${url}" />
</body>
</html>
`

    fs.writeFileSync('2fa_qrcode.html', fileContent, 'utf8')
    console.log("2FA QR-Code and Secret can be viewed in 2fa_qrcode.html")
  })
} catch (error) {
  console.log(error)
}
