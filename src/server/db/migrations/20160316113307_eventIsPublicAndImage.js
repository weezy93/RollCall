
exports.up = function(knex, Promise) {
  return knex.schema.table('events', function(table) {
    table.boolean('is_public');
    table.string('image_url');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('events', function(table) {
    table.dropColumn('is_public');
    table.dropColumn('image_url');
  });
};
