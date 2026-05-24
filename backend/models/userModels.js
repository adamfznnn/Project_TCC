// Pastikan path ini sesuai dengan tempat kamu mendefinisikan skema Sequelize
const User = require("../schema/User");

const findAll = async () => {
  return await User.findAll({
    // Tambahkan atribut sesuai tema: nomor_hp dan role
    attributes: ["id", "username", "email", "nomor_hp", "role"],
  });
};

const create = async (userData) => {
  // userData akan berisi { username, email, nomor_hp, role } dari controller
  return await User.create(userData);
};

const findById = async (id) => {
  return await User.findByPk(id, {
    attributes: ["id", "username", "email", "nomor_hp", "role"],
  });
};

const findOne = async (condition) => {
  return await User.findOne(condition); // ikut ambil password untuk verifikasi
};

const updateById = async (id, userData) => {
  // Update data user (misal penyewa ingin ganti nomor HP)
  await User.update(userData, {
    where: {
      id: id,
    },
  });
  // Kembalikan data terbaru setelah update
  return await User.findByPk(id);
};

const deleteById = async (id) => {
  return await User.destroy({
    where: {
      id: id,
    },
  });
};

module.exports = {
  findAll,
  create,
  findById,
  findOne,
  updateById,
  deleteById,
};