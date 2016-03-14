
exports.up = function(knex, Promise) {
  return knex.schema.createTable('schools', function(table) {
    table.increments('id');
    table.string('name');
    table.string('address');
    table.string('city_state_zip');
    table.text('image_url');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('schools');
};
