const express = require('express');
const axios = require('axios');

const app = express();

app.get('/yahoo-finance', async (req, res) => {
  try {
    const { symbol } = req.query; // Obtém o símbolo da ação dos parâmetros da requisição
    const response = await axios.get(`https://api.example.com/finance?symbol=${symbol}`, {
      headers: {
        'x-api-key': 'SUA_API_KEY' // Inclua a chave da API se necessário
      }
    });
    res.json(response.data); // Envia os dados da API para o cliente
  } catch (error) {
    res.status(500).send(error.toString()); // Lida com erros e envia uma resposta apropriada
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});