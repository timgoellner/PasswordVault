import * as otpauth from 'otpauth'
import QRCode from 'qrcode'
import bcrypt from 'bcrypt'
import crypto_ from 'crypto'
import fs from 'fs'
import readline from 'readline'
import { encrypt } from './app/lib/security.ts'

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
    const hashedPassword = await bcrypt.hash(passwordString as string, 10)

    const secret = new otpauth.Secret({ size: 20 })
    const totp = new otpauth.TOTP({
      issuer: "",
      label: "Password Vault",
      algorithm: "SHA1",
      digits: 6,
      secret: secret,
    })
    const otpauth_url = totp.toString()

    const key = crypto_.randomBytes(16).toString('hex')
    const keyData = await encrypt(key, passwordString as string)

    QRCode.toDataURL(otpauth_url, function (error: Error | null | undefined, url: string) {
      if (error) {
        console.error("QR Code generation error", error)
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
  <h2>TOTP_SECRET = '${secret.base32}'</h2>
  <h2>PASSWORD_HASH = '${(hashedPassword).replaceAll('$', '\\$')}'</h2>
  <br>
  <h2>KEY_CIPHER = '${keyData['cipher']}'</h2>
  <h2>KEY_IV = '${keyData['iv']}'</h2>
  <h2>KEY_SALT = '${keyData['salt']}'</h2>
  <br>
  <h2>DATABASE_URL = ''</h2>
  <br>
  <h1>Scan with Google Authenticator:</h1>
  <img src="${url}" />
</body>
</html>
`

      fs.writeFileSync('setup.html', fileContent, 'utf8')
      console.log("2fa qr-code and other credentials saved in setup.html")
    })

  } catch (error) {
    console.error("An error occurred:", error)
  }
}

main()