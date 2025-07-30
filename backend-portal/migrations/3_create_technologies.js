exports.up = function(knex) {
  return knex.schema.createTable('technologies', table => {
    table.increments('id').primary();
    table.string('name').unique().notNullable();
    table.integer('created_by').unsigned().references('id').inTable('users');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('technologies');
}; 