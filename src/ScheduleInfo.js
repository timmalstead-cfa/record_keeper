import DeleteButton from "./DeleteButton"
import CreateSchedule from "./CreateSchedule"

const ScheduleInfo = ({ scheInfo, ...setters }) => {
  return (
    <section className="border pad wide info overflow column">
      <h3 className="title">Schedule Info</h3>
      {scheInfo.map((record) => {
        const {
          location_name,
          days,
          open,
          close,
          weeks_open,
          air_id,
          notes,
        } = record
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
              <code>WEEKS OPEN:</code> {weeks_open}
            </p>
            {notes && (
              <p>
                <code>NOTES:</code> {notes}
              </p>
            )}
            <DeleteButton recordNumber={air_id} table="schedule" {...setters} />
          </div>
        )
      })}
      <CreateSchedule {...setters} />
    </section>
  )
}

export default ScheduleInfo
