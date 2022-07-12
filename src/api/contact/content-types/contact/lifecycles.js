module.exports = {
  async afterCreate({ result }) {
    await strapi.config.email.send(strapi, {
      subject: `[Contact Us Page] ${result.subject} - ${result.name}`,
      tableData: {
        name: result.name,
        email: result.email,
        phone: result.phone,
        subject: result.subject,
      },
      contentBottom: result.message,
    });
  },
};
