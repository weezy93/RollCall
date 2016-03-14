
exports.up = function(knex, Promise) {
  return knex.schema.createTable('events', function(table) {
    table.increments('id');
    table.string('name');
    table.date('event_date');
    table.integer('school_id');
    table.text('description');
    table.string('teachers_in_charge');
    table.string('address');
    table.string('city_state_zip');
    table.foreign('school_id').references('id').inTable('schools');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('events');
};
