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

    await strapi.config.email.send(strapi, {
      subject: `New Tenant Application - ${tenantInfo.tenantFullName}`,
      image: tenantInfo.tenantProfileImage,
      title: `Apartment - ${tenantInfo.apartment.name} (${tenantInfo.apartment.type})`,
      tableData: {
        fullName: tenantInfo.tenantFullName,
        email: tenantInfo.personalEmail,
        phone: tenantInfo.mobileTelephone,
      },
      buttonText: "View Full Profile",
      buttonLink: `https://www.highrachy.com/admin/tenants/${result.id}`,
    });

    await strapi.config.email.send(strapi, {
      to: tenantInfo.personalEmail,
      subject: `We have received your tenant application`,
      firstName: tenantInfo.firstName,
      contentTop: `Thank you for submitting your application.<br><br>
Our review team is currently reviewing all applications and we will be in touch with you soon. Your tracking number is <strong>HIG-TEN-00${tenantInfo.id}</strong>. <br><br>
We will keep you posted on the status of your application.<br><br><br>

Best Regards,<br>
Operations Team.`,
    });
  },
};
