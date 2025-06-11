"use server"

import * as otpauth from "otpauth"

export async function validatePassword(password: string) {
  return password === process.env.PASSWORD
}

export async function validateToken(token: string) {
  let totp = new otpauth.TOTP({
    issuer: "",
    label: "Password Vault",
    algorithm: "SHA1",
    digits: 6,
    secret: process.env.SECRET,
  })

  return totp.validate({token, window: 1}) !== null
}