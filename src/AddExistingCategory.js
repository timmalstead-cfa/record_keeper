import { useState } from "react"
import fetchSingleRecord from "./fetchSingleRecord"

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

const centerBlockStyle = { width: "25%", alignSelf: "center" }

const AddExistingCategory = ({
  org_categories,
  buttonDisabled,
  disableButtons,
  org_id,
  setFullFetchedRecord,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("")

  const updateCategories = async () => {
    if (selectedCategory && selectedCategory !== "Select A Category") {
      const newCategories = [...new Set([...org_categories, selectedCategory])]

      const patchCategories = await fetch(
        `https://api.airtable.com/v0/${REACT_APP_AIRTABLE_BASE}/organization/${org_id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${REACT_APP_AIRTABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: `{
                  "fields": {
                      "org_categories": ${JSON.stringify(newCategories)}
                  }
                }`,
        }
      )

      const categoryResponse = await patchCategories.json()
      console.log(categoryResponse)
      setSelectedCategory("")
      fetchSingleRecord(org_id, setFullFetchedRecord)
      disableButtons()
    }
  }

  return (
    <>
      <select
        name="org_categories"
        style={{ ...centerBlockStyle, textTransform: "capitalize" }}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {categories.map((category) => (
          <option value={category}>{category}</option>
        ))}
      </select>
      <button
        disabled={buttonDisabled}
        style={centerBlockStyle}
        onClick={updateCategories}
      >
        Add Existing Service
      </button>
    </>
  )
}

export default AddExistingCategory
