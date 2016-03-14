
exports.up = function(knex, Promise) {
  return knex.schema.createTable('tickets', function(table) {
    table.increments();
    table.integer('student_id');
    table.integer('event_id');
    table.date('sold_date');
    table.date('redeemed_on');
    table.foreign('student_id').references('id').inTable('students');
    table.foreign('event_id').references('id').inTable('events');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('tickets');
};
