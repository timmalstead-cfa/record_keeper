import { useState } from "react"
import Records from "./Records"

const email = "tmalstead@codeforamerica.org"
console.log(process.env)

const App = () => {
  const [login, setLogin] = useState(false)
  const [password, setPassword] = useState("")

  const handleChange = (e) => setPassword(e.target.value)

  const validate = (e) => {
    e.preventDefault()
    if (password === process.env.REACT_APP_PASSWORD) {
      setLogin(true)
      setPassword("")
    }
  }

  // useEffect(() => {
  //   const getRecords = async () => {
  //     const records = await fetch(
  //       `https://api.airtable.com/v0/${base}/organization?api_key=${key}`
  //     )
  //     const translatedRecords = await records.json()
  //     console.log(translatedRecords)
  //   }
  //   getRecords()
  // }, [])

  return (
    <main className="app">
      <h3>SB Record Keeper</h3>
      {login ? (
        <Records setLogin={setLogin} />
      ) : (
        <section className="form">
          <p>Enter password to proceed</p>
          <form onSubmit={validate}>
            <input
              type="password"
              onChange={handleChange}
              value={password}
              autoFocus
            />
            <button type="submit">Submit</button>
          </form>
        </section>
      )}
      <p className="note">
        Problems?
        <br />
        <a
          className="link"
          href={`mailto:${email}?subject=SB Record Keeper`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {email}
        </a>
      </p>
    </main>
  )
}

export default App
