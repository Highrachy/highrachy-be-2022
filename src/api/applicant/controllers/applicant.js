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
      console.log("data?.attributes.job.id", data?.attributes?.job.data.id);
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
          fields: ["createdAt", "resume"],
        }
      );
      return {
        data: { ...data, previousApplications },
        meta,
      };
    },
  })
);
