import { PrismaClient } from '../generated/prisma'
import { withAccelerate } from '@prisma/extension-accelerate'

export type Password = {
  id: number,
  location1: string,
  location2: string | null,
  location3: string | null,
  username: string | null,
  email: string | null,
  password: string,
}

const globalForPrisma = global as unknown as { 
  prisma: PrismaClient
}

const db = globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

export default db