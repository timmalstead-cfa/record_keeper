const { REACT_APP_AIRTABLE_BASE, REACT_APP_AIRTABLE_API_KEY } = process.env

const CreateLocation = ({
  setFullFetchedRecord,
  buttonDisabled,
  disableButtons,
  org_id,
  locations,
}) => {
  return (
    <>
      <button onClick={() => console.log("working")}>Add Location</button>
    </>
  )
}

export default CreateLocation
