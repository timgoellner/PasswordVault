"use client"

import { useState } from "react";
import { Authenticate } from "./ui/Authenticate";
import styles from "./page.module.css";

export default function Page() {
  const [data, setData] = useState([]) as any[]

  return (
    <main className={styles.main}>
      <Authenticate setData={setData} />
      {data.length !== 0 && data}
    </main>
  )
}
