const generateBlock = (info, prevJobs, total) => [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*Total Applicants:* ${total}`,
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
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*Previous Applications:* ${
        prevJobs.length > 0 ? prevJobs.length : "None"
      }`,
    },
  },
  ...generatePrevJob(prevJobs),
];

const generatePrevJob = (prevJobs) =>
  prevJobs.length > 0
    ? prevJobs.map(({ createdAt, job }) => ({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `- *${job.title}* on ${strapi.config.dateHelpers.getDate(
            createdAt
          )}`,
        },
      }))
    : [];

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
    const numberOfApplications = await strapi.entityService.findMany(
      "api::applicant.applicant",
      {
        filters: { job: applicantInfo.job.id },
      }
    );
    const previousApplications = await strapi.entityService.findMany(
      "api::applicant.applicant",
      {
        filters: {
          email: applicantInfo.email,
          job: { id: { $ne: applicantInfo.job.id } },
        },
        populate: {
          job: {
            fields: ["id", "title"],
          },
        },
        fields: ["createdAt"],
      }
    );

    await strapi.config.slack.sendSlackNotification(
      `*${applicantInfo.fullName} - <https://www.highrachy.com/careers/${applicantInfo.job.slug}|${applicantInfo.job.title}>*`,
      {
        ...NEW_APPLICANT,
        blocks: generateBlock(
          applicantInfo,
          previousApplications,
          numberOfApplications.length
        ),
      }
    );

    // await strapi
    //   .plugin("email")
    //   .service("email")
    //   .send({
    //     to: process.env.OUR_EMAIL || "haruna@highrachy.com",
    //     from: "info@highrachy.com",
    //     subject: `New Applicant ${applicantInfo.fullName} - ${applicantInfo.job.title}`,
    //     text: "Hello world",
    //     html: `<h4>Hello world</h4>`,
    //   });
  },
};
