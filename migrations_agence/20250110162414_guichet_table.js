exports.up = function (knex) {
    return knex.schema.createTable('guichet', (table) => {
        table.increments('id').primary();
        table.string('code_guichet', 150).unique().notNullable();
        table.string('nom_guichet', 255);
        table.integer('agence_id').unsigned();
        table.date("deleted_at").defaultTo(null);
        table.foreign('agence_id').references('id').inTable('agence').onDelete('RESTRICT');
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('guichet');
};
