const express = require('express')
const router = express.Router()
const Material = require("../controllers/Material")

router.use(function (req, res, next) {
	if (req.method == "GET") {
		return next()
	} else if (req.get("WSS-APITOKEN") == "INI_TOKEN_API_NYA_OKEE") {
		return next()
	}
	res.status(403)
	res.json("Authentication Required!")
})

// CREATE
router.post('/', async function(req, res, _) {
	if (!req.body["name"] || !req.body["price"]) {
		res.status(400)
		return res.json("Please enter `name` and `price` field")
	}
	if (req.body["price"] < 0) {
		res.status(400)
		return res.json("Please enter positive `price`")
	}
	try {
		await Material.create(req.body["name"], req.body["price"])
	} catch (err) {
		console.log(err)
		res.status(400)
		return res.json("Bad client request")
	}
	res.status(201)
	res.json("Material was created")
})

// READ ALL
router.get('/', async function(req, res, _) {
	try {
		var materials = await Material.getAll()
	} catch (err) {
		console.log(err)
		res.status(400)
		return res.json(err)
	}
	res.json(materials)
})

// READ SINGLE
router.get('/:id', async function(req, res, _) {
	var id = req.params["id"]
	try {
		var materials = await Material.get(id)
	} catch (err) {
		console.log(err)
		res.status(400)
		return res.json(err)
	}
	if (materials.length != 1) {
		res.status(404)
		return res.json("Material Not Found")
	}
	res.json(materials[0])
})

// UPDATE
router.put('/:id', async function(req, res, _) {
	let id = req.params["id"]
	if (!req.body["name"] || !req.body["price"]) {
		res.status(400)
		return res.json("Please enter `name` and `price` field")
	}
	if (req.body["price"] < 0) {
		res.status(400)
		return res.json("Please enter positive `price`")
	}
	try {
		let res = await Material.get(id)
		if (res.length != 1) {
			await Material.createWithId(id, req.body["name"], req.body["price"])
		} else {
			await Material.update(id, req.body["name"], req.body["price"])
		}
	} catch (err) {
		console.log(err)
		res.status(400)
		return res.json("Bad client request")
	}
	res.status(200)
	res.json("Material was placed")
})

// // DELETE
router.delete('/:id', async function(req, res, _) {
	let id = req.params["id"]
	try {
		await Material.delete(id)
	} catch (err) {
		console.log(err)
		res.status(400)
		return res.json("Bad client request")
	}
	res.status(200)
	res.json("Material was deleted")
})

router.post('/buy', async function(req, res, _) {
	try {
		var bal = parseInt(req.body["balance"])
		let supplies = req.body["supplies"]
		for (let i = 0; i < supplies.length; i++) {
			let mat = await Material.get(supplies[i]["id"])
			if (mat.length != 1) {
				res.status(404)
				return res.json("Material Not Found")
			}
			let amount = parseInt(supplies[i]["amount"])
			if (amount <= 0) {
				res.status(400)
				return res.json("Amount should not be negative or zero")
			}
			bal -= mat[0]["price"]*amount
		}
	} catch (err) {
		console.log(err)
		res.status(400)
		return res.json("Bad client request")
	}
	if (bal >= 0) {
		res.json({"message": "Buy is successful", "data": {"final_balance": bal}})
	} else {
		res.status(400)
		res.json({"message": "Balance is not sufficient", "data": {"needed": -bal}})
	}
})

module.exports = router