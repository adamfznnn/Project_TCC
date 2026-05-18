const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    },
  },
  // Tambahan kolom untuk koordinasi booking
  nomor_hp: {
    type: DataTypes.STRING,
    allowNull: true, // Bisa diset false jika wajib
  },
  // Tambahan kolom untuk membedakan hak akses (Web Pengelola vs Mobile Penyewa)
  role: {
    type: DataTypes.ENUM("admin", "penyewa"),
    defaultValue: "penyewa",
  },
}, {
  // Opsi tambahan
  freezeTableName: true, // Memastikan nama tabel di MariaDB tetap 'User'
  timestamps: true,      // Menambahkan createdAt dan updatedAt otomatis
});

module.exports = User;