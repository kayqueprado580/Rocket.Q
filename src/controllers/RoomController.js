const { open } = require('sqlite')
const Database = require('../db/config')
module.exports = {
    async create(req, res) {
        const db = await Database()
        const password = req.body.password
        let roomId
        let isRoom = true

        while (isRoom) {
            for (var i = 0; i < 6; i++) {
                i == 0 ? roomId = Math.floor(Math.random() * 10).toString() :
                    roomId += Math.floor(Math.random() * 10).toString()
            }

            const roomsExistIds = await db.all(`SELECT id FROM rooms`)
            isRoom = roomsExistIds.some(roomsExistId => roomsExistId === roomId)

            if (!isRoom) {
                await db.run(`INSERT INTO rooms (
                id,
                pass
                ) VALUES (
            ${parseInt(roomId)},"${password}"
            )`)
            }
        }
        await db.close()
        res.redirect(`/room/${roomId}`)
    },

    async open(req, res) {
        const db = await Database()
        const roomId = req.params.room
        const questions = await db.all(`SELECT * FROM questions WHERE room = ${roomId} and read = 0`)
        const questionsRead = await db.all(`SELECT * FROM questions WHERE room = ${roomId} and read = 1`)
        let isNoQuestions

        if (questions.length == 0) {
            if (questionsRead.length == 0) {
                isNoQuestions = true
            }
        }
        await db.close()
        res.render("room", { roomId, roomId, questions: questions, questionsRead: questionsRead, isNoQuestions: isNoQuestions })
    },

    async enter(req, res) {
        let roomId = req.body.roomId

        const db = await Database()
        const rooms = await db.all(`SELECT * FROM rooms where id = ${roomId}`)
        await db.close()
        if (rooms.length > 0) {
            res.redirect(`/room/${roomId}`)
        } else {
            res.redirect('/')
        }
    }
}