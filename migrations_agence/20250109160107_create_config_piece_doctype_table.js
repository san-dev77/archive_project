exports.up = function (knex) {
    return knex.schema.createTable('config_piece_doctype', (table) => {
        table.increments('id').primary();
        table.integer('piece_id').unsigned().notNullable();
        table.integer('document_type_id').unsigned().notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.date("deleted_at").defaultTo(null);

        table.foreign('piece_id').references('id').inTable('agence_pieces').onDelete('RESTRICT')
        table.foreign('document_type_id').references('id').inTable('document_type').onDelete('RESTRICT')
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('config_piece_doctype');
};