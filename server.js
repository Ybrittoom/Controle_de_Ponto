const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const mysql = require('mysql2/promise')

app.use(express.static(path.join(__dirname, 'public')))

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})

//bloco do MySql

//configuraçao do db
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Yagothelinkmysql12',
    database: 'controle_ponto'
})

//middleware para receber todos os dados no formato json
app.use(express.json())

//ENDPOINTS 

//rota para registrar um ponto de entrada
app.post('/api/registrar-entrada', async (req, res) => {
    const { id_funcionario, data_hora_entrada } = req.body

    //validaçao basica
    if (!id_funcionario || !data_hora_entrada) {
        return res.status(400).json({ error: 'ID do funcionario e data/hora sao obrigatorios'})
    }

    try {
        const conexao = await pool.getConnection()// obtem uma conexao pool
        const [result] = await conexao.execute(
            'INSERT INTO controle_ponto (id_funcionario, data_hora_entrada) VALUES (?, ?)',
            [id_funcionario, data_hora_entrada]
        )
        conexao.release() //libera a conexao e volta para o pool
        res.status(201).json({ message: 'Ponto de entrada registrado com sucesso'})
    } catch (erro) {
        console.error('Erro ao registrar o ponto:', erro)
        res.status(500).json({ error: 'Erro interno no servidor ao registrar entrada'})
    }
})