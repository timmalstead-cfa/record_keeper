// import { useEffect } from "react"
import "./App.css"

// const base = ""
// const key = ""

const App = () => {
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
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <a
        className="link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </main>
  )
}

export default App
