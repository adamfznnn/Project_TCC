const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Booking = require("./booking");

const Pembayaran = sequelize.define("Pembayaran", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    jumlah_bayar: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    metode_pembayaran: {
        type: DataTypes.ENUM("TRANSFER", "CASH", "QRIS"),
        defaultValue: "TRANSFER",
    },
    bukti_transfer: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM("PENDING", "VERIFIED", "REJECTED"),
        defaultValue: "PENDING",
    },
    tanggal_bayar: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    freezeTableName: true,
    timestamps: true,
});

// Relasi: satu Booking bisa punya banyak Pembayaran (DP + Pelunasan)
Booking.hasMany(Pembayaran, { foreignKey: "bookingId", onDelete: "CASCADE" });
Pembayaran.belongsTo(Booking, { foreignKey: "bookingId" });

module.exports = Pembayaran;
