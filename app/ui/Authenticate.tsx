import { Dispatch, SetStateAction, useState } from 'react'
import { Entry } from '@/lib/db'
import { validatePassword, validateToken } from '@/lib/authenticate'
import { get } from '@/lib/data'
import styles from './Authenticate.module.css'

interface props {
  setLoggedIn: Dispatch<SetStateAction<boolean>>
  setData: Dispatch<SetStateAction<Entry[]>>
  setPassword: Dispatch<SetStateAction<string>>
}

export function Authenticate({ setLoggedIn, setData, setPassword }: props) {
  const [transition, setTransition] = useState(false)
  const [isError, setIsError] = useState(false)

  async function authenticate(formData: FormData) {
    const password = formData.get('password')
    const token = formData.get('token')

    
    if (!(await validateToken(token as string) && await validatePassword(password as string))) {
      setIsError(true);
      setTimeout(() => setIsError(false), 500)

      return
    }
    

    setTransition(true)
    setTimeout(async () => {
      setPassword("12345678" as string)
      setData(await get())
      setLoggedIn(true)
    }, 600)
  }

  return (
    <div className={styles.authenticatePage}>
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
      <div className={`${styles.side} ${transition ? styles.transition : ''}`}></div>
    </div>
  )
}