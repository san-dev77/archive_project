exports.up = function (knex) {
    return knex.schema.createTable('piece_file', (table) => {
        table.increments('id').primary();
        table.integer('piece_id').unsigned().notNullable();
        table.string('file_path', 255).notNullable()
        table.string('type', 255).notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now());

        table.date("deleted_at").defaultTo(null);

        table.foreign('piece_id').references('id').inTable('agence_pieces').onDelete('RESTRICT')
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('piece_file');
};