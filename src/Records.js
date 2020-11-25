import { useEffect } from "react"

const Records = ({ setLogin }) => {
  const { REACT_APP_AIRTABLE_BASE, REACT_APP_AIRTABLE_API_KEY } = process.env

  useEffect(() => {
    const getRecords = async () => {
      const records = await fetch(
        `https://api.airtable.com/v0/${REACT_APP_AIRTABLE_BASE}/organization?api_key=${REACT_APP_AIRTABLE_API_KEY}`
      )
      const translatedRecords = await records.json()
      console.log(translatedRecords)
    }
    getRecords()
  }, [REACT_APP_AIRTABLE_BASE, REACT_APP_AIRTABLE_API_KEY])

  return (
    <>
      <span>these are the records</span>
      <button onClick={() => setLogin(false)}>Logout</button>
    </>
  )
}

export default Records
