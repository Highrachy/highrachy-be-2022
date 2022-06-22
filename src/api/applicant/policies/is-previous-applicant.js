"use strict";

/**
 * `is-previous-applicant` policy.
 *
 * https://docs.strapi.io/developer-docs/latest/development/backend-customization/policies.html#plugin-policies
 */

module.exports = async (policyContext, config, { strapi }) => {
  const {
    data: { email, job },
  } = policyContext.request.body;

  const previousRegistration = await strapi.entityService.findMany(
    "api::applicant.applicant",
    { filters: { email, job } }
  );

  return !(previousRegistration.length > 0);
};
