// Vercel Serverless Function - Register
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail } = require('../lib/kv');

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
    const { email, password, company_name } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }
    
    // Verificar si el email ya existe
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    
    // Crear usuario
    const id = uuidv4();
    const password_hash = await bcrypt.hash(password, 10);
    
    const user = {
      id,
      email,
      password_hash,
      company_name: company_name || null,
      plan: 'free',
      created_at: new Date().toISOString()
    };
    
    await createUser(user);
    
    // Generar token
    const token = jwt.sign(
      { userId: id, email },
      process.env.JWT_SECRET || 'subvenciones-secret-key-dev',
      { expiresIn: '7d' }
    );
    
    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      token,
      user: {
        id: user.id,
        email: user.email,
        company_name: user.company_name,
        plan: user.plan
      }
    });
  } catch (error) {
    console.error('Error en register:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
