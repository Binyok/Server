const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors'); // Import CORS package
const app = express();
const port = 3000;

// Configure body parser and CORS
app.use(bodyParser.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dagang'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

// Get products
app.get('/produk', (req, res) => {
  const sql = 'SELECT * FROM produk';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ error: 'Failed to fetch products' });
      return;
    }
    res.json(results);
  });
});

// Add product
app.post('/produk', (req, res) => {
  const { name, price, stock } = req.body;
  const sql = 'INSERT INTO produk (name, price, stock) VALUES (?, ?, ?)';
  db.query(sql, [name, price, stock], (err, results) => {
    if (err) {
      console.error('Error adding product:', err);
      res.status(500).json({ error: 'Failed to add product' });
      return;
    }
    res.status(201).json({ message: 'Product added', id: results.insertId });
  });
});

// Update product
app.put('/produk/:id_produk', (req, res) => {
  const { id_produk } = req.params;
  const { name, price, stock } = req.body;
  const sql = 'UPDATE produk SET name = ?, price = ?, stock = ? WHERE id_produk = ?';
  db.query(sql, [name, price, stock, id_produk], (err, results) => {
    if (err) {
      console.error('Error updating product:', err);
      res.status(500).json({ error: 'Failed to update product' });
      return;
    }
    res.status(200).json({ message: 'Product updated successfully' });
  });
});

// Delete product
app.delete('/produk/:id_produk', (req, res) => {
  const { id_produk } = req.params;
  const sql = 'DELETE FROM produk WHERE id_produk = ?';
  db.query(sql, [id_produk], (err, results) => {
    if (err) {
      console.error('Error deleting product:', err);
      res.status(500).json({ error: 'Failed to delete product' });
      return;
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  });
});

// Add purchase
app.post('/pembelian', (req, res) => {
  const { id_produk, buyer_name, class_location, whatsapp_number, total_price } = req.body;
  console.log('Received data:', req.body);
  const sql = 'INSERT INTO pembelian (id_produk, buyer_name, class_location, whatsapp_number, total_price) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [id_produk, buyer_name, class_location, whatsapp_number, total_price], (err, results) => {
    if (err) {
      console.error('Error inserting purchase:', err);
      res.status(500).json({ error: 'Failed to record purchase' });
      return;
    }
    console.log('Data inserted:', results);
    res.status(201).json({ message: 'Purchase recorded', id: results.insertId });
  });
});

// Get purchases
app.get('/pembelian', (req, res) => {
  const sql = 'SELECT * FROM pembelian JOIN produk ON pembelian.id_produk = produk.id_produk';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching purchases:', err);
      res.status(500).json({ error: 'Failed to fetch purchases' });
      return;
    }
    res.json(results);
  });
});

// Delete purchase
app.delete('/pembelian/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM pembelian WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error deleting purchase:', err);
      res.status(500).json({ error: 'Failed to delete purchase' });
      return;
    }
    res.status(200).json({ message: 'Purchase deleted successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
