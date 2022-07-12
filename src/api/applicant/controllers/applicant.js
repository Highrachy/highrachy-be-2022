"use strict";

/**
 *  applicant controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::applicant.applicant",
  ({ strapi }) => ({
    async findOne(ctx) {
      const { data, meta } = await super.findOne(ctx);

      const previousApplications = await strapi.entityService.findMany(
        "api::applicant.applicant",
        {
          filters: {
            email: data.attributes.email,
            job: { id: { $ne: data?.attributes?.job.data.id } },
          },
          populate: {
            job: {
              fields: ["id", "title"],
            },
          },
          fields: ["createdAt", "resume", "status"],
        }
      );
      return {
        data: { ...data, previousApplications },
        meta,
      };
    },
  })
);
