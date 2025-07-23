"use client"

import { useMemo, useState } from "react";
import { Authenticate } from "@/components/authenticate/Authenticate";
import { Passwords } from "@/components/passwords/Passwords";
import { AddEntry } from "@/components/addEntry/AddEntry";
import { Entry } from "@/lib/types";
import { logout } from "@/lib/authenticate";
import styles from "./page.module.css";

export default function Page() {
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)

  const [addActive, setAddActive] = useState(false)
  const [transition, setTransition] = useState(false)

  const [data, setData] = useState([] as Entry[])
  const [query, setQuery] = useState('')


  const filtered = useMemo(() => {
    return data.filter((password) => (
      (password.location1 + ' ' + password.location2 + ' ' + password.location3)
        .toLowerCase()
        .includes(query.toLowerCase())
    ))
  }, [data, query])

  function handleSwitch() {
    setTransition(true)

    setTimeout(() => {
      setAddActive(true)
      setTransition(false)
    }, 800)
  }

  function handleLogout() {
    setTransition(true)

    setTimeout(() => {
      logout()

      setData([])
      setQuery('')
      setPassword('')

      setLoggedIn(false)
      setTransition(false)
    }, 800)
  }

  return (
    <main>
      { !loggedIn && <Authenticate setLoggedIn={setLoggedIn} setData={setData} setPassword={setPassword} /> }
      { loggedIn && !addActive &&
        <div className={styles.passwordsPage}>
          <div className={`${styles.side} ${transition ? styles.transition : ''}`}>
            <div>
              <p>P</p>
              <p>a</p>
              <p>s</p>
              <p>s</p>
              <p>w</p>
              <p>o</p>
              <p>r</p>
              <p>d</p>
              <p>s</p>
            </div>
          </div>
          <div className={styles.passwords}>
            <h1>Passwords</h1>
            <div className={styles.controls}>
              <input type='text' placeholder='Search' value={query} onChange={(event) => setQuery(event.target.value)} />
              <button onClick={() => handleSwitch()}>Add Entry</button>
            </div>
            <div>
              <Passwords data={filtered} setData={setData} password={password}/>
            </div>
          </div>
          <button onClick={() => handleLogout()}>Logout</button>
        </div>
      }
      { loggedIn && addActive && <AddEntry setData={setData} setAddActive={setAddActive} password={password} /> }
    </main>
  )
}
