
const express = require("express");
const cors = require("cors");
const { Client } = require("pg");

const app = express();
const port = 5001;


app.use(cors());


const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "1234",
    port: 5432,
});

client.connect();


app.get("/pontos", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM pontos_servicos");
    res.json(result.rows); 
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao consultar o banco de dados");
  }
});


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
