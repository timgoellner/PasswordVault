"use server"

import * as otpauth from 'otpauth'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { decrypt } from './security'
import { Password } from './types'

export async function validatePassword(password: string) {
  return await bcrypt.compare(password, process.env.PASSWORD_HASH as string)
}

export async function validateToken(token: string) {
  const totp = new otpauth.TOTP({
    issuer: "",
    label: "Password Vault",
    algorithm: "SHA1",
    digits: 6,
    secret: process.env.TOTP_SECRET,
  })

  return totp.validate({token, window: 1}) !== null
}

export async function authenticate(password: string, token: string) {
  if (!(await validateToken(token as string) && await validatePassword(password as string))) return null

  const jwtToken = jwt.sign({}, process.env.JWT_SECRET as string, { expiresIn: '10m' })
  const cookieStore = await cookies()
  cookieStore.set('jwt-token', jwtToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
  })

  const keyData = {
    cipher: process.env.KEY_CIPHER as string,
    iv: process.env.KEY_IV as string,
    salt: process.env.KEY_SALT as string
  } as Password

  return decrypt(keyData, password)
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('jwt-token')
}