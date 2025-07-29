import { Entry } from "@/lib/types"
import { remove } from "@/lib/data"
import { Dispatch, SetStateAction, useState } from "react"
import { decrypt } from "@/lib/security"
import styles from "./Passwords.module.css"
import React from "react"

interface props {
  data: Entry[]
  setData: Dispatch<SetStateAction<Entry[]>>
  key_: string
}

export function Passwords({ data, setData, key_ }: props) {
  const [decrypted, setDecrypted] = useState<Record<number, string>>(data.reduce((previous, entry) => {
    previous[entry.id] = '-'.repeat(Math.floor(Math.random() * 10) + 10)
    return previous
  }, {} as Record<number, string>))
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({})

  function toggleRow(id: number) {
    setExpandedRows(previous => ({ ...previous, [id]: !previous[id] }));
  }

  async function handleRemove(entry: Entry, index: number) {
    const removed = await remove(entry.id)
    if (!removed) return

    setData(previous => {
      const newData = [...previous]
      newData.splice(index, 1)
      return newData
    })
  }

  async function handleReveal(entry: Entry) {
    if (decrypted[entry.id].match('^-+$')) {
      const decrypted = await decrypt(entry.password, key_)

      setDecrypted(previous => {
        return {
          ...previous,
          [entry.id]: decrypted
        }
      })
    }
  }

  return (
    <table className={styles.passwordTable}>
      <colgroup>
        <col span={1} />
        <col span={1} />
        <col span={1} />
        <col span={1} />
        <col span={1} />
        <col span={1} />
        <col span={1} />
      </colgroup>
      <thead>
        <tr className={styles.listItem}>
          <th>Location</th>
          <th></th>
          <th></th>
          <th><p>Username</p></th>
          <th><p>Email</p></th>
          <th><p>Password</p></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {data.map((entry, index) => {
          const isExpanded = expandedRows[entry.id];
          return (
            <React.Fragment key={entry.id}>
              <tr className={`${styles.listItem} ${isExpanded ? styles.expanded : ''}`}>
                <td>{entry.location1}</td>
                <td>{entry.location2}</td>
                <td>{entry.location3}</td>
                <td className={styles.desktopOnly}><p>{entry.username}</p></td>
                <td className={styles.desktopOnly}><p>{entry.email}</p></td>
                <td className={styles.desktopOnly}>
                  <span className={`${decrypted[entry.id].match('^-+$') ? styles.hide : ''}`} onClick={() => handleReveal(entry)}>
                    {decrypted[entry.id]}
                  </span>
                </td>
                <td>
                  <button className={`${styles.toggleButton} ${styles.mobileOnly}`} onClick={() => toggleRow(entry.id)}>
                    {isExpanded ? '▲' : '▼'}
                  </button>
                  <button onClick={async () => await handleRemove(entry, index)}>Remove</button>
                  <button onClick={async () => await handleRemove(entry, index)}>✖</button>
                </td>
              </tr>

              <tr className={`${styles.mobileOnly} ${isExpanded ? styles.expandedRow : styles.collapsedRow}`}>
                <td colSpan={7}>
                  <div className={styles.foldOutContent}>
                    {entry.username ? <div><strong>Username: </strong><span>{entry.username}</span></div> : ''}
                    {entry.email ? <div><strong>Email: </strong><span>{entry.email}</span></div> : ''}
                    <div>
                      <strong>Password: </strong>
                      <span className={`${decrypted[entry.id].match('^-+$') ? styles.hide : ''}`} onClick={() => handleReveal(entry)}>
                        {decrypted[entry.id]}
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            </React.Fragment>
          )
        })}
      </tbody>
    </table>
  )
}