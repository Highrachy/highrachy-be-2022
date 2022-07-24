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

    await strapi.config.email.send(strapi, {
      to: applicantInfo.email,
      subject: `Thank you for your application at Highrachy`,
      firstName: applicantInfo.fullName,
      contentTop: `Thank you for applying to the <strong>${applicantInfo.job.title}</strong> position at Highrachy.<br><br>
Our hiring team is currently reviewing all applications and we will be in touch with you soon. <br><br>
Thank you, again, for taking the time to apply to this role at Highrachy.<br><br><br>

Best Regards,<br>
People's Team.`,
    });
  },
};
