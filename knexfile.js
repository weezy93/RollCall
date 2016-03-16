// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost:5432/ticket-sales',
    migrations: {
      directory: __dirname+"/src/server/db/migrations"
    },
    seeds: {
      directory: __dirname+"/src/server/db/seeds"
    }
  },


  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL + '?ssl=true',
    migrations: {
      directory: __dirname+"/src/server/db/migrations"
    },
    seeds: {
      directory: __dirname+"/src/server/db/seeds"
    }
  }

};
