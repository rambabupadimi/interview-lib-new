/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('roles').del();
  await knex('roles').insert([
    { id: 1, name: 'admin' },
    { id: 2, name: 'superadmin' },
    { id: 3, name: 'operator' },
    { id: 4, name: 'user' }
  ]);
}; 