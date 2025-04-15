
exports.up = function (knex) {
    return knex.schema.createTable('agence_pieces', (table) => {
        table.increments('id').primary();
        table.string('code_piece', 150).unique().notNullable();
        table.string('nom_piece', 150).unique().notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.date("deleted_at").defaultTo(null);

    })
};


exports.down = function () {
    return knex.schema.dropTableIfExists('agence_pieces');

};
