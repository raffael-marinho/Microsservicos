const express = require('express');
const app = express();
const PORT = process.env.PORT || 3002; // Porta que a API vai escutar (diferente das outras)

app.use(express.json()); // Habilita o uso de JSON no corpo das requisições

// Dados mock de usuários
const users = [
    { id: 'user001', name: 'Alice Smith', email: 'alice@example.com' },
    { id: 'user002', name: 'Bob Johnson', email: 'bob@example.com' },
    { id: 'user003', name: 'Charlie Brown', email: 'charlie@example.com' },
];

// Endpoint GET para buscar um usuário por ID
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (user) {
        console.log(`Requisição GET /users/${req.params.id} recebida.`);
        res.status(200).json(user);
    } else {
        console.warn(`Usuário com ID ${req.params.id} não encontrado.`);
        res.status(404).json({ message: 'Usuário não encontrado' });
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`User API rodando na porta ${PORT}`);
});