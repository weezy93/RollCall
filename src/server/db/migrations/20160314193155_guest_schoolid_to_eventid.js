
exports.up = function(knex, Promise) {
  return knex.schema.table('guests', function(table) {
    table.integer('event_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('guests', function(table) {
    table.dropColumn('event_id');
  });
};
