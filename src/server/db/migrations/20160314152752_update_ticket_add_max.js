
exports.up = function(knex, Promise) {
  return knex.schema.table('events', function(table) {
    table.integer('max_tickets');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('events', function(table) {
    table.dropColumn('max_tickets');
  });
};
