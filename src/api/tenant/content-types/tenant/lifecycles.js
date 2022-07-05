const NEW_TENANT = {
  border: "#fde74c", // YELLOW
  channel: "ops-tenants",
  icon: ":tenant:",
  username: "New Tenant",
};

module.exports = {
  async afterCreate({ result }) {
    // https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/entity-service/crud.html
    const tenantInfo = await strapi.entityService.findOne(
      "api::tenant.tenant",
      result.id,
      {
        populate: "*",
      }
    );

    await strapi.config.slack.sendSlackNotification(
      `*${tenantInfo.tenantFullName} - <https://www.highrachy.com/apartments/${tenantInfo.apartment.slug}|${tenantInfo.apartment.name} - ${tenantInfo.apartment.type}>*`,
      {
        ...NEW_TENANT,
      }
    );
  },
};
