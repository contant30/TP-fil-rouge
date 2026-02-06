const jwt = require('jsonwebtoken');  // ✅ LIGNE 1
const { Utilisateur } = require('../models');  // ✅ LIGNE 2

module.exports = (req, res, next) => {  // ❌ PAS async !
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] : null;
  
  console.log('🔑 Token brut:', token ? token.substring(0,50)+'...' : '❌ NULL');
  
  if (!token) {
    return res.status(401).json({ error: 'Token Bearer requis' });
  }
  
  const secret = process.env.JWT_SECRET || 'supersecret_tp_fil_rouge_2026';
  console.log('🔐 Secret:', secret.substring(0,10)+'...');
  
  // ✅ CALLBACK verify (PAS await)
  jwt.verify(token, secret, async (err, decoded) => {
    if (err) {
      console.error('❌ JWT Error:', err.name || err.message);
      return res.status(401).json({ error: 'Token invalide/expiré' });
    }
    
    console.log('🔍 Payload:', JSON.stringify(decoded, null, 2));
    
    // Flex PK
    const userId = decoded.id || decoded.id_utilisateur;
    console.log('🔍 ID utilisé:', userId);
    
    if (!userId) {
      return res.status(401).json({ error: 'Payload sans ID' });
    }
    
    // ✅ MAINTENANT decoded existe
    const user = await Utilisateur.findByPk(userId);
    console.log('🔍 DB User:', user ? `${user.id_utilisateur} ${user.nom_utilisateur}` : 'NULL');
    
    if (!user) {
      return res.status(401).json({ error: 'User DB non trouvé' });
    }
    
    console.log('👤 User OK:', user.nom_utilisateur);
    req.user = user;  // ✅ req.user = DB user
    next();
  });
};
