const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(express.json()); 
app.use(cors());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "1234",
  port: 5432,
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1 AND senha = $2", [email, password]);

    if (result.rows.length > 0) {
      res.json({ success: true, message: "Login bem-sucedido!" });
    } else {
      res.status(401).json({ success: false, message: "Email ou senha incorretos" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro no servidor" });
  }
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
