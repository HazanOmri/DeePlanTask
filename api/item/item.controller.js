const logger = require('../../services/logger.service')
const itemService = require('./item.service.js')

async function getItems(req, res) {
    try {
        const items = await itemService.query()
        res.json(items)
    } catch (err) {
        logger.error('Failed to get items', err)
        res.status(500).send({ err: 'Failed to get items' })
    }
}

async function getItemById(req, res) {
    try {
        const itemId = req.params.id
        const item = await itemService.getById(itemId)
        res.json(item)
    } catch (err) {
        logger.error('Failed to get item', err)
        res.status(500).send({ err: 'Failed to get item' })
    }
}

async function addItem(req, res) {
    try {
        let item = req.body
        item = await itemService.add(item)
        res.json(item)
    } catch (err) {
        console.log(err, 'Cant add item')
        res.status(500).send({ err: 'Failed to remove item' })
    }

}

async function updateItem(req, res) {
    try {
        console.log("req.body", req.body)
        const item = req.body
        const updatedItem = await itemService.update(item)
        res.json(updatedItem)
    } catch (err) {
        console.log('Failed to update item', err)
        res.status(500).send({ err: 'Failed to update item' })
    }

}

async function deleteItem(req, res) {
    try {
        const itemId = req.params.id
        const removedId = await itemService.remove(itemId)
        res.json(removedId)
    } catch (err) {
        console.log(err, 'Cant delete item')
        res.status(500).send({ err: 'Failed to remove item' })
    }
}

module.exports = {
    getItems,
    getItemById,
    addItem,
    updateItem,
    deleteItem
}