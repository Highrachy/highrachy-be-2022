const slugify = require("slugify");

const generateSlug = (data) =>
  data?.name && slugify(`${data.name} ${data.type}`, { lower: true });

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
