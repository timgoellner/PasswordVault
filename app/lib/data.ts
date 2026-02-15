"use server"

import jwt from 'jsonwebtoken'

import db from '@/lib/db'
import { Entry, InitialEntry, DatabaseRow, rowToEntry } from '@/lib/types'
import { cookies } from 'next/headers'

export async function getEntries(): Promise<Entry[]> {
  const cookieStore = await cookies()
  try { jwt.verify(cookieStore.get('jwt-token')?.value as string, process.env.JWT_SECRET as string) }
  catch { return [] }

  const query = `
  SELECT entry.*, password.cipher, password.iv, password.salt FROM entry
  LEFT JOIN password
    ON entry.passwordid = password.id
    WHERE entry.active = TRUE
    ORDER BY entry.location1 ASC, entry.location2 ASC, entry.location3 ASC`
  
  const response = await db.query(query)
  const entries = response.rows.map((row: DatabaseRow) => rowToEntry(row))

  return entries
}

export async function remove(id: number): Promise<boolean> {
  const cookieStore = await cookies()
  try { jwt.verify(cookieStore.get('jwt-token')?.value as string, process.env.JWT_SECRET as string) }
  catch { return false }

  const query = `
  UPDATE entry
    SET active = FALSE
    WHERE id = $1`
  const values = [id]
  const response = await db.query(query, values)
  
  if (response.rowCount === 1) { return true }
  else { return false }
}

export async function add(entry: InitialEntry): Promise<boolean> {
  const cookieStore = await cookies()
  try { jwt.verify(cookieStore.get('jwt-token')?.value as string, process.env.JWT_SECRET as string) }
  catch { return false }

  const passwordQuery = `
  INSERT INTO password (cipher, iv, salt)
    VALUES ($1, $2, $3)
    RETURNING id;`
  const passwordValues = [
    entry.password.cipher,
    entry.password.iv,
    entry.password.salt
  ]

  const passwordResponse = await db.query(passwordQuery, passwordValues)

  const entryQuery = `
  INSERT INTO entry (location1, location2, location3, username, email, passwordid)
    VALUES ($1, $2, $3, $4, $5, $6);`
  const entryValues = [
    entry.location1,
    entry.location2,
    entry.location3,
    entry.username,
    entry.email,
    passwordResponse.rows[0].id
  ]

  await db.query(entryQuery, entryValues)
  return true
}