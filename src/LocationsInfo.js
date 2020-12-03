import DeleteButton from "./DeleteButton"
import CreateLocation from "./CreateLocation"

const LocationsInfo = ({ locInfo, ...setters }) => {
  return (
    <section className="border pad wide info overflow column">
      <h3 className="title">Locations Info</h3>
      {locInfo.map((record) => {
        const {
          address,
          address_2,
          services,
          state,
          city,
          phone,
          zip,
          name,
          air_id,
          email,
          location_website,
          location_notes,
        } = record
        return (
          <div className="border pad">
            {name && (
              <p>
                <code>NAME:</code> {name}
              </p>
            )}
            <div>
              <p>
                <code>ADDRESS:</code>{" "}
                {`${address}${address_2 ? `, ${address_2}` : ""}`}
              </p>
              <p>{`${city} ${state}, ${zip}`}</p>
            </div>
            <p>
              <code>SERVICES:</code> {services}
            </p>
            {phone && (
              <p>
                <code>PHONE:</code> {phone}
              </p>
            )}
            {email && (
              <p>
                <code>EMAIL:</code> {email}
              </p>
            )}
            {location_website && (
              <p>
                <code>LOCATION WEBSITE:</code> {location_website}
              </p>
            )}
            {location_notes && (
              <p>
                <code>LOCATION NOTES:</code> {location_notes}
              </p>
            )}
            <DeleteButton
              recordNumber={air_id}
              table="locations"
              {...setters}
            />
          </div>
        )
      })}
      <CreateLocation {...setters} />
    </section>
  )
}

export default LocationsInfo
