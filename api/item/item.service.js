const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
var num = 1

async function query() {
    try {
        const collection = await dbService.getCollection('supply')
        var items = await collection.find({}).toArray()
        return items
    } catch (err) {
        logger.error('cannot find items', err)
        throw err
    }
}

async function getById(itemId) {
    try {
        const collection = await dbService.getCollection('supply')
        const item = collection.findOne({ _id: ObjectId(itemId) })
        return item
    } catch (err) {
        logger.error(`while finding item ${itemId}`, err)
        throw err
    }
}

async function remove(itemId) {
    try {
        const collection = await dbService.getCollection('supply')
        await collection.deleteOne({ _id: ObjectId(itemId) })
        return itemId
    } catch (err) {
        logger.error(`cannot remove item ${itemId}`, err)
        throw err
    }
}

async function add(item) {
    try {
        item.num = num++
        const collection = await dbService.getCollection('supply')
        await collection.insertOne(item)
        return item
    } catch (err) {
        logger.error('cannot insert item', err)
        console.error(err, 'cannot insert item ')
        throw err
    }
}

async function update(item) {
    try {
        let itemToSave = { ...item }
        delete itemToSave._id
        const collection = await dbService.getCollection('supply')
        itemToSave = await collection.updateOne({ _id: ObjectId(item._id) }, { $set: itemToSave })
        return itemToSave
    } catch (err) {
        logger.error(`cannot update item ${item._id}`, err)
        throw err
    }
}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
}
