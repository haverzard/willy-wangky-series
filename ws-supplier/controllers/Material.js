const db = require("../db.js").promise()

async function getAll() {
  const [res, _] = await db.query("SELECT * FROM material;")
  return res
}

async function get(id) {
  const [res, _] = await db.query("SELECT * FROM material WHERE id = ?;", [id])
  return res
}

async function create(name, price) {
  const [res, _] = await db.query("INSERT INTO material (name, price) VALUES (?, ?);", [name, price])
  return res
}

async function createWithId(id, name, price) {
  const [res, _] = await db.query("INSERT INTO material VALUES (?, ?, ?);", [id, name, price])
  return res
}

async function update(id, name, price) {
  const [res, _] = await db.query("UPDATE material SET name = ?, price = ? WHERE id = ?;", [name, price, id])
  return res
}

async function _delete(id) {
  const [res, _] = await db.query("DELETE FROM material WHERE id = ?;", [id])
  return res

}

module.exports = {
	getAll: getAll,
	get: get,
	create: create,
	createWithId: createWithId,
	update: update,
	delete: _delete,
}