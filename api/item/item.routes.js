const express = require('express')
// const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
// const { log } = require('../../middlewares/logger.middleware')
const { getItems, getItemById, addItem, updateItem, deleteItem } = require('./item.controller')
const router = express.Router()


router.get('/', getItems)
router.get('/:id', getItemById)
router.post('/', addItem)
router.put('/:id', updateItem)
router.delete('/:id',  deleteItem)


module.exports = router