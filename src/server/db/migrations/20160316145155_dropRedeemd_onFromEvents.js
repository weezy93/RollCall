
exports.up = function(knex, Promise) {
  return knex.schema.table('tickets', function(table) {
    table.dropColumn('redeemed_on');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('tickets', function(table) {
    table.date('redeemed_on');
  })
};
