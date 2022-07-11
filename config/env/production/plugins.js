module.exports = ({ env }) => ({
  email: {
    config: {
      provider: "sendgrid",
      providerOptions: {
        apiKey: env("SENDGRID_API_KEY"),
      },
      settings: {
        defaultFrom: "no-reply@highrahcy.com",
        defaultReplyTo: "no-reply@highrachy.com",
      },
    },
  },
});
