
exports.up = function(knex, Promise) {
  return knex.schema.createTable('students', function(table) {
    table.increments();
    table.integer('student_id');
    table.string('first_name');
    table.string('middle_initial');
    table.string('last_name');
    table.integer('grade');
    table.integer('school_id');
    table.foreign('school_id').references('id').inTable('schools');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('students');
};
