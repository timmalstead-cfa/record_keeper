import { useState } from "react"
import fetchSingleRecord from "./fetchSingleRecord"
import { states, urlRegex, emailRegex } from "./helpers"

const { REACT_APP_AIRTABLE_BASE, REACT_APP_AIRTABLE_API_KEY } = process.env
const stackStyle = {
  display: "flex",
  justifyContent: "center",
  margin: ".5rem 0",
}

const defaultLocationInfo = {
  city: "",
  address: "",
  address_2: "",
  state: "CA",
  zip: "",
  organization: [],
  phone: "",
  location_website: "",
  location_name: "",
  email: "",
}

const CreateLocation = ({
  setFullFetchedRecord,
  buttonDisabled,
  disableButtons,
  org_id,
}) => {
  const [showCreateLocation, setShowCreateLocation] = useState(false)
  const [locationInfo, setLocationInfo] = useState(defaultLocationInfo)
  const [errorMsg, setErrorMsg] = useState("")

  const handleChange = (e) =>
    setLocationInfo({ ...locationInfo, [e.target.name]: e.target.value })

  const showOrSend = async () => {
    if (!showCreateLocation) setShowCreateLocation(true)

    if (showCreateLocation) {
      try {
        const {
          address,
          address_2,
          city,
          zip,
          phone,
          state,
          location_website,
          location_name,
          email,
        } = locationInfo

        if (!city) throw new Error("City is required")
        if (!address) throw new Error("Address is required")
        const validZipCode = /^[0-9]{5}$/
        if (!validZipCode.test(zip))
          throw new Error("Five Digit ZIP code is required")

        if (phone) {
          const validPhoneNumber = /^[0-9]{10}$/
          if (!validPhoneNumber.test(phone))
            throw new Error(
              "If provided, phone number must be ten digits with no dashes or spaces"
            )
        }
        if (location_website) {
          if (!urlRegex.test(location_website))
            throw new Error(
              "If included, a complete and valid URL must be provided"
            )
        }

        if (email) {
          if (!emailRegex.test(email))
            throw new Error(
              "If included, a valid email address must be provided"
            )
        }

        const addLocation = await fetch(
          `https://api.airtable.com/v0/${REACT_APP_AIRTABLE_BASE}/locations`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${REACT_APP_AIRTABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: `{
              "fields": {
                "city": "${city}",
                "address": "${address}",
                "address_2":"${address_2}",
                "state": "${state}",
                "zip": ${+zip},
                "organization": [
                  "${org_id}"
                ],
                "phone": "${phone}",
                "location_website": "${location_website}",
                "location_name": "${location_name}",
                "email": "${email}"
              }
            }`,
          }
        )
        const locationReturn = await addLocation.json()
        console.log(locationReturn)
        setShowCreateLocation(false)
        setLocationInfo(defaultLocationInfo)
        fetchSingleRecord(org_id, setFullFetchedRecord)
        disableButtons()
      } catch (e) {
        setErrorMsg(e.message)
        window.setTimeout(() => setErrorMsg(""), 3000)
      }
    }
  }

  return (
    <>
      {showCreateLocation && (
        <>
          <div style={stackStyle}>
            <label for="address">Address</label>
            <input
              type="text"
              name="address"
              value={locationInfo.address}
              onChange={handleChange}
            />
            <label for="address_2">Address 2</label>
            <input
              type="text"
              name="address_2"
              value={locationInfo.address_2}
              onChange={handleChange}
            />
          </div>
          <div style={stackStyle}>
            <label for="city">City</label>
            <input
              type="text"
              name="city"
              value={locationInfo.city}
              onChange={handleChange}
            />

            <label>State</label>
            <select value={locationInfo.state} onChange={handleChange}>
              {states.map((state) => (
                <option value={state}>{state}</option>
              ))}
            </select>
          </div>
          <div style={stackStyle}>
            <label for="zip">Zip</label>
            <input
              type="text"
              name="zip"
              maxLength={5}
              minLength={5}
              size={5}
              value={locationInfo.zip}
              onChange={handleChange}
            />
            <label for="phone">Phone #</label>
            <input
              type="tel"
              name="phone"
              maxLength={10}
              minLength={10}
              size={10}
              value={locationInfo.phone}
              onChange={handleChange}
            />
          </div>
          <div style={stackStyle}>
            <label for="location_name">Location Name</label>
            <input
              type="text"
              name="location_name"
              value={locationInfo.location_name}
              onChange={handleChange}
            />
            <label for="location_website">Location Specific Website</label>
            <input
              type="text"
              name="location_website"
              value={locationInfo.location_website}
              onChange={handleChange}
            />
          </div>
          <div style={stackStyle}>
            <label for="email">Email</label>
            <input
              type="text"
              name="email"
              value={locationInfo.email}
              onChange={handleChange}
            />
          </div>
        </>
      )}
      <button disabled={buttonDisabled} onClick={showOrSend}>
        {errorMsg || "Add New Location"}
      </button>
    </>
  )
}

export default CreateLocation
