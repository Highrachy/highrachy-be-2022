const slugify = require("slugify");

const generateSlug = ({ title }) =>
  `${slugify(title, { lower: true })}-${Date.now()}`;

module.exports = {
  beforeCreate(event) {
    const { data } = event.params;

    data.slug = generateSlug(data);
  },
};
