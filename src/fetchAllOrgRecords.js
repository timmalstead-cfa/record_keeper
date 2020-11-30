const { REACT_APP_AIRTABLE_BASE, REACT_APP_AIRTABLE_API_KEY } = process.env

const fetchAllOrgRecords = async (recordSetFunction) => {
  const fetchNames = await fetch(
    `https://api.airtable.com/v0/${REACT_APP_AIRTABLE_BASE}/organization?fields%5B%5D=org_name&api_key=${REACT_APP_AIRTABLE_API_KEY}`
  )
  const translatedNames = await fetchNames.json()
  recordSetFunction(translatedNames.records)
}

export default fetchAllOrgRecords
