var seeder = require('knex-csv-seeder').seeder.seed;
exports.seed = seeder({
  table: 'schools',
  file: './src/server/db/csv/schools.csv',
});
