import Knex from 'knex';

export async function up(knex: Knex) {
  return await knex.schema.createTable('matters', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
  });
}

export async function down(knex: Knex) {
  return await knex.schema.dropTable('matter');
}
