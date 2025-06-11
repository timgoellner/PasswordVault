"use server"

import db from '@/lib/db'

export async function getAll() {
  return await db.password.findMany()
}

export async function remove(id: number) {
  return await db.password.delete({
    where: {
      id: id
    }
  })
}