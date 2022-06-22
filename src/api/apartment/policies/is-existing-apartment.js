"use strict";

/**
 * `is-existing-apartment` policy.
 */

module.exports = async (policyContext, config, { strapi }) => {
  // Add your own logic here.
  strapi.log.info("In is-existing-apartment policy.");

  const {
    data: { name, type },
  } = policyContext.request.body;

  const { id } = policyContext.params;

  const apartmentExists = await strapi.entityService.findMany(
    "api::apartment.apartment",
    { filters: { name, type, ...(id && { id: { $ne: id } }) } }
  );

  return !(apartmentExists.length > 0);
};
