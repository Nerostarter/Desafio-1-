const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
const app = express();
const port = 5002;

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "1234",
  port: 5432,
});

client.connect();

app.use(cors());
app.use(express.json());


app.get('/pontos', async (req, res) => {
  try {
    const { rows } = await client.query('SELECT * FROM pontos_servicos');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao consultar dados.');
  }
});


app.post('/pontos', async (req, res) => {
  const { etiqueta, latitude, longitude, logradouro, tipo } = req.body;

  try {
    
    const result = await client.query(
      'SELECT * FROM pontos_servicos WHERE etiqueta = $1 OR (latitude = $2 AND longitude = $3)',
      [etiqueta, latitude, longitude]
    );

    if (result.rows.length > 0) {
      return res.status(400).send('Já existe um ponto com a mesma etiqueta, latitude ou longitude.');
    }

 
    await client.query(
      'INSERT INTO pontos_servicos (etiqueta, latitude, longitude, logradouro, tipo) VALUES ($1, $2, $3, $4, $5)',
      [etiqueta, latitude, longitude, logradouro, tipo]
    );

    res.status(201).send('Ponto de serviço criado com sucesso!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar ponto.');
  }
});


app.put('/pontos/:id', async (req, res) => {
  const { id } = req.params;
  const { etiqueta, latitude, longitude, logradouro, tipo } = req.body;

  try {

    const result = await client.query(
      'SELECT * FROM pontos_servicos WHERE (etiqueta = $1 OR (latitude = $2 AND longitude = $3)) AND id != $4',
      [etiqueta, latitude, longitude, id]
    );

    if (result.rows.length > 0) {
      return res.status(400).send('Já existe um ponto com a mesma etiqueta, latitude ou longitude.');
    }

  
    await client.query(
      'UPDATE pontos_servicos SET etiqueta = $1, latitude = $2, longitude = $3, logradouro = $4, tipo = $5 WHERE id = $6',
      [etiqueta, latitude, longitude, logradouro, tipo, id]
    );

    res.status(200).send('Ponto atualizado com sucesso!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar ponto.');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});