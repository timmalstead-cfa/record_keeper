import DeleteButton from "./DeleteButton"

const OrgInfo = ({ orgInfo, ...setters }) => {
  const {
    org_name,
    org_notes,
    org_languages_spoken,
    org_website,
    org_tags,
    org_air_id,
  } = orgInfo
  return (
    <section className="border pad wide info overflow column">
      <h3 className="title">Organization Info</h3>
      <p>
        <code>NAME:</code> {org_name || ""}
      </p>
      {org_website && (
        <p>
          <code>WEBSITE:</code>{" "}
          <a
            className="link"
            href={org_website}
            target="_blank"
            rel="noopener noreferrer"
          >
            {org_website}
          </a>
        </p>
      )}
      <p>
        <code>LANGUAGES SPOKEN:</code> {org_languages_spoken || ""}
      </p>
      <p>
        <code>NOTES:</code> {org_notes || ""}
      </p>
      <p>
        <code>TAGS:</code>{" "}
        {org_tags?.length && org_tags.map((tag) => <span>{tag}, </span>)}
      </p>
      <DeleteButton
        recordNumber={org_air_id}
        table="organization"
        {...setters}
      />
    </section>
  )
}

export default OrgInfo
