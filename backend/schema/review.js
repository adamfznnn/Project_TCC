const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Booking = require("./booking");
const User = require("./User");
const Lapangan = require("./lapangan");

const Review = sequelize.define("Review", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    rating: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        },
    },
    komentar: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    freezeTableName: true,
    timestamps: true,
});

// Relasi: satu Booking hanya bisa punya satu Review (unique)
Booking.hasOne(Review, { foreignKey: "bookingId", onDelete: "CASCADE" });
Review.belongsTo(Booking, { foreignKey: "bookingId" });

User.hasMany(Review, { foreignKey: "userId", onDelete: "CASCADE" });
Review.belongsTo(User, { foreignKey: "userId" });

Lapangan.hasMany(Review, { foreignKey: "lapanganId", onDelete: "CASCADE" });
Review.belongsTo(Lapangan, { foreignKey: "lapanganId" });

module.exports = Review;
