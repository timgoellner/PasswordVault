import { PrismaClient, Prisma } from "../app/generated/prisma"

const prisma = new PrismaClient()

const passwordData: Prisma.PasswordCreateInput[] = [{
  location1: 'server',
  location2: 'database',
  username: 'test',
  password: '1234'
}]

export async function main() {
  for (const password of passwordData) {
    await prisma.password.create({ data: password })
  }
}

main()