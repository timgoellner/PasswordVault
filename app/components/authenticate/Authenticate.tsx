import { Dispatch, SetStateAction, useState } from 'react'
import { Entry } from '@/lib/types'
import { getEntries } from '@/lib/data'
import { authenticate } from '@/lib/authenticate'
import { BackgroundDesign } from '../ui/BackgroundDesign'
import styles from './Authenticate.module.css'

interface props {
  setLoggedIn: Dispatch<SetStateAction<boolean>>
  setData: Dispatch<SetStateAction<Entry[]>>
  setKey: Dispatch<SetStateAction<string>>
}

export function Authenticate({ setLoggedIn, setData, setKey }: props) {
  const [transition, setTransition] = useState(false)
  const [isError, setIsError] = useState(false)

  async function handleAuthenticate(formData: FormData) {
    const password = formData.get('password')
    const token = formData.get('token')

    const key = await authenticate(password as string, token as string)
    if (key === null) {
      setIsError(true)
      setTimeout(() => setIsError(false), 500)

      return
    }
    
    setTransition(true)
    
    setKey(key)
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