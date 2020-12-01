const ServicesInfo = ({ servInfo }) => {
  return (
    <section className="border pad wide info overflow column services-info">
      <h3 className="title">Services Info</h3>
      {servInfo.map((record) => (
        <p>
          <code>SERVICE OFFERED:</code> {record.name}
        </p>
      ))}
    </section>
  )
}

export default ServicesInfo
