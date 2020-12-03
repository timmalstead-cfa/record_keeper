import { useState, useEffect } from "react"
import OrgInfo from "./OrgInfo"
import LocationsInfo from "./LocationsInfo"
import ServicesInfo from "./ServicesInfo"
import ScheduleInfo from "./ScheduleInfo"
import fetchAllOrgRecords from "./fetchAllOrgRecords"
import fetchSingleRecord from "./fetchSingleRecord"

const Records = ({ setLogin }) => {
  const [fetchedRecords, setFetchedRecords] = useState(null)
  const [fullFetchedRecord, setFullFetchedRecord] = useState(null)
  const [buttonDisabled, setButtonDisabled] = useState(false)

  const disableButtons = () => {
    setButtonDisabled(true)
    setTimeout(() => setButtonDisabled(false), 1000)
  }

  const getFullRecord = ({ target }) => {
    fetchSingleRecord(target.title, setFullFetchedRecord)
    disableButtons()
  }

  useEffect(() => {
    fetchAllOrgRecords(setFetchedRecords)
    disableButtons()
  }, [])

  const setters = {
    setFetchedRecords,
    setFullFetchedRecord,
    buttonDisabled,
    disableButtons,
    org_id: fullFetchedRecord?.org_air_id,
    locations: fullFetchedRecord?.locations,
  }

  return (
    <>
      <div>
        <button
          disabled={buttonDisabled}
          onClick={() => fetchAllOrgRecords(setFetchedRecords)}
        >
          Fetch Records
        </button>
        <button
          disabled={buttonDisabled}
          onClick={() => setFullFetchedRecord({})}
        >
          Create New Organization
        </button>
        <button disabled={buttonDisabled} onClick={() => setLogin(false)}>
          Logout
        </button>
      </div>
      <div className="border wide org-names pad">
        <section className="border pad margin medium org-names column overflow">
          <h3 className="title">Organization Name</h3>
          {fetchedRecords ? (
            fetchedRecords.map((org, i) => (
              <p
                key={i}
                title={org.id}
                onClick={getFullRecord}
                className="org-listing"
              >
                {org.fields.org_name || null}
              </p>
            ))
          ) : (
            <p>Fetching Records...</p>
          )}
        </section>
        <div className="org-names column flex-space overflow">
          {fullFetchedRecord && (
            <OrgInfo orgInfo={fullFetchedRecord} {...setters} />
          )}
          {Boolean(fullFetchedRecord?.locations) && (
            <LocationsInfo locInfo={fullFetchedRecord.locations} {...setters} />
          )}
          {Boolean(fullFetchedRecord?.services) && (
            <ServicesInfo
              org_id={fullFetchedRecord.org_air_id}
              servInfo={fullFetchedRecord.services}
              {...setters}
            />
          )}
          {Boolean(fullFetchedRecord?.schedule) && (
            <ScheduleInfo scheInfo={fullFetchedRecord.schedule} {...setters} />
          )}
        </div>
      </div>
    </>
  )
}

export default Records
