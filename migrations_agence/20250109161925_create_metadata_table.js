exports.up = function (knex) {
    return knex.schema.createTable('metadata', (table) => {
        table.increments('id').primary();
        table.string('nom_meta', 255).notNullable();
        table.string('type_meta', 255).notNullable()
        table.integer('document_type_id').unsigned().notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.date("deleted_at").defaultTo(null);

        table.foreign('document_type_id').references('id').inTable('document_type').onDelete('RESTRICT')
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('metadata');
};