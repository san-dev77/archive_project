exports.up = function (knex) {
    return knex.schema.createTable('transaction_caisse', (table) => {
        table.increments('id').primary();
        table.integer('agence_id').unsigned().notNullable();
        table.integer('document_type_id').unsigned().notNullable();
        table.integer('code_caisse').unsigned().notNullable();
        table.varchar('dates', 255).notNullable();
        table.string('nom_prenom_caissier', 255).notNullable()
        table.string('code_definitif', 255).notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.date("deleted_at").defaultTo(null);


        table.foreign('agence_id').references('id').inTable('agence').onDelete('RESTRICT')
        table.foreign('document_type_id').references('id').inTable('document_type').onDelete('RESTRICT')
        table.foreign('code_caisse').references('id').inTable('caisse').onDelete('RESTRICT')
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('transaction_caisse');
};
