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
      (password.location1 + password.location2 + password.location3)
        .toLowerCase()
        .includes(query.toLowerCase())
    ))
  }, [data, query])

  return (
    <main className={styles.main}>
      { !loggedIn && <Authenticate setLoggedIn={setLoggedIn} setData={setData} /> }
      { loggedIn && !addActive &&
        <div>
          <input type='text' placeholder='search...' value={query} onChange={(event) => setQuery(event.target.value)} />
          <Passwords data={filtered} setData={setData}/>
          <button onClick={() => setAddActive(true)}>add entry</button>
        </div>
      }
      { loggedIn && addActive && <AddEntry data={data} setData={setData} setAddActive={setAddActive} /> }
    </main>
  )
}
