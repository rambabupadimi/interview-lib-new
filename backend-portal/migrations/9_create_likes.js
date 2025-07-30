exports.up = function(knex) {
  return knex.schema.createTable('likes', table => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users');
    table.integer('question_id').unsigned().nullable().references('id').inTable('questions');
    table.integer('answer_id').unsigned().nullable().references('id').inTable('answers');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.unique(['user_id', 'question_id', 'answer_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('likes');
}; 