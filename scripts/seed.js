// Script para cargar el inventario inicial en Firestore.
// Uso (una sola vez, desde tu computadora, no en Netlify):
//   1. npm install
//   2. Descarga una clave de servicio de Firebase (Project settings > Service accounts > Generate new private key)
//      y guárdala como serviceAccountKey.json en esta misma carpeta (NO la subas a git).
//   3. node scripts/seed.js

import admin from 'firebase-admin'
import { readFileSync } from 'fs'
import { seedProducts } from '../src/data/seedProducts.js'

const serviceAccount = JSON.parse(readFileSync(new URL('../serviceAccountKey.json', import.meta.url)))

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
const db = admin.firestore()

async function run() {
  const batch = db.batch()
  seedProducts.forEach((p) => {
    const ref = db.collection('products').doc()
    batch.set(ref, { ...p, active: true })
  })
  await batch.commit()
  console.log(`Se cargaron ${seedProducts.length} productos en Firestore.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
