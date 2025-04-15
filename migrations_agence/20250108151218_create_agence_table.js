exports.up = function (knex) {
    return knex.schema.createTable('agence', (table) => {
        table.increments('id').primary();
        table.string('code_agence', 150).unique().notNullable();
        table.string('nom_agence', 255);
        table.date("deleted_at").defaultTo(null);
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('agence');
};
