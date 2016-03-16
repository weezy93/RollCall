var seeder = require('knex-csv-seeder').seeder.seed;
exports.seed = seeder({
  table: 'tickets',
  file: './src/server/db/csv/tickets.csv',
});
