"use client"

import { useMemo, useState } from "react";
import { Authenticate } from "./ui/Authenticate";
import { Passwords } from "./ui/Passwords";
import { Entry } from "./lib/db";
import styles from "./page.module.css";
import AddEntry from "./ui/AddEntry";

export default function Page() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [addActive, setAddActive] = useState(false)

  const [data, setData] = useState([] as Entry[])
  const [query, setQuery] = useState('')

  const [password, setPassword] = useState('')

  const filtered = useMemo(() => {
    return data.filter((password) => (
      (password.location1 + ' ' + password.location2 + ' ' + password.location3)
        .toLowerCase()
        .includes(query.toLowerCase())
    ))
  }, [data, query])

  return (
    <main>
      { !loggedIn && <Authenticate setLoggedIn={setLoggedIn} setData={setData} setPassword={setPassword} /> }
      { loggedIn && !addActive &&
        <div className={styles.passwordsPage}>
          <div className={styles.side}>
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
            <div className={styles.controls}>
              <input type='text' placeholder='Search' value={query} onChange={(event) => setQuery(event.target.value)} />
              <button onClick={() => setAddActive(true)}>Add Entry</button>
            </div>
            <div>
              <Passwords data={filtered} setData={setData} password={password}/>
            </div>
          </div>
        </div>
      }
      { loggedIn && addActive && <AddEntry setData={setData} setAddActive={setAddActive} password={password} /> }
    </main>
  )
}
