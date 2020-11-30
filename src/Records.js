import { useState, useEffect } from "react"
import fetchAllOrgRecords from "./fetchAllOrgRecords"

const Records = ({ setLogin }) => {
  const [fetchedRecords, setFetchedRecords] = useState(null)

  useEffect(() => {
    fetchAllOrgRecords(setFetchedRecords)
  }, [])

  return (
    <>
      <div>
        <button onClick={() => fetchAllOrgRecords(setFetchedRecords)}>
          Fetch Records
        </button>
        <button onClick={() => setLogin(false)}>Logout</button>
      </div>
      <section className="form medium org-names">
        {fetchedRecords ? (
          fetchedRecords.map((org) => <p>{org.fields.org_name || null}</p>)
        ) : (
          <p>Fetching Records...</p>
        )}
      </section>
    </>
  )
}

export default Records
