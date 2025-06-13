const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const rateLimit = require('express-rate-limit');
const professionalsRoutes = require('./routes/Professionals');

// Agregar después de las importaciones existentes
require('./models/User');
require('./models/Category');
require('./models/Service');
require('./models/Booking');
require('./models/Chat');
require('./models/Professionals');


// El resto del código permanece igual...

// Cargar variables de entorno
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middlewares básicos
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: 'Demasiadas solicitudes desde esta IP'
});
app.use('/api/', limiter);

// Importar rutas
const authRoutes = require('./routes/auth');

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/professionals', professionalsRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Conectado a MongoDB');
})
.catch((error) => {
  console.error('❌ Error conectando a MongoDB:', error);
  process.exit(1);
});

// Socket.io para chat en tiempo real
io.on('connection', (socket) => {
  console.log('🔌 Usuario conectado:', socket.id);
  
  socket.on('join_chat', (data) => {
    socket.join(data.chatId);
    console.log(`👤 Usuario ${socket.id} se unió al chat ${data.chatId}`);
  });
  
  socket.on('send_message', (data) => {
    io.to(data.chatId).emit('receive_message', data);
  });
  
  socket.on('disconnect', () => {
    console.log('🔌 Usuario desconectado:', socket.id);
  });
});

// Rutas básicas
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Lo Que Quieras API funcionando!',
    version: '1.0.0',
    status: 'OK'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// app.use('/api/users', require('./routes/users'));
// app.use('/api/services', require('./routes/services'));
// app.use('/api/categories', require('./routes/categories'));
// app.use('/api/bookings', require('./routes/bookings'));

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Ruta no encontrada',
    path: req.originalUrl 
  });
});

// Middleware para manejo de errores
app.use((error, req, res, next) => {
  console.error('❌ Error:', error);
  res.status(error.status || 500).json({
    message: error.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📱 API disponible en: http://localhost:${PORT}`);
  console.log(`💬 Socket.IO funcionando para chat en tiempo real`);
});

module.exports = { app, io };