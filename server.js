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
    password: 'Yagothelinkmysqlroot123***',
    database: 'controle_de_ponto'
})

//middleware para receber todos os dados no formato json
app.use(express.json())

//ENDPOINTS 

//rota para registrar um ponto de entrada
app.post('/api/registrar-entrada', async (req, res) => {
    const { numero_adesao, data_hora_entrada } = req.body

    //validaçao basica
    if (!numero_adesao || !data_hora_entrada) {
        return res.status(400).json({ error: 'Numero de adesao do funcionario e data/hora sao obrigatorios'})
    }

    try {
        const conexao = await pool.getConnection()// obtem uma conexao pool
        const [result] = await conexao.execute(
            'INSERT INTO controle_ponto (numero_adesao, data_hora_entrada) VALUES (?, ?)',
            [numero_adesao, data_hora_entrada]
        )
        conexao.release() //libera a conexao e volta para o pool
        res.status(201).json({ message: 'Ponto de entrada registrado com sucesso', id_ponto: result.insertId/*contem o ID da ultima inserçao AUTO_INCREMENT */})
    } catch (erro) {
        console.error('Erro ao registrar o ponto:', erro)
        res.status(500).json({ error: 'Erro interno no servidor ao registrar entrada'})
    }
})

//endpoint para registrar a saida
app.put('/api/registrar-saida/:id_ponto', async (req, res) => {
    const { id_ponto } = req.params //pega o id na URL
    const { data_hora_saida } = req.body

    if (!data_hora_saida) {
        return res.status(400).json({ error: 'Data/Hora de saida é obrigatorio!'})
    }

    try {
        const conexao = await pool.getConnection()
        const [result] = await conexao.execute(
            'UPDATE controle_ponto SET data_hora_saida = ? WHERE id_ponto = ?',
            [data_hora_saida, id_ponto]
        )
        conexao.release()

        if (result.affectedRows === 0 ) {
            return res.status(400).json({ message: 'Registro de ponto nao encontrado'})
        }
        res.status(200).json({ message: 'Ponto de saida registrado com sucesso!'})
    } catch (err) {
        console.error('Erro ao registrar saida', err)
        res.status(500).json({ error: 'Erro interno no servidor '})
    }
})

//endpoint para registrar hora de almoço
app.put('/api/registrar-almoco/:id_ponto', async (req, res) => {
    const { id_ponto } = req.params
    const { hora_almoco } = req.body

    const hora = hora_almoco.slice(11, 16)

    if (!hora_almoco) {
        return res.status(400).json({ error: 'Hora do almoço obrigatorio!'})
    }

    try {
        const conexao = await pool.getConnection()
        const [result] = await conexao.execute(
            'UPDATE controle_ponto SET hora_almoco = ? WHERE id_ponto = ?',
            [hora, id_ponto]
        )
        conexao.release()

        if (result.affectedRows === 0 ) {
            return res.status(400).json({ message: 'Registro de ponto nao encontrado'})
        }
        res.status(200).json({ message: 'Ponto de almoço registrado com sucesso'})
    } catch (err) {
        console.error('Erro ao registrar almoço', err)
        res.status(500).json({ error: 'Erro interno no servidor'})
    }
})

