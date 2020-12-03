import { useState, useEffect } from "react"
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
  // const [existingServices, setExistingServices] = useState([])
  // const [existingServiceId, setExistingServiceId] = useState("")
  const [tickBoxes, setTickBoxes] = useState(null)

  useEffect(() => {
    const collapsedLocations = locations.map((record) => {
      const { air_id, address, city, zip } = record
      return { air_id, label: `${address}, ${city} ${zip}`, checked: false }
    })
    setTickBoxes(collapsedLocations)
  }, [locations])

  const showOrSubmit = async () => {
    const locationsToLink = tickBoxes.reduce((arr, val) => {
      if (val.checked) arr.push(val.air_id)
      return arr
    }, [])

    // if (!existingServices.length) {
    //   const showExistingServices = await fetch(
    //     `https://api.airtable.com/v0/${REACT_APP_AIRTABLE_BASE}/services?fields%5B%5D=name&api_key=${REACT_APP_AIRTABLE_API_KEY}`
    //   )
    //   disableButtons()
    //   const servicesTranslated = await showExistingServices.json()
    //   setExistingServices(
    //     servicesTranslated.records.sort((a, b) =>
    //       a.fields.name?.localeCompare(b.fields.name)
    //     )
    //   )
    // }

    if (!showServiceNameField) setShowServiceNameField(true)
    // else if (showServiceNameField && !serviceName && existingServiceId) {
    //   const patchExistingService = await fetch(
    //     `https://api.airtable.com/v0/${REACT_APP_AIRTABLE_BASE}/services/${existingServiceId}`,
    //     {
    //       method: "PATCH",
    //       headers: {
    //         Authorization: `Bearer ${REACT_APP_AIRTABLE_API_KEY}`,
    //         "Content-Type": "application/json",
    //       },
    //       body: `{
    //           "fields": {
    //             "locations": ${JSON.stringify(locationsToLink)},
    //             "organization": [
    //               "${org_id}"
    //             ]
    //           }
    //         }`,
    //     }
    //   )
    //   const patchResponse = await patchExistingService.json()
    //   console.log(patchResponse)
    //   setExistingServiceId("")
    //   setShowServiceNameField(false)
    //   fetchSingleRecord(org_id, setFullFetchedRecord)
    //   disableButtons()
    // }
    else if (
      showServiceNameField &&
      serviceName &&
      locationsToLink.length
      // && !existingServiceId
    ) {
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

  const handleChange = (e) => {
    // setExistingServiceId("")
    setServiceName(e.target.value)
  }

  // const handleDropdown = ({ target }) => {
  //   setExistingServiceId(target.value)
  //   setServiceName("")
  // }

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
          {/* {Boolean(existingServices?.length) && (
            <select name="Existing Services" onChange={handleDropdown}>
              {existingServices.map((record) => {
                const { id, fields } = record
                const { name } = fields
                return <option value={id}>{name}</option>
              })}
            </select>
          )} */}
          <input onChange={handleChange} value={serviceName} />
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
        {/* {existingServiceId ? "Append Existing Service" : "Add New Service"} */}
        Add New Service
      </button>
    </>
  )
}

export default CreateService
