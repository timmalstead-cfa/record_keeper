import { useState } from "react"
import fetchSingleRecord from "./fetchSingleRecord"

const { REACT_APP_AIRTABLE_BASE, REACT_APP_AIRTABLE_API_KEY } = process.env

const CreateService = ({
  locations,
  org_id,
  setFullFetchedRecord,
  buttonDisabled,
  disableButtons,
}) => {
  const [showServiceNameField, setShowServiceNameField] = useState(false)
  const [serviceName, setServiceName] = useState("")
  const [tickBoxes, setTickBoxes] = useState(
    locations.map((record) => {
      const { air_id, address, city, zip } = record
      return { air_id, label: `${address}, ${city} ${zip}`, checked: false }
    })
  )

  const showOrSubmit = async () => {
    if (!showServiceNameField) setShowServiceNameField(true)
    else if (showServiceNameField && serviceName) {
      const locationsToLink = tickBoxes.reduce((arr, val) => {
        if (val.checked) arr.push(val.air_id)
        return arr
      }, [])
      const addService = await fetch(
        `https://api.airtable.com/v0/${REACT_APP_AIRTABLE_BASE}/services`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${REACT_APP_AIRTABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: `{
            "fields": {
              "name": "${serviceName}",
              "locations": ${JSON.stringify(locationsToLink)},
              "organization": [
                "${org_id}"
              ]
            }
          }`,
        }
      )

      const addResponse = await addService.json()
      console.log(addResponse)
      setServiceName("")
      setShowServiceNameField(false)
      fetchSingleRecord(org_id, setFullFetchedRecord)
      disableButtons()
    }
  }

  const handleChange = (e) => setServiceName(e.target.value)

  const handleTick = ({ target }) => {
    const { value, checked } = target
    setTickBoxes(
      tickBoxes.map((box) => {
        if (value === box.air_id) box.checked = checked
        return box
      })
    )
  }

  return (
    <>
      {showServiceNameField && (
        <>
          <input onChange={handleChange} value={serviceName} autoFocus />
          {Boolean(tickBoxes.length) &&
            tickBoxes.map((record) => {
              const { air_id, label } = record
              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    style={{ margin: ".5rem" }}
                    type="checkbox"
                    value={air_id}
                    onClick={handleTick}
                  />
                  <code>{label}</code>
                </div>
              )
            })}
        </>
      )}
      <button disabled={buttonDisabled} onClick={showOrSubmit}>
        Add Record
      </button>
    </>
  )
}

export default CreateService
