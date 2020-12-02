import { useState } from "react"
import Records from "./Records"

const App = () => {
  const [login, setLogin] = useState(true)
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
    <main className="app" style={login ? { justifyContent: "flex-start" } : {}}>
      <h3 className="title">SB Record Keeper</h3>
      {login ? (
        <Records setLogin={setLogin} />
      ) : (
        <section className="form border pad">
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
    </main>
  )
}

export default App
