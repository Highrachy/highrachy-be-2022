module.exports = {
  routes: [
    {
      method: "GET",
      path: "/dashboard",
      handler: "dashboard.reports",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/dashboard/send-interview-email",
      handler: "dashboard.sendInterviewEmail",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
