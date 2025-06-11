import { Dispatch, SetStateAction } from 'react'
import { Password } from '@/lib/db'
import { validatePassword, validateToken } from '@/lib/authenticate'
import { getAll } from '@/lib/data'

interface props {
  setData: Dispatch<SetStateAction<Password[]>>
}

export function Authenticate({ setData }: props) {
  async function authenticate(formData: FormData) {
    const password = formData.get('password')
    const token = formData.get('token')

    if (!(await validatePassword(password as string) && await validateToken(token as string))) return;

    setData(await getAll())
  }

  return (
    <form action={authenticate}>
      <input name='password' type='password'/>
      <input name='token'/>
      <button type='submit'>Authenticate</button>
    </form>
  )
}