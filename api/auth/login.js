// Vercel Serverless Function - Login
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Base de datos en memoria (debe coincidir con register.js)
const users = new Map();

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }
  
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }
    
    // Buscar usuario
    const user = Array.from(users.values()).find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    
    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    
    // Generar token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'subvenciones-secret-key-dev',
      { expiresIn: '7d' }
    );
    
    return res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        email: user.email,
        company_name: user.company_name,
        plan: user.plan
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
