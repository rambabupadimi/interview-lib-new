exports.up = function(knex) {
  return knex.schema.createTable('comments', table => {
    table.increments('id').primary();
    table.text('content').notNullable();
    table.integer('user_id').unsigned().references('id').inTable('users');
    table.integer('question_id').unsigned().nullable().references('id').inTable('questions');
    table.integer('answer_id').unsigned().nullable().references('id').inTable('answers');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('comments');
}; 