const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgres://postgres:root123@localhost:5432/virtuallibrary",
});

pool.connect((err) => {
  if (err) {
    console.log(err.message);
    return;
  }
  console.log("Base de Dados conectado com sucesso!");
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
