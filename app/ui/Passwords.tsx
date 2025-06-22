import { Password } from "@/lib/db"
import { remove } from "@/lib/data"
import { Dispatch, SetStateAction } from "react"
import styles from "./Passwords.module.css"

interface props {
  data: Password[]
  setData: Dispatch<SetStateAction<Password[]>>
}

export function Passwords({ data, setData }: props) {
  async function handleRemove(password: Password, index: number) {
    const removed = await remove(password.id)
    if (removed == null) return

    const newData = [...data]
    newData.splice(index, 1)
    setData(newData)
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
        {data.map((password, index) => (
          <tr className={styles.listItem} key={password.id}>
            <td>{password.location1}</td>
            <td>{password.location2}</td>
            <td>{password.location3}</td>
            <td>{password.username}</td>
            <td>{password.email}</td>
            <td>
              <label className={styles.hideLabel}>
                <span>{password.password}</span>
                <input type="checkbox"/>
              </label>
            </td>
            <td><button onClick={async () => await handleRemove(password, index)}>Remove</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}