import DeleteButton from "./DeleteButton"

const ServicesInfo = ({ servInfo, ...setters }) => {
  return (
    <section className="border pad wide info overflow column services-info">
      <h3 className="title">Services Info</h3>
      {servInfo.map((record) => {
        const { name, air_id } = record
        return (
          <p>
            <code>SERVICE OFFERED:</code> {name}
            <DeleteButton recordNumber={air_id} table="services" {...setters} />
          </p>
        )
      })}
    </section>
  )
}

export default ServicesInfo
