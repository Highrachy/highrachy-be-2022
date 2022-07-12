"use strict";

/**
 * dashboard service.
 */

const sliceEntries = (array, number) => array.slice(0, number);
const getEntries = (array, number = 3) => {
  const arr = sliceEntries(array, number);

  return arr.map((item) => {
    return {
      id: item.id,
      attributes: { ...item },
    };
  });
};

module.exports = () => ({
  reports: async () => {
    try {
      const applicants = await strapi.entityService.findMany(
        "api::applicant.applicant"
      );
      const jobs = await strapi.entityService.findMany("api::job.job", {});
      const apartments = await strapi.entityService.findMany(
        "api::apartment.apartment"
      );
      const tenants = await strapi.entityService.findMany("api::tenant.tenant");

      const applicantsCount = await strapi.entityService.count(
        "api::applicant.applicant",
        {
          filters: {
            $or: [
              {
                status: "WAITING LIST",
              },
              {
                status: "APPLIED",
              },
            ],
          },
        }
      );
      const jobsCount = await strapi.entityService.count("api::job.job", {
        filters: {
          available: true,
        },
      });
      const apartmentsCount = await strapi.entityService.count(
        "api::apartment.apartment",
        {
          filters: {
            availableUnits: 0,
          },
        }
      );
      const tenantsCount = await strapi.entityService.count(
        "api::tenant.tenant",
        {
          filters: {
            status: "APPLIED",
          },
        }
      );

      const data = {
        applicants: {
          total: applicants.length,
          data: getEntries(applicants),
          text: `${applicantsCount} new application${
            applicantsCount === 1 ? "" : "s"
          }`,
        },
        apartments: {
          total: apartments.length,
          data: getEntries(apartments),
          text: `${apartmentsCount} available unit${
            apartmentsCount === 1 ? "" : "s"
          }`,
        },
        tenants: {
          total: tenants.length,
          data: getEntries(tenants),
          text: `${tenantsCount} new application${
            tenantsCount === 1 ? "" : "s"
          }`,
        },
        jobs: {
          total: jobs.length,
          data: getEntries(jobs),
          text: `${jobsCount} active job${jobsCount === 1 ? "" : "s"}`,
        },
      };

      return { data };
    } catch (err) {
      return err;
    }
  },
});
