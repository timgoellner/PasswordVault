"use server"

import db, { Password } from '@/lib/db'

export async function getAll(): Promise<Password[]> {
  return await db.password.findMany()
}

export async function remove(id: number): Promise<Password> {
  return await db.password.delete({
    where: {
      id: id
    }
  })
}

export async function add(password: Record<string, string | null>): Promise<Password> {
  return await db.password.create({
    data: {
      location1: password.location1 as string,
      location2: password.location2,
      location3: password.location3,
      username: password.username,
      email: password.email,
      password: password.password as string
    }
  })
}