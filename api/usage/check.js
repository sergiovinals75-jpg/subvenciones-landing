// Vercel Serverless Function - Check Usage
const jwt = require('jsonwebtoken');

// Límites por plan
const PLAN_LIMITS = {
  free: { searches: 2, analyses: 1, pdfs: 0 },
  basico: { searches: 10, analyses: 3, pdfs: 1 },
  profesional: { searches: 50, analyses: 25, pdfs: 10 },
  empresa: { searches: -1, analyses: -1, pdfs: -1 }
};

// Base de datos en memoria
const usage = new Map();

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }
  
  try {
    // Verificar token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'subvenciones-secret-key-dev');
    
    const { type } = req.body;
    if (!['searches', 'analyses', 'pdfs'].includes(type)) {
      return res.status(400).json({ error: 'Tipo inválido' });
    }
    
    // Obtener uso actual
    const month = getCurrentMonth();
    const key = `${decoded.userId}-${month}`;
    
    if (!usage.has(key)) {
      usage.set(key, { searches: 0, analyses: 0, pdfs: 0 });
    }
    
    const currentUsage = usage.get(key);
    const limit = PLAN_LIMITS.free[type]; // Por defecto plan free
    
    const canUse = limit === -1 || currentUsage[type] < limit;
    
    return res.json({
      canUse,
      current: currentUsage[type],
      limit: limit === -1 ? 'Ilimitado' : limit,
      remaining: limit === -1 ? -1 : Math.max(0, limit - currentUsage[type]),
      plan: 'free',
      upgradeRequired: !canUse
    });
  } catch (error) {
    console.error('Error en usage check:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
