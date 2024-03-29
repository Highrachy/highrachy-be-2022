"use strict";

/**
 * A set of functions called "actions" for `dashboard`
 */

module.exports = {
  async reports(ctx, next) {
    try {
      const data = await strapi.service("api::dashboard.dashboard").reports();

      ctx.body = data;
    } catch (err) {
      ctx.badRequest("Post report controller error", { moreDetails: err });
    }
  },
  async sendInterviewEmail(ctx, next) {
    try {
      console.log("ctx", ctx.request.body);
      const data = await strapi
        .service("api::dashboard.dashboard")
        .sendInterviewEmail(ctx.request.body.data);

      ctx.body = data;
    } catch (err) {
      ctx.badRequest("Post report controller error", { moreDetails: err });
    }
  },
};
