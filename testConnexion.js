const knex = require('knex');
const config = require('./knexfile');

const db = knex(config.development);

db.raw('SELECT 1 + 1 AS result')
    .then((response) => {
        console.log('Connexion réussie :', response[0]);
        db.destroy(); // Ferme la connexion après le test
    })
    .catch((error) => {
        console.error('Erreur de connexion :', error);
        db.destroy();
    });
