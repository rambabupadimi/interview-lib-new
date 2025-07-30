exports.up = function(knex) {
  return knex.schema.createTable('companies', table => {
    table.increments('id').primary();
    table.string('name').unique().notNullable();
    table.integer('created_by').unsigned().references('id').inTable('users');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('companies');
}; 