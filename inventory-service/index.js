const express = require('express');
const app = express();
const PORT = process.env.PORT || 3003; // Porta que a API vai escutar (diferente das outras)

app.use(express.json());

// Dados mock de estoque
const inventory = {
    'prod001': { stock: 50, location: 'Warehouse A' },
    'prod002': { stock: 20, location: 'Warehouse B' },
    'prod003': { stock: 100, location: 'Warehouse A' },
    'prod004': { stock: 75, location: 'Warehouse C' },
};

// Endpoint GET para buscar o estoque de um produto por ID
app.get('/inventory/:productId', (req, res) => {
    const productId = req.params.productId;
    const item = inventory[productId];

    if (item) {
        console.log(`Requisição GET /inventory/${productId} recebida.`);
        res.status(200).json({ productId, stock: item.stock });
    } else {
        console.warn(`Estoque para produto ${productId} não encontrado.`);
        res.status(404).json({ message: 'Produto não encontrado no estoque' });
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Inventory Service rodando na porta ${PORT}`);
});