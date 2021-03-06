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
      if (!servInfo.recordNum) servInfo.recordNum = fields[prop].length
    }
  }

  for (let i = 0; i < servInfo.recordNum; i++)
    orgInfo.services.push({
      air_id: orgInfo.org_services[i] || null,
      id: servInfo.services_id[i] || null,
      name: servInfo.services_names[i] || null,
      org_id: translatedRecord.id || null,
    })

  for (let i = 0; i < locInfo.recordNum; i++) {
    const objToPush = {
      address: locInfo.location_address[i] || null,
      state: locInfo.location_state[i] || null,
      city: locInfo.locations_city[i] || null,
      id: locInfo.locations_id[i] || null,
      air_id: orgInfo.org_locations[i] || null,
      zip: locInfo.location_zip[i] || null,
    }

    if (locInfo.location_services && locInfo.location_services[i])
      objToPush.services = locInfo.location_services[i]
    if (locInfo.location_phone && locInfo.location_phone[i])
      objToPush.phone = locInfo.location_phone[i]
    if (locInfo.location_address_2 && locInfo.location_address_2[i])
      objToPush.address_2 = locInfo.location_address_2[i]
    if (locInfo.location_name && locInfo.location_name[i])
      objToPush.name = locInfo.location_name[i]
    if (locInfo.location_email && locInfo.location_email[i])
      objToPush.email = locInfo.location_email[i]
    if (locInfo.location_website && locInfo.location_website[i])
      objToPush.location_website = locInfo.location_website[i]
    if (locInfo.location_notes && locInfo.location_notes[i])
      objToPush.location_notes = locInfo.location_notes[i]
    orgInfo.locations.push(objToPush)
  }
  console.log(orgInfo.locations)

  const timeParser = (timeStr) => {
    const splitTime = timeStr.split(":")
    splitTime[0] = +splitTime[0]
    const amOrPm = splitTime[0] > 11 && splitTime[0] < 24 ? "PM" : "AM"
    if (!splitTime[0] || splitTime[0] === 12) splitTime[0] = "12"
    else if (splitTime[0] > 12) splitTime[0] = String(splitTime[0] - 12)
    return `${splitTime[0]}:${splitTime[1]} ${amOrPm}`
  }

  for (let i = 0; i < scheInfo.recordNum; i++) {
    const objToPush = {
      location_id: scheInfo.schedule_locations_id[i] || null,
    }

    if (scheInfo.schedule_notes && scheInfo.schedule_notes[i])
      objToPush.notes = scheInfo.schedule_notes[i]
    if (orgInfo.org_schedule && orgInfo.org_schedule[i])
      objToPush.air_id = orgInfo.org_schedule[i]
    if (scheInfo.schedule_open_time && scheInfo.schedule_open_time[i])
      objToPush.open = timeParser(scheInfo.schedule_open_time[i])
    if (scheInfo.schedule_close_time && scheInfo.schedule_close_time[i])
      objToPush.close = timeParser(scheInfo.schedule_close_time[i])
    if (scheInfo.schedule_day && scheInfo.schedule_day[i])
      objToPush.days = scheInfo.schedule_day[i]
    if (scheInfo.schedule_ordinal_open && scheInfo.schedule_ordinal_open[i])
      objToPush.weeks_open = scheInfo.schedule_ordinal_open[i]
    if (scheInfo.schedule_location_name && scheInfo.schedule_location_name[i])
      objToPush.location_name = scheInfo.schedule_location_name[i]

    orgInfo.schedule.push(objToPush)
  }

  setStateAction(orgInfo)
}

export default fetchSingleRecord
