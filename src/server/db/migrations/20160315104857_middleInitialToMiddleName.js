
exports.up = function(knex, Promise) {
  return knex.schema.table('students', function(table) {
    table.dropColumn('middle_initial');
    table.string('middle_name');
  })
};

exports.down = function(knex, Promise) {
  table.dropColumn('middle_name');
  table.string('middle_initial');
};
