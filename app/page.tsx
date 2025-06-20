"use client"

import { useMemo, useState } from "react";
import { Authenticate } from "./ui/Authenticate";
import { Passwords } from "./ui/Passwords";
import { Password } from "./lib/db";
import styles from "./page.module.css";
import AddEntry from "./ui/AddEntry";

export default function Page() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [addActive, setAddActive] = useState(false)

  const [data, setData] = useState([] as Password[])
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return data.filter((password) => (
      (password.location1 + ' ' + password.location2 + ' ' + password.location3)
        .toLowerCase()
        .includes(query.toLowerCase())
    ))
  }, [data, query])

  return (
    <main>
      { !loggedIn && <Authenticate setLoggedIn={setLoggedIn} setData={setData} /> }
      { loggedIn && !addActive &&
        <div className={styles.passwords_page}>
          <div className={styles.side}></div>
          <div>
            <h1>Passwords</h1>
            <div>
              <input type='text' placeholder='search...' value={query} onChange={(event) => setQuery(event.target.value)} />
              <button onClick={() => setAddActive(true)}>add entry</button>
            </div>
            <Passwords data={filtered} setData={setData}/>
          </div>
        </div>
      }
      { loggedIn && addActive && <AddEntry data={data} setData={setData} setAddActive={setAddActive} /> }
    </main>
  )
}
