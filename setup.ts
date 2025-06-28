const otpauth = require('otpauth')
const QRCode = require('qrcode')
const bcrypt = require('bcrypt')
const crypto_ = require('crypto')
const fs = require('fs')
const readline = require('readline')

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const askQuestion = (query: string) => new Promise(resolve => rl.question(query, resolve))

  try {
    const jwtSecret = crypto_.randomBytes(32).toString('hex')

    const passwordString = await askQuestion("Enter your authentication password: ")
    rl.close()
    const hashedPassword = await bcrypt.hash(passwordString, 10) as string

    const secret = new otpauth.Secret({ size: 20 })
    const totp = new otpauth.TOTP({
      issuer: "",
      label: "Password Vault",
      algorithm: "SHA1",
      digits: 6,
      secret: secret,
    })
    const otpauth_url = totp.toString()

    QRCode.toDataURL(otpauth_url, function (err: string, url: string) {
      if (err) {
        console.error("QR Code generation error:", err)
        return
      }

      const fileContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>2FA QR-Code</title>
</head>
<body>
  <h1>Paste into .env:</h1>
  <h2>JWT_SECRET = '${jwtSecret}'</h2>
  <h2>PASSWORD_HASH = '${hashedPassword.replaceAll('$', '\\$')}'</h2>
  <h2>TOTP_SECRET = '${secret.base32}'</h2>
  <br>
  <h1>Scan with Google Authenticator:</h1>
  <img src="${url}" />
</body>
</html>
`

      fs.writeFileSync('setup.html', fileContent, 'utf8')
      console.log("2FA QR-Code, Secret, and Hashed Password saved in setup.html")
    })

  } catch (error) {
    console.error("An error occurred:", error)
  }
}

main()