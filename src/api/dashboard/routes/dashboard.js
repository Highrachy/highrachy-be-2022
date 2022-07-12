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
  ],
};
