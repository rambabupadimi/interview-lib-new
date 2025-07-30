exports.up = function(knex) {
  return knex.schema.createTable('questions', table => {
    table.increments('id').primary();
    table.text('title').notNullable();
    table.integer('technology_id').unsigned().references('id').inTable('technologies');
    table.integer('company_id').unsigned().references('id').inTable('companies');
    table.integer('experience_id').unsigned().references('id').inTable('experiences');
    table.integer('created_by').unsigned().references('id').inTable('users');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('questions');
}; 