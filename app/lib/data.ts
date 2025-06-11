"use server"

import db from '@/lib/db'

export async function getAll() {
  return db.password.findMany()
}