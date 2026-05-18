const redis = require("redis");
require("dotenv").config();

// Debug: Cek apakah variable env terbaca
console.log("🔍 Mencoba menyambung Redis ke:", process.env.REDIS_HOST);

const client = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    socket: {
        connectTimeout: 10000, // Tambahkan ini agar tidak cepat menyerah (10 detik)
        reconnectStrategy: (retries) => {
            if (retries > 10) return new Error("Gagal total nyambung ke Redis");
            return Math.min(retries * 100, 3000);
        }
    }
});

client.on("error", (err) => console.log("❌ Redis Error:", err.message));
client.on("connect", () => console.log("✅ Terkoneksi ke Redis di IP:", process.env.REDIS_HOST));

(async () => {
    try {
        await client.connect();
    } catch (err) {
        console.error("🚀 Gagal inisialisasi koneksi Redis:", err.message);
    }
})();

module.exports = client;