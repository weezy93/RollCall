var seeder = require('knex-csv-seeder').seeder.seed;
exports.seed = seeder({
  table: 'guests',
  file: './src/server/db/csv/guests.csv',
});
