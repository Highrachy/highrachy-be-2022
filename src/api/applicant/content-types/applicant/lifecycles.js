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
  async afterUpdate({ result }) {
    if (result.status === "REJECTED") {
      const applicantInfo = await strapi.entityService.findOne(
        "api::applicant.applicant",
        result.id,
        {
          populate: "*",
        }
      );

      await strapi.config.email.send(strapi, {
        to: applicantInfo.email,
        subject: `Your application for the ${applicantInfo.job.title} position`,
        firstName: applicantInfo.fullName,
        contentTop: `Thank you for applying with Highrachy for the role of <strong>${applicantInfo.job.title}</strong>. We really appreciate your interest in joining our company and we want to thank you for the time and energy you invested in your application for this position.<br><br>
For each opening, our team carefully selects from a pool of highly qualified professionals on the basis of professional experience, role alignment and cultural fitment. Our team has thoroughly reviewed your application, however, we feel that other candidates are more suitable for the position. <br><br>
While you were not successful on this occasion, we would encourage you to stay connected with us through <a href="https://highrachy.com/careers">Highrachy Careers</a> and <a href="https://www.linkedin.com/company/highrachy-investment-and-technology-limited">LinkedIn</a> to keep discovering more about Highrachy and apply again if you find a position that is suitable.<br><br>
We wish you all the best in your future endeavours.<br><br>

Best Regards,<br>
People's Team.`,
      });
    }
  },
};
