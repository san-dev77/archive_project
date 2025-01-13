exports.up = function (knex) {
    return knex.schema.createTable('document_type', (table) => {
        table.increments('id').primary();
        table.string('nom_document_type', 150).unique().notNullable();
        table.date("deleted_at").defaultTo(null);
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('document_type');
};
