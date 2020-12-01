const LocationsInfo = ({ locInfo }) => {
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
            <p>
              <code>PHONE:</code> {phone}
            </p>
          </div>
        )
      })}
    </section>
  )
}

export default LocationsInfo
