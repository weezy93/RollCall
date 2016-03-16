
exports.up = function(knex, Promise) {
  return knex.schema.table('tickets', function(table) {
    table.timestamp('redeemed_on');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('tickets', function(table) {
    table.dropColumn('redeemed_on');
  })
};
