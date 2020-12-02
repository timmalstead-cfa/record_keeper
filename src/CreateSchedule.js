import { useState } from "react"

const stackStyle = { display: "flex", justifyContent: "center" }

const CreateSchedule = ({
  setFetchedRecords,
  setFullFetchedRecord,
  buttonDisabled,
  disableButtons,
  org_id,
  locations,
}) => {
  const [showCreateSchedule, setShowCreateSchedule] = useState(false)
  const [scheduleInfo, setScheduleInfo] = useState({
    open_time: "09:00",
    close_time: "17:00",
    days: {
      Sun: false,
      Mon: true,
      Tue: true,
      Wed: true,
      Thu: true,
      Fri: true,
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
  })

  const showOrSubmit = () => {
    if (!showCreateSchedule) {
      setShowCreateSchedule(true)
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

    // const keys = Object.keys(scheduleInfo.days)
    // const values = Object.values(scheduleInfo.days)

    // const newDaysString = values.reduce((str, val, i, arr) => {
    //   if (val) {
    //     str += keys[i]
    //     if (i + 1 !== arr.length) str += ", "
    //   }
    //   return str
    // }, "")
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

  return (
    <>
      {showCreateSchedule && (
        <>
          <div style={stackStyle}>{days}</div>
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
          </form>
        </>
      )}

      <button onClick={showOrSubmit}>Add New Schedule</button>
    </>
  )
}

export default CreateSchedule
