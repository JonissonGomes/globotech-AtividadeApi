const express = require('express'); // Importando a lib
const app = express()
app.use(express.json()) // Usando o formato JSON

const PORT = 3000
// Time
/*
 {
     id: 0
     nome: '',
     descricao: '',
     jogadores: []
 }
*/

//Jogador
/*
 {  id: 0
     nome: '',
     sobrenome: '',
     funcao: '',
     nick: 
 }
*/

// Base local
let times = []
let membros = []

// Rotas
app.route('/times').post((req, res) => {
    // CreateTeam
    const time = req.body
    const nextId = times[times.length - 1]?.id + 1 || 1
    times.push({
        id: nextId,
        ...time
    })
    res.status(201).setHeader('Location', `http://localhost:${PORT}/times/${nextId}`).send()

}).get((req, res) => {
    //Listagem de times
    res.json(times)
})

app.route('/times/:id').get((req, res) => {
    // Buscar time
    const {id} = req.params
    const time = times.find(time => time.id == id)
    if (!time) {
        res.status(404).send()
        return
    }
    res.json(time)    
})


//
app.route('/times/:id/membros').post((req, res) => {
    // insercao de membros - Jonisson
    const { id } = req.params
    const requisicao = req.body
    
    const time = times.find(time => time.id == id)
    if (!time) {
        // Not found
        res.status(404).send()
        return
    }

    const orderId = membros[membros.length + 1]?.id + 1 || 1;

    const novoMembro = {
        id: orderId,
        ...requisicao
    }
    membros.push(novoMembro)

    times = times.map( (time) => {
        console.log(time)
        if (time.id == id) {
            return {                
                ...time,
                membros: [...membros],
            }
        }
        return time
    })

    res.status(201).setHeader('Location', `http://localhost:${PORT}/times/${id}/membros`).send()
}).get((_, res) => {
    //Listagem de membros de um time
    res.json(time)
})

// Listener
app.listen(PORT, () => {
    console.log(`Server init`)
})
