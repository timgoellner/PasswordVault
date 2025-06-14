import { Password } from "@/lib/db"
import { remove } from "@/lib/data"
import { Dispatch, SetStateAction } from "react"

interface props {
  data: Password[]
  setData: Dispatch<SetStateAction<Password[]>>
}

export function Passwords({ data, setData }: props) {
  async function handleRemove(password: Password, index: number) {
    const newData = [...data]
    newData.splice(index, 1)
    setData(newData)

    await remove(password.id)
  }

  return (
    <div>
      {data.map((password, index) => (
        <div key={password.id}>
          <div>
            <span>{password.location1}</span>
            {password.location2 !== null && <span>{password.location2}</span>}
            {password.location3 !== null && <span>{password.location3}</span>}
          </div>
          {password.username !== null && <div>{password.username}</div>}
          {password.email !== null && <div>{password.email}</div>}
          <div>{password.password}</div>
          <button onClick={async () => await handleRemove(password, index)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
              <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}