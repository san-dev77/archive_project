const mysql = require('mysql2/promise');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBIgOA24Gi63uQaoSDQMhKwnajkuD5Pygc",
    authDomain: "app-archive-a8164.firebaseapp.com",
    projectId: "app-archive-a8164",
    storageBucket: "app-archive-a8164.firebasestorage.app",
    messagingSenderId: "414510958687",
    appId: "1:414510958687:web:8d62dd92cf5673ac81f3ea",
    measurementId: "G-4KVKXQ6L0K"
};

// Initialiser Firebase avec la configuration
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Créer une fonction asynchrone pour gérer la connexion MySQL et l'envoi vers Firebase
async function syncToFirestore() {
    try {
        // Connexion à MySQL
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'archive'
        });

        // Fonction pour surveiller les logs
        const [rows] = await connection.execute('SELECT * FROM audit_log WHERE processed = 0 LIMIT 10');

        for (const row of rows) {
            try {
                // Insérer les données dans Firestore
                await addDoc(collection(db, 'audit_logs'), {
                    table_name: row.table_name,
                    operation_type: row.operation_type,
                    data: row.data ? JSON.parse(row.data) : null, // Si les données sont au format JSON
                    timestamp: serverTimestamp()
                });

                // Marquer comme traité dans la base de données
                await connection.execute('UPDATE audit_log SET processed = 1 WHERE id = ?', [row.id]);

            } catch (error) {
                console.error('Erreur lors de l\'envoi à Firestore :', error);
            }
        }

        // Fermer la connexion
        await connection.end();
    } catch (error) {
        console.error('Erreur de connexion MySQL:', error);
    }
}

// Lancer la fonction toutes les x secondes (par exemple, toutes les 10 secondes)
setInterval(syncToFirestore, 10000);
