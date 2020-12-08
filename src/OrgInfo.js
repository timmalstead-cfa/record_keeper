import DeleteButton from "./DeleteButton"
import CreateOrganization from "./CreateOrganization"
import AddExistingCategory from "./AddExistingCategory"
import CreateTags from "./CreateTags"

const OrgInfo = ({ orgInfo, ...setters }) => {
  const {
    org_name,
    org_website,
    org_languages_spoken,
    org_customers_served,
    org_notes,
    org_tags,
    org_air_id,
    org_categories,
  } = orgInfo
  return (
    <section className="border pad wide info overflow column">
      <h3 className="title">Organization Info</h3>
      {org_air_id ? (
        <>
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
          {org_languages_spoken && (
            <p>
              <code>LANGUAGES SPOKEN:</code> {org_languages_spoken}
            </p>
          )}
          {org_customers_served && (
            <p>
              <code>CUSTOMERS SERVED:</code> {org_customers_served}
            </p>
          )}
          {org_notes && (
            <p>
              <code>NOTES:</code> {org_notes}
            </p>
          )}
          <p>
            <code>TAGS:</code>{" "}
            {org_tags?.length &&
              org_tags.map((tag, i) => (
                <span>{i === 0 ? tag : `, ${tag}`} </span>
              ))}
          </p>
          <p>
            <code>CATEGORIES:</code>{" "}
            {org_categories?.length &&
              org_categories.map((category, i) => (
                <span>{i === 0 ? category : `, ${category}`} </span>
              ))}
          </p>
          <AddExistingCategory org_categories={org_categories} {...setters} />
          <CreateTags orgInfo={orgInfo} {...setters} />
          <DeleteButton
            recordNumber={org_air_id}
            table="organization"
            {...setters}
          />
        </>
      ) : (
        <CreateOrganization {...setters} />
      )}
    </section>
  )
}

export default OrgInfo
