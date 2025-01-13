// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      host: '127.0.0.1', // Adresse du serveur
      user: 'root', // Nom d'utilisateur
      password: '', // Mot de passe
      database: 'agence_migrations'
    }
  },

  staging: {
    client: 'mysql2',
    connection: {
      database: 'agence',
      user: 'root',
      password: ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: './migrations'
    }
  },

  production: {
    client: 'mysql2',
    connection: {
      database: 'agence',
      user: 'root',
      password: ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: './migrations'
    }
  },
  seeds: {
    directory: '/serveur/', // Spécifie le répertoire des seeds
  },

};

