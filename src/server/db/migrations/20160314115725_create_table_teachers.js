
exports.up = function(knex, Promise) {
  return knex.schema.createTable('teachers', function(table) {
    table.increments();
    table.integer('teacher_id');
    table.string('first_name');
    table.string('last_name');
    table.string('email_address');
    table.string('password');
    table.integer('school_id');
    table.boolean('is_admin');
    table.foreign('school_id').references('id').inTable('schools');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('teachers');
};
