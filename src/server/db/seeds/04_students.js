var seeder = require('knex-csv-seeder').seeder.seed;
exports.seed = seeder({
  table: 'students',
  file: './src/server/db/csv/students.csv',
});
