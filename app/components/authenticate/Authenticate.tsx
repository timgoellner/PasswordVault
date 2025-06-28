import { Dispatch, SetStateAction, useState } from 'react'
import { Entry } from '@/lib/types'
import { getEntries } from '@/lib/data'
import { authenticate } from '@/lib/authenticate'
import { BackgroundDesign } from '../ui/BackgroundDesign'
import styles from './Authenticate.module.css'
import { cookies } from 'next/headers'

interface props {
  setLoggedIn: Dispatch<SetStateAction<boolean>>
  setData: Dispatch<SetStateAction<Entry[]>>
  setPassword: Dispatch<SetStateAction<string>>
}

export function Authenticate({ setLoggedIn, setData, setPassword }: props) {
  const [transition, setTransition] = useState(false)
  const [isError, setIsError] = useState(false)

  async function handleAuthenticate(formData: FormData) {
    const password = formData.get('password')
    const token = formData.get('token')

    const authenticated = await authenticate(password as string, token as string)
    if (authenticated === false) {
      setIsError(true);
      setTimeout(() => setIsError(false), 500)

      return
    }
    
    setTransition(true)

    // Only for testing
    setPassword("12345678" as string)
    setData(await getEntries())

    setTimeout(() => { setLoggedIn(true) }, 600)
  }
 
  return (
    <div className={styles.authenticatePage}>
      <div className={styles.authentication}>
        <BackgroundDesign />
        <h1>Password Vault</h1>
        <form className={styles.authenticationForm} action={handleAuthenticate}>
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