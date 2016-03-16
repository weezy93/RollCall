var seeder = require('knex-csv-seeder').seeder.seed;
exports.seed = seeder({
  table: 'teachers',
  file: './src/server/db/csv/teachers.csv',
});
