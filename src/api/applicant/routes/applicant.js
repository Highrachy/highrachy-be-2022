"use strict";

/**
 * applicant router.
 * https://docs.strapi.io/developer-docs/latest/development/backend-customization/routes.html#configuring-core-routers
 *
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::applicant.applicant", {
  config: {
    create: {
      policies: ["is-previous-applicant"],
      middlewares: [],
    },
  },
});
