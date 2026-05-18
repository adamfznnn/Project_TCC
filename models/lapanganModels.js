const Lapangan = require("../schema/lapangan");

const findAll = async () => {
    return await Lapangan.findAll({
        attributes: ["id", "nama_lapangan", "jenis_rumput", "harga_per_jam"],
    });
};

const findById = async (id) => {
    return await Lapangan.findByPk(id, {
        attributes: ["id", "nama_lapangan", "jenis_rumput", "harga_per_jam"],
    });
};

module.exports = {
    findAll,
    findById,
};