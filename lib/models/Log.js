const pool = require('../utils/pool');

module.exports = class Log {
  recipeId;
  dateOfEvent;
  notes;
  rating;

  constructor(row) {
    this.recipeId = row.recipe_id;
    this.dateOfEvent = row.date_of_event;
    this.notes = row.notes;
    this.rating = row.rating;
  }

  static async insert(log) {
    const { rows } = await pool.query(
      'INSERT into logs (recipe_id, date_of_event, notes, rating) VALUES ($1, $2, $3, $4) RETURNING *',
      [log.recipeId, log.dateOfEvent, log.notes, log.rating]
    );

    return new Log(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM logs'
    );

    return rows.map(row => new Log(row));
  }

  static async findById(recipeId) {
    const { rows } = await pool.query(
      'SELECT * FROM logs WHERE recipe_id=$1',
      [recipeId]
    );

    if(!rows[0]) return null;
    else return new Log(rows[0]);
  }

  static async update(recipeId, log) {
    const { rows } = await pool.query(
      `UPDATE logs
       SET recipe_id=$1,
           date_of_event=$2,
           notes=$3,
           rating=$4
       WHERE recipe_id=$5
       RETURNING *
      `,
      [log.recipeId, log.dateOfEvent, log.notes, log.rating, recipeId]
    );

    return new Log(rows[0]);
  }

  static async delete(recipeId) {
    const { rows } = await pool.query(
      'DELETE FROM logs WHERE recipe_id=$1 RETURNING *',
      [recipeId]
    );

    return new Log(rows[0]);
  }
};
