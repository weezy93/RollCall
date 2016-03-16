var seeder = require('knex-csv-seeder').seeder.seed;
exports.seed = seeder({
  table: 'events',
  file: './src/server/db/csv/events.csv',
});
