import fetchAllOrgRecords from "./fetchAllOrgRecords"
import fetchSingleRecord from "./fetchSingleRecord"

const { REACT_APP_AIRTABLE_BASE, REACT_APP_AIRTABLE_API_KEY } = process.env

const DeleteButton = ({
  table,
  recordNumber,
  setFetchedRecords,
  setFullFetchedRecord,
  buttonDisabled,
  disableButtons,
}) => {
  const confirmAndDeleteRecord = async () => {
    const result = window.confirm(
      "Come on, do you really want to delete this record?"
    )
    if (result) {
      const deleteRequest = await fetch(
        `https://api.airtable.com/v0/${REACT_APP_AIRTABLE_BASE}/${table}/${recordNumber}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${REACT_APP_AIRTABLE_API_KEY}` },
        }
      )
      const deleteResponse = await deleteRequest.json()
      console.log(deleteResponse)
      fetchAllOrgRecords(setFetchedRecords)
      if (table === "organization") setFullFetchedRecord(null)
      else fetchSingleRecord(recordNumber, setFullFetchedRecord)
      disableButtons()
    }
  }

  return (
    <button
      disabled={buttonDisabled}
      style={{ width: "25%", alignSelf: "center" }}
      onClick={confirmAndDeleteRecord}
    >
      Delete
    </button>
  )
}

export default DeleteButton
