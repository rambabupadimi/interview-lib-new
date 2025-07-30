exports.up = function(knex) {
  return knex.schema.createTable('answers', table => {
    table.increments('id').primary();
    table.integer('question_id').unsigned().references('id').inTable('questions');
    table.text('answer_text').notNullable();
    table.integer('created_by').unsigned().references('id').inTable('users');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('answers');
}; 