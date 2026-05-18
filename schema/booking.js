const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Lapangan = require("./lapangan");

const Booking = sequelize.define("Booking", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tanggal: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    jam_mulai: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    jam_selesai: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    total_harga: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status_pembayaran: {
        type: DataTypes.ENUM('PENDING', 'PAID_DP', 'LUNAS', 'CANCELLED'),
        defaultValue: 'PENDING',
    },
    bukti_transfer: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    freezeTableName: true,
    timestamps: true
});

/**
 * DEFINISI RELASI (ASSOCIATIONS)
 * Ini akan otomatis membuat kolom userId dan lapanganId di tabel Booking (GCP)
 */

// Relasi User -> Booking
User.hasMany(Booking, { foreignKey: 'userId', onDelete: 'CASCADE' });
Booking.belongsTo(User, { foreignKey: 'userId' });

// Relasi Lapangan -> Booking
Lapangan.hasMany(Booking, { foreignKey: 'lapanganId', onDelete: 'CASCADE' });
Booking.belongsTo(Lapangan, { foreignKey: 'lapanganId' });

module.exports = Booking;