"use client"

import { useState } from "react";
import { Authenticate } from "./ui/Authenticate";
import { Passwords } from "./ui/Passwords";
import { Password } from "./lib/db";
import styles from "./page.module.css";
import { getAll } from "./lib/data";

export default function Page() {
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <main className={styles.main}>
      {!loggedIn && <Authenticate setLoggedIn={setLoggedIn} />}
      {loggedIn && (
        <Passwords />
      )}
    </main>
  )
}
