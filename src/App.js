import { useState } from "react"
import Records from "./Records"

const email = "tmalstead@codeforamerica.org"

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
