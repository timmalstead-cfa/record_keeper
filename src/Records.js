import { useState, useEffect } from "react"

const Records = ({ setLogin }) => {
  const [fetchedRecords, setFetchedRecords] = useState([])

  const { REACT_APP_AIRTABLE_BASE, REACT_APP_AIRTABLE_API_KEY } = process.env

  useEffect(() => {
    const getRecords = async () => {
      const records = await fetch(
        `https://api.airtable.com/v0/${REACT_APP_AIRTABLE_BASE}/organization?api_key=${REACT_APP_AIRTABLE_API_KEY}`
      )
      const translatedRecords = await records.json()
      const firstRecord = translatedRecords.records[0]
      const fields = firstRecord.fields

      const orgInfo = {}
      let locInfo = {}
      let servInfo = {}
      let scheInfo = {}

      orgInfo.org_air_id = firstRecord.id

      for (const prop in fields) {
        if (prop.startsWith("org")) orgInfo[prop] = fields[prop]
        else if (prop.startsWith("loc")) {
          if (typeof fields[prop] === "string")
            fields[prop] = fields[prop].split(";")
          locInfo[prop] = fields[prop]
        } else if (prop.startsWith("sch")) {
          if (typeof fields[prop] === "string")
            fields[prop] = fields[prop].split(";")
          scheInfo[prop] = fields[prop]
        } else servInfo[prop] = fields[prop]
      }

      const servArray = []
      const servLimit = servInfo.services_id.length

      for (let i = 0; i < servLimit; i++)
        servArray.push({
          air_id: orgInfo.org_services[i],
          id: servInfo.services_id[i],
          name: servInfo.services_names[i],
        })

      servInfo = servArray

      const scheArray = []
      const scheLimit = scheInfo.schedule_close_am_pm.length

      for (let i = 0; i < scheLimit; i++)
        scheArray.push({
          open: `${scheInfo.schedule_open_time[i]} ${scheInfo.schedule_open_am_pm[i]}`,
          close: `${scheInfo.schedule_close_time[i]} ${scheInfo.schedule_open_am_pm[i]}`,
          days: scheInfo.schedule_day[i],
          weeks_open: scheInfo.schedule_ordinal_open[i],
          location_id: scheInfo.schedule_locations_id[i],
          air_id: orgInfo.org_schedule[i],
        })

      scheInfo = scheArray

      const locArray = []
      const locLimit = locInfo.location_address.length

      for (let i = 0; i < locLimit; i++)
        locArray.push({
          address: locInfo.location_address[i],
          phone: locInfo.location_phone[i],
          services: locInfo.location_services[i],
          state: locInfo.location_state[i],
          zip: locInfo.location_zip[i],
          city: locInfo.locations_city[i],
          id: locInfo.locations_id[i],
          air_id: orgInfo.org_locations[i],
        })

      locInfo = locArray

      const recordToInsert = {
        orgInfo,
        locInfo,
        servInfo,
        scheInfo,
      }

      console.log(recordToInsert)
    }
    getRecords()
  }, [REACT_APP_AIRTABLE_BASE, REACT_APP_AIRTABLE_API_KEY])

  return (
    <>
      <section className="form wide">
        <span>these are the records</span>
      </section>
      <button onClick={() => setLogin(false)}>Logout</button>
    </>
  )
}

export default Records
