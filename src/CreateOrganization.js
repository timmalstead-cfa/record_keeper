import { useState } from "react"
import fetchSingleRecord from "./fetchSingleRecord"
import fetchAllOrgRecords from "./fetchAllOrgRecords"
import { urlRegex } from "./helpers"

const { REACT_APP_AIRTABLE_BASE, REACT_APP_AIRTABLE_API_KEY } = process.env

const categories = [
  "Select A Category",
  "clothing",
  "community support",
  "employment",
  "food",
  "housing",
  "legal services",
  "medical support",
  "mental health",
  "resource directory",
  "social services",
  "substance use",
  "transportation",
]

const initialOrgInfo = {
  org_name: "",
  org_website: "",
  org_languages_spoken: "English",
  org_customers_served: "",
  org_notes: "",
  org_categories: "",
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
      const {
        org_name,
        org_website,
        org_notes,
        org_customers_served,
        org_languages_spoken,
        org_categories,
      } = orgInfo

      if (!org_name) throw new Error("Organization name is required")
      if (org_website) {
        if (!urlRegex.test(org_website))
          throw new Error(
            "If included, a complete and valid URL must be provided"
          )
      }
      if (!org_categories || org_categories === "Select A Category")
        throw new Error("You must select a valid category")
      // const csvCheck = /(.+?)(?:,|$)/g
      // if (org_customers_served) {
      //   if (!csvCheck.test(org_customers_served))
      //     throw new Error(
      //       "Customers served must be input as comma separated values"
      //     )
      // }

      // if (org_languages_spoken) {
      //   if (!csvCheck.test(org_languages_spoken))
      //     throw new Error(
      //       "Languages spoken must be input as comma separated values"
      //     )
      // }

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
              "org_languages_spoken": "${org_languages_spoken}",
              "org_customers_served" : "${org_customers_served}",
              "org_notes": "${org_notes}",
              "org_categories": [ "${org_categories}" ]
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
        <label>
          Languages Spoken <code>comma separated values</code>:
        </label>
        <input
          name="org_languages_spoken"
          onChange={handleChange}
          value={orgInfo.org_languages_spoken}
        />
        <label>
          Customers Served <code>comma separated values</code>:
        </label>
        <input
          name="org_customers_served"
          onChange={handleChange}
          value={orgInfo.org_customers_served}
        />
      </div>
      <div style={stackStyle}>
        <label>Notes:</label>
        <input
          name="org_notes"
          onChange={handleChange}
          value={orgInfo.org_notes}
        />
        <label>Category:</label>
        <select
          name="org_categories"
          style={{ textTransform: "capitalize" }}
          onChange={handleChange}
        >
          {categories.map((category) => (
            <option value={category}>{category}</option>
          ))}
        </select>
      </div>
      <button disabled={buttonDisabled} onClick={submitOrg}>
        {errorMsg || "Add New Organization"}
      </button>
    </>
  )
}

export default CreateOrganization
