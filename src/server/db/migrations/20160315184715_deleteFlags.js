
exports.up = function(knex, Promise) {
  return knex.schema.table('events', function(table) {
    table.boolean('deleted').defaultsTo('false');
    table.date('deleted_date');
  })
  .then(function() {
    return knex.schema.table('guests', function(table) {
      table.boolean('deleted').defaultsTo('false');
      table.date('deleted_date');
    })
  })
  .then(function() {
    return knex.schema.table('schools', function(table) {
      table.boolean('deleted').defaultsTo('false');
      table.date('deleted_date');
    })
  })
  .then(function() {
    return knex.schema.table('students', function(table) {
      table.boolean('deleted').defaultsTo('false');
      table.date('deleted_date');
    })
  })
  .then(function() {
    return knex.schema.table('teachers', function(table) {
      table.boolean('deleted').defaultsTo('false');
      table.date('deleted_date');
    })
  })
  .then(function() {
    return knex.schema.table('tickets', function(table) {
      table.boolean('deleted').defaultsTo('false');
      table.date('deleted_date');
    })
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('tickets', function(table) {
    table.dropColumn('deleted');
    table.dropColumn('deleted_date');
  })
  .then(function() {
    return knex.schema.table('teachers', function(table) {
      table.dropColumn('deleted');
      table.dropColumn('deleted_date');
    });
  })
  .then(function() {
    return knex.schema.table('students', function(table) {
      table.dropColumn('deleted');
      table.dropColumn('deleted_date');
    });
  })
  .then(function() {
    return knex.schema.table('schools', function(table) {
      table.dropColumn('deleted');
      table.dropColumn('deleted_date');
    });
  })
  .then(function() {
    return knex.schema.table('guests', function(table) {
      table.dropColumn('deleted');
      table.dropColumn('deleted_date');
    });
  })
  .then(function() {
    return knex.schema.table('events', function(table) {
      table.dropColumn('deleted');
      table.dropColumn('deleted_date');
    });
  });
};
