"use client"

import { useState } from "react";
import { Authenticate } from "./ui/Authenticate";
import { Password } from "./lib/db";
import styles from "./page.module.css";

export default function Page() {
  const [data, setData] = useState([] as Password[])

  return (
    <main className={styles.main}>
      {data.length === 0 && <Authenticate setData={setData} />}
      {data.length !== 0 && data.map(password => <p key={password.id.toString()}>{password.location1}</p>)}
    </main>
  )
}
