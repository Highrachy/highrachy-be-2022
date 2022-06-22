"use strict";

/**
 * apartment router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::apartment.apartment", {
  config: {
    create: {
      policies: ["is-existing-apartment"],
      middlewares: [],
    },
    update: {
      policies: ["is-existing-apartment"],
      middlewares: [],
    },
  },
});
