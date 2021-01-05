const { REACT_APP_AIRTABLE_BASE, REACT_APP_AIRTABLE_API_KEY } = process.env

const fetchString = `https://api.airtable.com/v0/${REACT_APP_AIRTABLE_BASE}/organization?fields%5B%5D=org_name&api_key=${REACT_APP_AIRTABLE_API_KEY}`

const fetchAllOrgRecords = async (recordSetFunction) => {
  const fetchNames = await fetch(fetchString)
  let translatedNames = await fetchNames.json()

  while (translatedNames.offset) {
    window.setTimeout(
      () => console.log("intentional delay to not overload api"),
      250
    )
    const { offset, records } = translatedNames
    const nextPage = await fetch(`${fetchString}&offset=${offset}`)
    const translatedNextPage = await nextPage.json()

    const [pageRecords, pageOffset] = [
      translatedNextPage.records,
      translatedNextPage.offset,
    ]
    translatedNames.records = [...records, ...pageRecords]
    if (pageOffset) translatedNames.offset = pageOffset
    else delete translatedNames.offset
  }

  console.log(translatedNames)

  const sortedNames = translatedNames.records.sort((a, b) =>
    a.fields.org_name?.localeCompare(b.fields.org_name)
  )

  recordSetFunction(sortedNames)
}

export default fetchAllOrgRecords
