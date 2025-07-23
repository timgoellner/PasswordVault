import { Dispatch, SetStateAction, useState } from "react"
import { add, getEntries } from "@/lib/data"
import { Entry, InitialEntry, InitialPassword } from "@/lib/types"
import { encrypt } from "@/lib/security"
import { BackgroundDesign } from "../ui/BackgroundDesign"
import styles from './AddEntry.module.css'

interface props {
  setData: Dispatch<SetStateAction<Entry[]>>
  setAddActive: Dispatch<SetStateAction<boolean>>
  password: string
}

const enum ErrorFlags {
  NONE = 0,
  LOCATION = 1 << 0,
  IDENTIFIER = 1 << 1,
  PASSWORD = 1 << 2
}

export function AddEntry({ setData, setAddActive, password }: props) {
  const [transition, setTransition] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [errorState, setErrorState] = useState(0)

  async function addEntry(formData: FormData) {
    let entry: Record<string, InitialPassword | string | null> = {}

    for (const key of formData.keys()) {
      const value = formData.get(key) as string

      if (key === 'password') entry['password'] = (value === '') ? null : await encrypt(value, password)
      else entry[key] = (value === '') ? null : value
    }

    

    const locationError = entry.location1 === null || (entry.location2 === null && entry.location3 !== null)
    const identifierError = entry.username === null && entry.email === null
    const passwordError = entry.password === null

    if (locationError || identifierError || passwordError) {
      if (locationError) { setErrorState(previous => previous | ErrorFlags.LOCATION) }
      if (identifierError) { setErrorState(previous => previous | ErrorFlags.IDENTIFIER) }
      if (passwordError) { setErrorState(previous => previous | ErrorFlags.PASSWORD) }

      setTimeout(() => setErrorState(0), 500)
      return
    }

    const created = await add(entry as InitialEntry)
    if (created === null) return

    setData(await getEntries())
    handleBack()
  }

  function handleBack() {
    setTransition(true)

    setTimeout(async () => {
      setAddActive(false)
    }, 500)
  }

  return (
    <div className={styles.addEntryPage}>
      <div className={styles.addEntry}>
        <BackgroundDesign />
        <h1>Add an Entry</h1>
        <form action={addEntry} className={styles.addEntryForm}>
          <div>
            <span>
              <p>Location</p>
              <input className={errorState & ErrorFlags.LOCATION ? styles.error : ''} name='location1' />
            </span>
            <input className={errorState & ErrorFlags.LOCATION  ? styles.error : ''} name='location2' />
            <input className={errorState & ErrorFlags.LOCATION  ? styles.error : ''} name='location3' />
          </div>
          <div>
            <span>
              <p>Username</p>
              <input className={errorState & ErrorFlags.IDENTIFIER  ? styles.error : ''} name='username' />
            </span>
            <span>
              <p>Email</p>
              <input className={errorState & ErrorFlags.IDENTIFIER  ? styles.error : ''} name='email' />
            </span>
            <span className={styles.passwordField}>
              <p>Password</p>
              <input type={showPassword ? 'text' : 'password'} className={errorState & ErrorFlags.PASSWORD  ? styles.error : ''} name='password' />
              <button type='button' onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M18.2371 15.1157C19.0484 14.3833 19.7137 13.6416 20.188 13.0657C20.5762 12.5944 20.7703 12.3588 20.7703 12C20.7703 11.6412 20.5762 11.4056 20.188 10.9343C18.768 9.21014 15.6357 6 12 6C11.1605 6 10.3479 6.17115 9.57695 6.45563L12.1238 9.00251C13.6822 9.06577 14.9342 10.3178 14.9975 11.8762L18.2371 15.1157ZM9.39308 10.5144C9.14295 10.9524 9.00001 11.4595 9.00001 12C9.00001 13.6569 10.3432 15 12 15C12.5405 15 13.0476 14.8571 13.4856 14.6069L15.7872 16.9085C14.636 17.5555 13.3529 18 12 18C8.36428 18 5.23207 14.7899 3.81198 13.0657C3.42382 12.5944 3.22974 12.3588 3.22974 12C3.22974 11.6412 3.42382 11.4056 3.81198 10.9343C4.48541 10.1167 5.54385 8.96489 6.85842 7.97974L9.39308 10.5144Z" fill="#33363F"/>
                    <path d="M5 2L21 18" stroke="#33363F" strokeWidth="2"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M20.7703 12C20.7703 11.6412 20.5762 11.4056 20.188 10.9343C18.768 9.21014 15.6357 6 12 6C8.36428 6 5.23207 9.21014 3.81198 10.9343C3.42382 11.4056 3.22974 11.6412 3.22974 12C3.22974 12.3588 3.42382 12.5944 3.81198 13.0657C5.23207 14.7899 8.36428 18 12 18C15.6357 18 18.768 14.7899 20.188 13.0657C20.5762 12.5944 20.7703 12.3588 20.7703 12ZM12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3432 9 9.00002 10.3431 9.00002 12C9.00002 13.6569 10.3432 15 12 15Z" fill="#33363F"/>
                  </svg>
                )}
              </button>
            </span>
          </div>
          <div className={styles.formActions}>
            <button type='submit' className={errorState !== 0 ? styles.error : ''}>Add Entry</button>
            <button type='button' onClick={() => handleBack()}>Back</button>
          </div>
          <p></p>
        </form>
      </div>
      <div className={`${styles.side} ${transition ? styles.transition : ''}`}></div>
    </div>
  )
}