const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000; // O el puerto que prefieras

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/tienda', { useNewUrlParser: true, useUnifiedTopology: true });

const purchaseSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
  email: String,
  cart: Array,
  total: Number,
  paypalOrderId: String,
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

app.post('/api/checkout', async (req, res) => {
  const { name, address, phone, email, cart, total, paypalOrderId } = req.body;

  const newPurchase = new Purchase({
    name,
    address,
    phone,
    email,
    cart,
    total,
    paypalOrderId,
  });

  try {
    await newPurchase.save();
    res.status(201).json({ message: 'Compra registrada con éxito' });
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar la compra' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
