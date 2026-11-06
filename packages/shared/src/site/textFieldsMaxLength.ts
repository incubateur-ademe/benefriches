// The site name and the names of its stakeholders (owner, tenant, urban zone manager) are stored in
// varchar(255) columns: a longer value must be rejected before it reaches the database.
export const SITE_NAME_MAX_LENGTH = 255;
export const SITE_STAKEHOLDER_NAME_MAX_LENGTH = 255;
