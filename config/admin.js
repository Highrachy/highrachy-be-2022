module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '9aa1881f98ddd05a0a31f736a6985d4d'),
  },
});
