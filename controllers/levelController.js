const express = require('express')
const Level = require('../models/levelModel')

const getLevelDocument = async (level) => {
    try {
        const levelObj = await Level.findOne({
            level
        })
        if (!levelObj) {
            throw new Error('Level not found')
        }

        return levelObj
    } catch (err) {
        throw err
    }
}

module.exports = {
    getLevelDocument
}