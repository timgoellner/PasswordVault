"use server"

import * as otpauth from "otpauth"
import bcrypt from "bcrypt"

export async function validatePassword(password: string) {
  return await bcrypt.compare(password, process.env.PASSWORD as string)
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