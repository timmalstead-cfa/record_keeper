import { useState, useEffect } from "react"
import fetchSingleRecord from "./fetchSingleRecord"

const { REACT_APP_AIRTABLE_BASE, REACT_APP_AIRTABLE_API_KEY } = process.env
const stackStyle = { display: "flex", justifyContent: "center" }

const defaultInfo = {
  open_time: "09:00",
  close_time: "17:00",
  days: {
    Sun: false,
    Mon: false,
    Tue: false,
    Wed: false,
    Thu: false,
    Fri: false,
    Sat: false,
  },
  locations: [],
  ordinal_open: {
    First: { value: "1", open: true },
    Second: { value: "2", open: true },
    Third: { value: "3", open: true },
    Fourth: { value: "4", open: true },
    Fifth: { value: "5", open: true },
  },
  organization: [],
  notes: "",
}

const CreateSchedule = ({
  setFullFetchedRecord,
  buttonDisabled,
  disableButtons,
  org_id,
  locations,
}) => {
  const [showCreateSchedule, setShowCreateSchedule] = useState(false)
  const [scheduleInfo, setScheduleInfo] = useState(defaultInfo)
  const [tickBoxes, setTickBoxes] = useState(null)

  useEffect(() => {
    setShowCreateSchedule(false)
    setScheduleInfo(defaultInfo)
    setTickBoxes(null)
  }, [org_id])

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

    const daysKeys = Object.keys(scheduleInfo.days)
    const daysValues = Object.values(scheduleInfo.days)

    const newDaysString = daysValues.reduce((str, val, i) => {
      if (val) {
        if (!str) str += daysKeys[i]
        else str += `, ${daysKeys[i]}`
      }
      return str
    }, "")

    const ordinalString = Object.values(scheduleInfo.ordinal_open).reduce(
      (str, val) => {
        if (val.open) {
          if (!str) str += val.value
          else str += `, ${val.value}`
        }
        return str
      },
      ""
    )

    if (!showCreateSchedule) {
      setShowCreateSchedule(true)
    } else if (showCreateSchedule && locationsToLink.length && newDaysString) {
      const {
        open_time,
        close_time,
        // notes
      } = scheduleInfo

      const addSchedule = await fetch(
        `https://api.airtable.com/v0/${REACT_APP_AIRTABLE_BASE}/schedule`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${REACT_APP_AIRTABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: `{
            "fields": {
              "open_time": "${open_time}",
              "close_time": "${close_time}",
              "days": "${newDaysString}",
              "locations": ${JSON.stringify(locationsToLink)},
              "ordinal_open": "${ordinalString}",
              "organization": [
                "${org_id}"
              ]
            }
          }`,
        }
      )
      const addResponse = await addSchedule.json()
      console.log(addResponse)
      setShowCreateSchedule(false)
      setScheduleInfo(defaultInfo)
      fetchSingleRecord(org_id, setFullFetchedRecord)
      disableButtons()
    }
  }

  const handleDaysOpen = (day) => {
    setScheduleInfo({
      ...scheduleInfo,
      days: {
        ...scheduleInfo.days,
        [day]: !scheduleInfo.days[day],
      },
    })
  }

  const days = []
  for (const day in scheduleInfo.days) {
    days.push(
      <div style={{ margin: ".5rem" }}>
        <label>{day}</label>
        <input
          type="checkbox"
          onClick={() => handleDaysOpen(day)}
          checked={scheduleInfo.days[day]}
        />
      </div>
    )
  }

  const handleOrdinal = (dayOpen) => {
    setScheduleInfo({
      ...scheduleInfo,
      ordinal_open: {
        ...scheduleInfo.ordinal_open,
        [dayOpen]: {
          ...scheduleInfo.ordinal_open[dayOpen],
          open: !scheduleInfo.ordinal_open[dayOpen].open,
        },
      },
    })
  }

  const ordinal = []
  for (const dayOpen in scheduleInfo.ordinal_open) {
    ordinal.push(
      <div style={{ margin: ".5rem" }}>
        <label>{dayOpen}</label>
        <input
          type="checkbox"
          onClick={() => handleOrdinal(dayOpen)}
          value={scheduleInfo.ordinal_open[dayOpen].value}
          checked={scheduleInfo.ordinal_open[dayOpen].open}
        />
      </div>
    )
  }

  const handleTick = ({ target }) => {
    const { value, checked } = target
    setTickBoxes(
      tickBoxes.map((box) => {
        if (value === box.air_id) box.checked = checked
        return box
      })
    )
  }

  const handleMondayThroughFriday = () =>
    setScheduleInfo({
      ...scheduleInfo,
      days: {
        Sun: false,
        Mon: true,
        Tue: true,
        Wed: true,
        Thu: true,
        Fri: true,
        Sat: false,
      },
    })

  const handleAllDays = () =>
    setScheduleInfo({
      ...scheduleInfo,
      days: {
        Sun: true,
        Mon: true,
        Tue: true,
        Wed: true,
        Thu: true,
        Fri: true,
        Sat: true,
      },
    })

  return (
    <>
      {showCreateSchedule && (
        <>
          <div style={stackStyle}>{days}</div>
          <button onClick={handleMondayThroughFriday}>
            Check Monday-Friday
          </button>
          <button onClick={handleAllDays}>Check All Days</button>
          <h4>Weeks Open</h4>
          <div style={stackStyle}>{ordinal}</div>
          <form>
            <label for="Opening">Opening Time:</label>
            <input
              style={{ margin: ".5rem" }}
              name="Opening"
              type="time"
              min="00:00"
              max="12:00"
              value={scheduleInfo.open_time}
              onChange={(e) =>
                setScheduleInfo({ ...scheduleInfo, open_time: e.target.value })
              }
            />
            <label for="Closing">Closing Time:</label>
            <input
              style={{ margin: ".5rem" }}
              name="Closing"
              type="time"
              min="00:00"
              max="12:00"
              value={scheduleInfo.close_time}
              onChange={(e) =>
                setScheduleInfo({ ...scheduleInfo, close_time: e.target.value })
              }
            />
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
            <label>Notes:</label>
            <input
              value={scheduleInfo.notes}
              onChange={(e) =>
                setScheduleInfo({ ...scheduleInfo, notes: e.target.value })
              }
            />
          </form>
        </>
      )}

      <button disabled={buttonDisabled} onClick={showOrSubmit}>
        Add New Schedule
      </button>
    </>
  )
}

export default CreateSchedule
