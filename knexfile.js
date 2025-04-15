// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST_PRIMARY,
      user: process.env.DB_USER_PRIMARY,
      password: process.env.DB_PASSWORD_PRIMARY,
      database: process.env.DB_NAME_PRIMARY,
      port: process.env.DB_PORT_PRIMARY
    }
  },

  secondary: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST_SECONDARY,
      user: process.env.DB_USER_SECONDARY,
      password: process.env.DB_PASSWORD_SECONDARY,
      database: process.env.DB_NAME_SECONDARY,
      port: process.env.DB_PORT_SECONDARY
    }
  },

  staging: {
    client: 'mysql2',
    connection: {
      database: 'agence',
      user: 'root',
      password: ''
    },
    connection_secondary: {
      database: 'archive',
      user: 'root',
      password: ''
    },
    pool: {
      min: 2,
      max: 20
    },
    migrations: {
      tableName: './migrations_agence'
    }
  },

  production: {
    client: 'mysql2',
    connection: {
      database: 'agence',
      user: 'root',
      password: ''
    },
    connection_secondary: {
      database: 'archive',
      user: 'root',
      password: ''
    },
    pool: {
      min: 2,
      max: 20
    },
    migrations: {
      tableName: './migrations_agence'
    }
  },

  seeds: {
    directory: '/serveur/', // Spécifie le répertoire des seeds
  },

};
