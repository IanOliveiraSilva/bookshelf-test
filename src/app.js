const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require('body-parser');



const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do View Engine e pasta de views
app.set("views", path.join(__dirname, "..", "public", "views"));
app.set("view engine", "ejs");

// Middleware para processar dados JSON e formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: "application/vnd.api+json" }));

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));

// Middleware para permitir requisições de diferentes origens
app.use(cors());

// Rotas
const index = require("./route/index");
const bookRoute = require("./route/book.routes");

// Middleware para o uso das rotas
app.use(index);
app.use("/api", bookRoute);


// Error Handling Middleware
app.use((err, req, res, next) => {
  if (err instanceof Error) {
    return res.status(400).json({
      status: "error",
      message: err.message,
      stack: err.stack, 
    });
  }

  console.error(err);

  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
});


module.exports = app;
