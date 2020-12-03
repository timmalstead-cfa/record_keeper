import { useState } from "react"
import fetchSingleRecord from "./fetchSingleRecord"
import fetchAllOrgRecords from "./fetchAllOrgRecords"

const { REACT_APP_AIRTABLE_BASE, REACT_APP_AIRTABLE_API_KEY } = process.env

const initialOrgInfo = {
  org_name: "",
  org_website: "",
  org_languages_spoken: "",
  org_notes: "",
}

const stackStyle = {
  display: "flex",
  justifyContent: "center",
  margin: ".5rem 0",
}

const CreateOrganization = ({
  setFetchedRecords,
  setFullFetchedRecord,
  buttonDisabled,
  disableButtons,
}) => {
  const [orgInfo, setOrgInfo] = useState(initialOrgInfo)
  const [errorMsg, setErrorMsg] = useState("")

  const handleChange = (e) =>
    setOrgInfo({ ...orgInfo, [e.target.name]: e.target.value })

  const submitOrg = async () => {
    try {
      const { org_name, org_website, org_notes } = orgInfo

      if (!org_name) throw new Error("Organization name is required")

      const addOrg = await fetch(
        `https://api.airtable.com/v0/${REACT_APP_AIRTABLE_BASE}/organization`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${REACT_APP_AIRTABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: `{
            "fields": {
              "org_name": "${org_name}",
              "org_website": "${org_website}",
              "org_languages_spoken": "English",
              "org_notes": "${org_notes}"
            }
          }`,
        }
      )

      const orgReturn = await addOrg.json()
      setOrgInfo(initialOrgInfo)
      fetchAllOrgRecords(setFetchedRecords)
      fetchSingleRecord(orgReturn.id, setFullFetchedRecord)
      disableButtons()
    } catch (e) {
      setErrorMsg(e.message)
      window.setTimeout(() => setErrorMsg(""), 3000)
    }
  }

  return (
    <>
      <div style={stackStyle}>
        <label>Name:</label>
        <input
          name="org_name"
          onChange={handleChange}
          value={orgInfo.org_name}
        />
        <label>Website:</label>
        <input
          name="org_website"
          onChange={handleChange}
          value={orgInfo.org_website}
        />
      </div>
      <div style={stackStyle}>
        <label>Notes:</label>
        <input
          name="org_notes"
          onChange={handleChange}
          value={orgInfo.org_notes}
        />
      </div>
      <button disabled={buttonDisabled} onClick={submitOrg}>
        {errorMsg || "Add New Organization"}
      </button>
    </>
  )
}

export default CreateOrganization
