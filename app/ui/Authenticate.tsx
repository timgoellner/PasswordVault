import { Dispatch, SetStateAction, useState } from 'react'
import { Password } from '@/lib/db'
import { validatePassword, validateToken } from '@/lib/authenticate'
import { getAll } from '@/lib/data'
import styles from './Authenticate.module.css'

interface props {
  setLoggedIn: Dispatch<SetStateAction<boolean>>
  setData: Dispatch<SetStateAction<Password[]>>
}

export function Authenticate({ setLoggedIn, setData }: props) {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  async function authenticate(formData: FormData) {
    const password = formData.get('password')
    const token = formData.get('token')

    if (!(await validatePassword(password as string) && await validateToken(token as string))) {
      setIsError(true);
      setTimeout(() => setIsError(false), 500)

      return
    }

    setIsLoading(true)
    setTimeout(async () => {
      setData(await getAll())
      setLoggedIn(true)
    }, 800)
  }

  return (
    <div className={styles.authenticate_page}>
      <div className={styles.authentication}>
        <div className={styles.design}>
          <div></div>
          <div><div></div></div>
          <div><div></div></div>
        </div>
        <h1>Password Vault</h1>
        <form className={styles.authenticationForm} action={authenticate}>
          <span>
            <p>Password</p>
            <input name='password' type='password'/>
          </span>
          <span>
            <p>Token</p>
            <input name='token'/>
          </span>
          <button type='submit' className={isError ? styles.error : ''}>Authenticate</button>
        </form>
      </div>
      <div className={`${styles.side} ${isLoading ? styles.transition : ''}`}></div>
    </div>
  )
}