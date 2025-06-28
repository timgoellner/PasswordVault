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