const ScheduleInfo = ({ scheInfo }) => {
  return (
    <section className="border pad wide info overflow column">
      <h3 className="title">Schedule Info</h3>
      {scheInfo.map((record) => {
        const { location_name, days, open, close, weeks_open } = record
        return (
          <div className="border pad">
            <p>
              <code>LOCATION:</code> {location_name}
            </p>
            <p>
              <code>DAY(S):</code> {days}
            </p>
            <p>
              <code>TIME:</code> {`${open} to ${close}`}
            </p>
            <p>
              <code>ORDINAL:</code> {weeks_open}
            </p>
          </div>
        )
      })}
    </section>
  )
}

export default ScheduleInfo
