const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Lapangan = sequelize.define("Lapangan", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nama_lapangan: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    jenis_rumput: {
        type: DataTypes.STRING,
        allowNull: true, // Boleh kosong jika tidak ingin diisi
    },
    harga_per_jam: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    // Opsi ini sangat penting agar Sequelize tidak mengubah nama tabel
    // menjadi 'Lapangans' (plural) di database MariaDB GCP kamu.
    freezeTableName: true,
    timestamps: true // Menambahkan createdAt dan updatedAt otomatis
});

module.exports = Lapangan;