const express = require('express');
const fetch = require('node-fetch'); // <-- Adicionado: Importa a biblioteca para fazer requisições HTTP
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;
// IMPORTANTE: Quando rodamos com Docker Compose, os serviços se comunicam pelo nome do serviço
// O nome 'inventory-service' aqui refere-se ao nome do contêiner ou serviço definido no Docker Compose.
const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL || 'http://localhost:3003'; // <-- Adicionado: URL do serviço de estoque

app.use(express.json());

app.use(cors({ // <-- ADICIONADO: Usa o middleware cors
    origin: 'http://localhost:3000', // Permite apenas requisições do seu frontend
    credentials: true, // Permite o envio de cookies/cabeçalhos de autorização
}));

const products = [
    { id: 'prod001', name: 'Wireless Headphones', price: 129.99, category: 'Electronics' },
    { id: 'prod002', name: 'Smart Watch', price: 299.99, category: 'Electronics' },
    { id: 'prod003', name: 'Laptop Backpack', price: 79.99, category: 'Accessories' },
    { id: 'prod004', name: 'Gaming Mouse', price: 49.99, category: 'Electronics' },
];

// Endpoint GET para listar todos os produtos com estoque
app.get('/products', async (req, res) => { // <-- Modificado: Função assíncrona
    console.log('Requisição GET /products recebida.');
    try {
        const productsWithStock = await Promise.all(
            products.map(async product => {
                // Chama o serviço de estoque para cada produto
                const inventoryRes = await fetch(`${INVENTORY_SERVICE_URL}/inventory/${product.id}`); // <-- Adicionado: Chamada HTTP
                if (inventoryRes.ok) {
                    const inventoryData = await inventoryRes.json();
                    return { ...product, stock: inventoryData.stock }; // <-- Adicionado: Adiciona o estoque ao produto
                } else {
                    console.warn(`Estoque para ${product.id} não disponível. Status: ${inventoryRes.status}`);
                    return { ...product, stock: 'N/A' };
                }
            })
        );
        res.status(200).json(productsWithStock);
    } catch (error) {
        console.error('Erro ao buscar estoque:', error);
        res.status(500).json({ message: 'Erro interno ao buscar produtos e estoque.' });
    }
});

// Endpoint GET para buscar um produto por ID (também com estoque)
app.get('/products/:id', async (req, res) => { // <-- Modificado: Função assíncrona
    const product = products.find(p => p.id === req.params.id);
    if (product) {
        console.log(`Requisição GET /products/${req.params.id} recebida.`);
        try {
            // Chama o serviço de estoque para o produto específico
            const inventoryRes = await fetch(`${INVENTORY_SERVICE_URL}/inventory/${product.id}`); // <-- Adicionado: Chamada HTTP
            if (inventoryRes.ok) {
                const inventoryData = await inventoryRes.json();
                res.status(200).json({ ...product, stock: inventoryData.stock }); // <-- Adicionado: Adiciona o estoque
            } else {
                console.warn(`Estoque para ${product.id} não disponível. Status: ${inventoryRes.status}`);
                res.status(200).json({ ...product, stock: 'N/A' }); // Retorna o produto mesmo sem estoque
            }
        } catch (error) {
            console.error(`Erro ao buscar estoque para ${req.params.id}:`, error);
            res.status(500).json({ message: 'Erro interno ao buscar produto e estoque.' });
        }
    } else {
        console.warn(`Produto com ID ${req.params.id} não encontrado.`);
        res.status(404).json({ message: 'Produto não encontrado' });
    }
});

app.listen(PORT, () => {
    console.log(`Product API rodando na porta ${PORT}`);
});