/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
function up(knex) {
  return knex.schema.createTable("price_fetching_run", function (table) {
    table.increments("id");
    table.timestamp("creation_date").defaultTo(knex.fn.now());
    table.json("result");
    table.timestamps();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
function down(knex) {
  return knex.schema.dropTable("price_fetching_run");
}

export { up, down };
