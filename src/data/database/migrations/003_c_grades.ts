import Knex from 'knex';

export async function up(knex: Knex) {
  return await knex.schema.createTable('grades', table => {
    table.integer('matter_id').notNullable();
    table.integer('user_id').notNullable();
    table.integer('value').notNullable();
    table.string('name').notNullable();

    table.foreign('matter_id').references('id').inTable('matters');
    table.foreign('user_id').references('id').inTable('users');
  });
}

export async function down(knex: Knex) {
  return await knex.schema.dropTable('grades');
}
