import fetchSingleRecord from "./fetchSingleRecord"
const { REACT_APP_AIRTABLE_BASE, REACT_APP_AIRTABLE_API_KEY } = process.env

const CreateTags = ({
  orgInfo,
  setFullFetchedRecord,
  buttonDisabled,
  disableButtons,
  org_id,
}) => {
  const createTags = async () => {
    const {
      org_tags,
      org_customers_served,
      org_languages_spoken,
      org_name,
      locations,
      schedule,
      services,
    } = orgInfo
    let customersServed, currentTags
    if (org_tags) currentTags = org_tags.map((tag) => tag.toLowerCase())
    else currentTags = []
    if (org_customers_served)
      customersServed = org_customers_served
        .split(",")
        .map((language) => language.toLowerCase().trim())
    else customersServed = []
    const languages = org_languages_spoken
      .split(",")
      .map((language) => language.toLowerCase().trim())
    const name = org_name.toLowerCase()
    const newLocations = locations
      .map((record) => [`${record.zip}`, record.city.toLowerCase()])
      .flat(1)
    let daysOpen = []
    if (schedule.days) {
      daysOpen = schedule
        .map((record) => record.days.toLowerCase().split(","))
        .flat(1)
        .map((str) => str.trim())
    }
    const servicesOffered = services.map((service) =>
      service.name.toLowerCase()
    )

    const finalTags = [
      ...new Set([
        name,
        ...customersServed,
        ...currentTags,
        ...languages,
        ...newLocations,
        ...daysOpen,
        ...servicesOffered,
      ]),
    ]
    console.log(finalTags)

    // const addTagResponse = `{
    //     "fields": {
    //         "org_tags": ${JSON.stringify(finalTags)}
    //     }
    // }`

    const addTags = await fetch(
      `https://api.airtable.com/v0/${REACT_APP_AIRTABLE_BASE}/organization/${org_id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${REACT_APP_AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: `{
            "fields": {
                "org_tags": ${JSON.stringify(finalTags)}
            } ,
            "typecast": true
        }`,
      }
    )

    const addTagResponse = await addTags.json()

    console.log(addTagResponse)

    fetchSingleRecord(org_id, setFullFetchedRecord)
    disableButtons()
  }

  return (
    <button
      disabled={buttonDisabled}
      style={{ width: "25%", alignSelf: "center" }}
      onClick={createTags}
    >
      Create Tags
    </button>
  )
}

export default CreateTags
