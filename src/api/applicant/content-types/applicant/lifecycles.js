const generateBlock = (info) => [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `New Applicant - *${info.fullName}*:\n*<https://www.highrachy.com/careers/${info.job.slug}|${info.job.title}>*`,
    },
  },
  {
    type: "section",
    fields: [
      {
        type: "mrkdwn",
        text: `*Email:*\n${info.email}`,
      },
      {
        type: "mrkdwn",
        text: `*Phone Number:*\n${info.phoneNumber}`,
      },
    ],
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*Resume:*\n${info.resume}`,
    },
  },
];

const NEW_APPLICANT = {
  border: "#630017", // Rosewood color
  channel: "ops-applicants",
  icon: ":applicant:",
  username: "New Applicant",
};

module.exports = {
  async afterCreate({ result }) {
    // https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/entity-service/crud.html
    const applicantInfo = await strapi.entityService.findOne(
      "api::applicant.applicant",
      result.id,
      {
        populate: "*",
      }
    );
    console.log("applicantInfo", applicantInfo);
    const numberOfApplications = await strapi.entityService.findMany(
      "api::applicant.applicant",
      {
        filters: { job: applicantInfo.job.id },
      }
    );
    await strapi.config.slack.sendSlackNotification(
      `*Total Applicants:* ${numberOfApplications.length}`,
      { ...NEW_APPLICANT, blocks: generateBlock(applicantInfo) }
    );
  },
};
