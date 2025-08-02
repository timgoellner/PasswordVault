"use server"

import jwt from 'jsonwebtoken'

import db from '@/lib/db'
import { Entry, InitialEntry, InitialPassword } from '@/lib/types'
import { cookies } from 'next/headers'

export async function getEntries(): Promise<Entry[]> {
  const cookieStore = await cookies()
  try { jwt.verify(cookieStore.get('jwt-token')?.value as string, process.env.JWT_SECRET as string) }
  catch { return [] }

  return await db.entry.findMany({
    where: {
      active: true
    },
    orderBy: [
      { location1: 'asc' },
      { location2: 'asc' },
      { location3: 'asc' }
    ],
    include: {
      password: true
    }
  })
}

export async function remove(id: number): Promise<boolean> {
  const cookieStore = await cookies()
  try { jwt.verify(cookieStore.get('jwt-token')?.value as string, process.env.JWT_SECRET as string) }
  catch { return false }

  return await db.entry.update({
    where: {
      id: id
    },
    data: {
      active: false
    }
  }) !== null
}

export async function add(entry: InitialEntry): Promise<Entry | null> {
  const cookieStore = await cookies()
  try { jwt.verify(cookieStore.get('jwt-token')?.value as string, process.env.JWT_SECRET as string) }
  catch { return null }

  return await db.entry.create({
    data: {
      location1: entry.location1 as string,
      location2: entry.location2 as string | null,
      location3: entry.location3 as string | null,
      username: entry.username as string | null,
      email: entry.email as string | null,
      password: {
        create: {
          cipher: (entry.password as InitialPassword).cipher,
          iv: (entry.password as InitialPassword).iv,
          salt: (entry.password as InitialPassword).salt
        }
      }
    },
    include: {
      password: true
    }
  })
}