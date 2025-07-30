exports.up = function(knex) {
  return knex.schema.createTable('experiences', table => {
    table.increments('id').primary();
    table.integer('years').notNullable();
    table.string('description');
    table.integer('created_by').unsigned().references('id').inTable('users');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('experiences');
}; 