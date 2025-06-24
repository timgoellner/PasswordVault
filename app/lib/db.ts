import { PrismaClient } from '../generated/prisma'
import { withAccelerate } from '@prisma/extension-accelerate'

export type InitialEntry = Omit<Entry, 'id' | 'createdAt' | 'active' | 'password' | 'passwordId'> & {
  password: InitialPassword
}

export type Entry = {
  id: number,
  createdAt: Date,
  active: boolean,
  location1: string,
  location2: string | null,
  location3: string | null,
  username: string | null,
  email: string | null,
  password: Password,
  passwordId: number,
}

export type InitialPassword = Omit<Password, 'id' | 'entry'>

export type Password = {
  id: number,
  cipher: string,
  iv: string,
  salt: string,
  entry?: Entry | null
}

const globalForPrisma = global as unknown as { 
  prisma: PrismaClient
}

const db = globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

export default db