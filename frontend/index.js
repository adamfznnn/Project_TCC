let port = 3000;

const getApiBase = () => `http://localhost:${port}/api/v1/users`;

document.addEventListener("DOMContentLoaded", () => {
  const inputPort = prompt(
    'Masukkan port Back-End\nPort default: 3000'
  );

  if (inputPort && inputPort.trim() !== "") {
    port = inputPort.trim();
  }

  getUser();
});

const formulir = document.querySelector("#user-form");

formulir.addEventListener("submit", async (e) => {
  e.preventDefault();

  const elemenName = document.querySelector("#name");
  const elemenEmail = document.querySelector("#email");

  const username = elemenName.value.trim();
  const email = elemenEmail.value.trim();
  const id = elemenName.dataset.id || "";

  if (!username || !email) return;

  try {
    if (id === "") {
      await axios.post(getApiBase(), { username, email });
    } else {
      await axios.put(`${getApiBase()}/${id}`, { username, email });
    }

    elemenName.dataset.id = "";
    elemenName.value = "";
    elemenEmail.value = "";

    getUser();
  } catch (error) {
    console.log(error.response?.data || error.message);
  }
});

async function getUser() {
  try {
    const response = await axios.get(getApiBase());
    const users = response.data?.data || [];

    const table = document.querySelector("#table-user");
    let tampilan = "";
    let no = 1;

    for (const user of users) {
      tampilan += tampilkanUser(no, user);
      no++;
    }

    table.innerHTML = tampilan;
    hapusUser();
    editUser();
  } catch (error) {
    console.log(error.response?.data || error.message);
  }
}

function tampilkanUser(no, user) {
  return `
    <tr>
      <td>${no}</td>
      <td class="name">${user.username ?? "-"}</td>
      <td class="email">${user.email ?? "-"}</td>
      <td><button data-id="${user.id}" class="btn-edit" type="button">Edit</button></td>
      <td><button data-id="${user.id}" class="btn-hapus" type="button">Hapus</button></td>
    </tr>
  `;
}

function hapusUser() {
  const tombolHapus = document.querySelectorAll(".btn-hapus");

  tombolHapus.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      try {
        await axios.delete(`${getApiBase()}/${id}`);
        getUser();
      } catch (error) {
        console.log(error.response?.data || error.message);
      }
    });
  });
}

function editUser() {
  const tombolEdit = document.querySelectorAll(".btn-edit");

  tombolEdit.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const row = btn.closest("tr");
      const name = row.querySelector(".name").innerText;
      const email = row.querySelector(".email").innerText;

      const elemenName = document.querySelector("#name");
      const elemenEmail = document.querySelector("#email");

      elemenName.dataset.id = id;
      elemenName.value = name;
      elemenEmail.value = email;
    });
  });
}