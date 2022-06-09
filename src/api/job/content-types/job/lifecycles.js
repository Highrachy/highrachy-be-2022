const slugify = require("slugify");

const generateSlug = ({ title }) => slugify(title, { lower: true });

module.exports = {
  beforeCreate(event) {
    const { data } = event.params;

    data.slug = generateSlug(data);
  },

  beforeUpdate(event) {
    const { data } = event.params;
    data.slug = generateSlug(data);
  },
};
