import { Entry } from "@/lib/db"
import { remove } from "@/lib/data"
import { Dispatch, SetStateAction, useState } from "react"
import { decrypt } from "@/lib/security"
import styles from "./Passwords.module.css"

interface props {
  data: Entry[]
  setData: Dispatch<SetStateAction<Entry[]>>
  password: string
}

export function Passwords({ data, setData, password }: props) {
  const [decrypted, setDecrypted] = useState<Record<number, string>>({})

  async function handleRemove(entry: Entry, index: number) {
    const removed = await remove(entry.id)
    if (!removed) return

    setData(previous => {
      const newData = [...previous]
      newData.splice(index, 1)
      return newData
    })
  }

  async function handleCheckbox(entry: Entry) {
    if (!(entry.id in decrypted)) {
      const decrypted = await decrypt(entry.password, password)

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
          <th>Username</th>
          <th>Email</th>
          <th>Password</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {data.map((entry, index) => (
          <tr className={styles.listItem} key={entry.id}>
            <td>{entry.location1}</td>
            <td>{entry.location2}</td>
            <td>{entry.location3}</td>
            <td>{entry.username}</td>
            <td>{entry.email}</td>
            <td>
              <label className={styles.hideLabel}>
                <span>{decrypted[entry.id] ?? '--------------------'}</span>
                <input type="checkbox" onChange={async () => await handleCheckbox(entry)}/>
              </label>
            </td>
            <td><button onClick={async () => await handleRemove(entry, index)}>Remove</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}