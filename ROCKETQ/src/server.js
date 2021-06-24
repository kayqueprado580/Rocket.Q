const express = require('express')
const route = require('./route')
const server = express()
const path = require('path')


//setando view engine
server.set('view engine', 'ejs')

//alterando o caminho da pasta para src/views
server.set('views', path.join(__dirname, 'views'))

//setando diretorio public static (publico statico)
server.use(express.static('public'))

// Middleware
server.use(express.urlencoded({ extended: true }))

//usar arquivo route/rotas
server.use(route)

//Outros
const PORT = process.env.PORT || 8088
server.listen(PORT, () => {
    console.log('Running...')
})