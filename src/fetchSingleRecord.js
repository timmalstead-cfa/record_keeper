// "recD6QOJgdqlHyMrq"

const fetchSingleRecord = async (recordNum, setStateAction) => {
  const { REACT_APP_AIRTABLE_BASE, REACT_APP_AIRTABLE_API_KEY } = process.env

  const record = await fetch(
    `https://api.airtable.com/v0/${REACT_APP_AIRTABLE_BASE}/organization/${recordNum}?api_key=${REACT_APP_AIRTABLE_API_KEY}`
  )
  const translatedRecord = await record.json()
  const fields = translatedRecord.fields

  const orgInfo = {
    locations: [],
    services: [],
    schedule: [],
  }

  orgInfo.org_air_id = translatedRecord.id

  const servInfo = {}
  const locInfo = {}
  const scheInfo = {}

  for (const prop in fields) {
    if (prop.startsWith("org")) orgInfo[prop] = fields[prop]
    else if (prop.startsWith("loc")) {
      if (typeof fields[prop] === "string")
        fields[prop] = fields[prop].split(";")
      else if (fields[prop] instanceof Array && !locInfo.recordNum)
        locInfo.recordNum = fields[prop].length
      locInfo[prop] = fields[prop]
    } else if (prop.startsWith("sch")) {
      if (typeof fields[prop] === "string")
        fields[prop] = fields[prop].split(";")
      else if (fields[prop] instanceof Array && !scheInfo.recordNum)
        scheInfo.recordNum = fields[prop].length
      scheInfo[prop] = fields[prop]
    } else {
      servInfo[prop] = fields[prop]
      servInfo.recordNum = ++servInfo.recordNum || 1
    }
  }

  for (let i = 0; i < servInfo.recordNum; i++)
    orgInfo.services.push({
      air_id: orgInfo.org_services[i],
      id: servInfo.services_id[i],
      name: servInfo.services_names[i],
    })

  for (let i = 0; i < scheInfo.recordNum; i++)
    orgInfo.schedule.push({
      open: `${scheInfo.schedule_open_time[i]} ${scheInfo.schedule_open_am_pm[i]}`,
      close: `${scheInfo.schedule_close_time[i]} ${scheInfo.schedule_open_am_pm[i]}`,
      days: scheInfo.schedule_day[i],
      weeks_open: scheInfo.schedule_ordinal_open[i],
      location_id: scheInfo.schedule_locations_id[i],
      air_id: orgInfo.org_schedule[i],
    })

  for (let i = 0; i < locInfo.recordNum; i++)
    orgInfo.locations.push({
      address: locInfo.location_address[i],
      phone: locInfo.location_phone[i],
      services: locInfo.location_services[i],
      state: locInfo.location_state[i],
      zip: locInfo.location_zip[i],
      city: locInfo.locations_city[i],
      id: locInfo.locations_id[i],
      air_id: orgInfo.org_locations[i],
    })

  setStateAction(orgInfo)
  console.log("firing")
}

export default fetchSingleRecord
