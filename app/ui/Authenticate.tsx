import { Dispatch, SetStateAction } from 'react'
import { validatePassword, validateToken } from '@/lib/authenticate'
import { connectionPool } from '@/lib/db'

interface props {
  setData: Dispatch<SetStateAction<Array<any>>>
}

export function Authenticate({ setData }: props) {
  async function authenticate(formData: FormData) {
    const password = formData.get('password')
    const token = formData.get('token')

    if (!(await validatePassword(password as string) && await validateToken(token as string))) return;

    const data = (await connectionPool.query('SELECT * FROM password-vault')).rows
    setData(data)
  }

  return (
    <form action={authenticate}>
      <input name='password' />
      <input name='token' />
      <button type='submit'>Authenticate</button>
    </form>
  )
}