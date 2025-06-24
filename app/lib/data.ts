"use server"

import db, { Entry, InitialEntry, InitialPassword, Password } from '@/lib/db'

export async function get(): Promise<Entry[]> {
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
  return await db.entry.update({
    where: {
      id: id
    },
    data: {
      active: false
    }
  }) !== null
}

export async function add(entry: InitialEntry): Promise<Entry> {
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