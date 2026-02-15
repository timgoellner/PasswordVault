export type DatabaseRow = Omit<Entry, 'password'> & Password & {
  passwordid: number
}

export type InitialEntry = Omit<Entry, 'id' | 'timestamp' | 'active'>

export type Entry = {
  id: number,
  timestamp: Date,
  active: boolean,
  location1: string,
  location2: string | null,
  location3: string | null,
  username: string | null,
  email: string | null,
  password: Password
}

export type Password = {
  cipher: string,
  iv: string,
  salt: string
}

export function rowToEntry(data: DatabaseRow): Entry {
  const password: Password = {
    cipher: data.cipher,
    iv: data.iv,
    salt: data.salt
  }

  const entry: Entry = {
    id: data.id,
    timestamp: data.timestamp,
    active: data.active,
    location1: data.location1,
    location2: data.location2,
    location3: data.location3,
    username: data.username,
    email: data.email,
    password: password
  }

  return entry
}