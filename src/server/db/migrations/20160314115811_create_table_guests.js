
exports.up = function(knex, Promise) {
  return knex.schema.createTable('guests', function(table) {
    table.increments();
    table.string('first_name');
    table.string('last_name');
    table.integer('students_id');
    table.string('school');
    table.foreign('student_id').references('id').inTable('students');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('guests');
};
