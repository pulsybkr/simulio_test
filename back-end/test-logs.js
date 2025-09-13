// Script de test rapide pour les logs HTTP
import { request } from 'http';

console.log('🧪 Test des logs HTTP - Simulio Backend\n');

// Test 1: Route de santé (publique)
console.log('📡 Test 1: Route /health (publique)');
const req1 = request({
  hostname: 'localhost',
  port: 3333,
  path: '/health',
  method: 'GET'
}, (res) => {
  console.log(`✅ Status: ${res.statusCode}`);
  res.on('data', (chunk) => {
    console.log(`📄 Response: ${chunk}`);
  });
});

req1.on('error', (err) => {
  console.error(`❌ Erreur: ${err.message}`);
});

req1.end();

// Attendre un peu puis faire le test d'authentification
setTimeout(() => {
  console.log('\n📡 Test 2: Route /auth/login (publique)');
  const postData = JSON.stringify({
    email: 'admin@simulio.com',
    password: 'Admin123!'
  });

  const req2 = request({
    hostname: 'localhost',
    port: 3333,
    path: '/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }, (res) => {
    console.log(`✅ Status: ${res.statusCode}`);
    res.on('data', (chunk) => {
      console.log(`📄 Response: ${chunk}`);
    });
  });

  req2.on('error', (err) => {
    console.error(`❌ Erreur: ${err.message}`);
  });

  req2.write(postData);
  req2.end();

  // Attendre puis faire le test d'une route protégée
  setTimeout(() => {
    console.log('\n📡 Test 3: Route /simulations (protégée - sans token)');
    const req3 = request({
      hostname: 'localhost',
      port: 3333,
      path: '/simulations',
      method: 'GET'
    }, (res) => {
      console.log(`✅ Status: ${res.statusCode}`);
      res.on('data', (chunk) => {
        console.log(`📄 Response: ${chunk}`);
      });
    });

    req3.on('error', (err) => {
      console.error(`❌ Erreur: ${err.message}`);
    });

    req3.end();

    console.log('\n🎯 Vérifiez les logs dans votre terminal AdonisJS !');
    console.log('💡 Les logs devraient afficher :');
    console.log('   - → HTTP Request pour chaque requête');
    console.log('   - ← HTTP Response pour chaque réponse');
    console.log('   - ✗ HTTP Error si erreur');

  }, 1000);

}, 500);
