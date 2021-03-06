import { useState, useEffect } from "react"
import fetchSingleRecord from "./fetchSingleRecord"

const { REACT_APP_AIRTABLE_BASE, REACT_APP_AIRTABLE_API_KEY } = process.env

const fetchString = `https://api.airtable.com/v0/${REACT_APP_AIRTABLE_BASE}/services?fields%5B%5D=name&fields%5B%5D=locations&fields%5B%5D=organization`

const fetchOptionsObject = {
  method: "GET",
  headers: {
    Authorization: `Bearer ${REACT_APP_AIRTABLE_API_KEY}`,
  },
}

const AddExistingService = ({
  locations,
  org_id,
  setFullFetchedRecord,
  buttonDisabled,
  disableButtons,
}) => {
  const [showExistingServices, setShowExistingServices] = useState(false)
  const [fetchedExistingServices, setFetchedExistingServices] = useState([])
  const [serviceIdToAdd, setServiceIdToAdd] = useState("")
  const [tickBoxes, setTickBoxes] = useState(null)

  useEffect(() => {
    if (showExistingServices) {
      const collapsedLocations = locations.map((record) => {
        const { air_id, address, city, zip } = record
        return { air_id, label: `${address}, ${city} ${zip}`, checked: false }
      })
      setTickBoxes(collapsedLocations)
    }
  }, [locations, showExistingServices])

  useEffect(() => {
    if (showExistingServices) {
      const fetchServices = async () => {
        const fetchedServices = await fetch(fetchString, fetchOptionsObject)
        let translatedServices = await fetchedServices.json()

        while (translatedServices.offset) {
          window.setTimeout(
            () => console.log("intentional delay to not overload api"),
            250
          )
          const { offset, records } = translatedServices
          const nextPage = await fetch(
            `${fetchString}&offset=${offset}`,
            fetchOptionsObject
          )
          const translatedNextPage = await nextPage.json()

          const [pageRecords, pageOffset] = [
            translatedNextPage.records,
            translatedNextPage.offset,
          ]
          translatedServices.records = [...records, ...pageRecords]
          if (pageOffset) translatedServices.offset = pageOffset
          else delete translatedServices.offset
        }

        const sortedServices = translatedServices.records.sort((a, b) =>
          a.fields.name?.localeCompare(b.fields.name)
        )

        setFetchedExistingServices(sortedServices)
      }
      fetchServices()
    }
  }, [showExistingServices])

  useEffect(() => {
    setShowExistingServices(false)
    setFetchedExistingServices([])
    setServiceIdToAdd("")
    setTickBoxes(null)
  }, [org_id])

  const handleTick = ({ target }) => {
    const { value, checked } = target
    setTickBoxes(
      tickBoxes.map((box) => {
        if (value === box.air_id) box.checked = checked
        return box
      })
    )
  }

  const showOrSubmit = async () => {
    if (!showExistingServices) setShowExistingServices(true)

    if (
      showExistingServices &&
      fetchedExistingServices.length &&
      tickBoxes.length &&
      tickBoxes.some((tickbox) => tickbox.checked) &&
      serviceIdToAdd
    ) {
      const locationsToLink = tickBoxes.reduce((arr, val) => {
        if (val.checked) arr.push(val.air_id)
        return arr
      }, [])

      const servicesObj = JSON.parse(serviceIdToAdd)
      const { id, fields } = servicesObj
      const { locations, organization } = fields
      const combinedLocationsArray = [
        ...new Set([...locations, ...locationsToLink]),
      ]
      const combinedOrgArray = [...new Set([...organization, org_id])]

      const patchService = await fetch(
        `https://api.airtable.com/v0/${REACT_APP_AIRTABLE_BASE}/services/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${REACT_APP_AIRTABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: `{
                "fields": {
                  "locations": ${JSON.stringify(combinedLocationsArray)},
                  "organization": ${JSON.stringify(combinedOrgArray)}
                }
              }`,
        }
      )

      const patchResponse = await patchService.json()
      console.log(patchResponse)
      setShowExistingServices(false)
      setServiceIdToAdd("")
      setFetchedExistingServices([])
      setTickBoxes(null)
      fetchSingleRecord(org_id, setFullFetchedRecord)
      disableButtons()
    }
  }

  return (
    <>
      {Boolean(fetchedExistingServices?.length) && (
        <select onChange={(e) => setServiceIdToAdd(e.target.value)}>
          <option value="">Select Service to Add</option>
          {fetchedExistingServices.map((record) => (
            <option value={JSON.stringify(record)}>{record.fields.name}</option>
          ))}
        </select>
      )}
      {Boolean(tickBoxes?.length) &&
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
      <button disabled={buttonDisabled} onClick={showOrSubmit}>
        Add Existing Service
      </button>
    </>
  )
}

export default AddExistingService
