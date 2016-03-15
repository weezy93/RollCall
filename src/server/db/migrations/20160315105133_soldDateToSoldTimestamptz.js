
exports.up = function(knex, Promise) {
  return knex.schema.table('tickets', function(table) {
    table.dropColumn('sold_date');
    table.timestamp('sold_timestamp');
  })
};

exports.down = function(knex, Promise) {
  table.dropColumn('sold_timestamp');
  table.date('sold_date');
};
