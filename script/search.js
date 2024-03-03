"use strict";

const act = document.querySelector("#sidebar");

act.addEventListener("click", function (e) {
  //   console.log(e.target);
  act.classList.toggle("active");
});
const listNav = document.querySelector(".listNav");

listNav.addEventListener("click", function (e) {
  console.log(e.target);
  event.stopPropagation();
});
/////
const submitBtn = document.getElementById("submit-btn"); // các biến này ko sử dụng chung cho các file js được, phải khai báo lại từ đầu
const btnFind = document.getElementById("find-btn");
const idInput = document.getElementById("input-id");
const nameInput = document.getElementById("input-name");
const ageInput = document.getElementById("input-age");
const typeInput = document.getElementById("input-type");
const weightInput = document.getElementById("input-weight");
const lengthInput = document.getElementById("input-length");
const colorInput = document.getElementById("input-color-1");
const breedInput = document.getElementById("input-breed");
const vaccinatedInput = document.getElementById("input-vaccinated");
const dewormedInput = document.getElementById("input-dewormed");
const sterilizedInput = document.getElementById("input-sterilized");
const tableBodyEl = document.getElementById("tbody");

//// chèn tất cả các breed vào trong form select
const arrBreed = JSON.parse(getFromStorage("breed"));
arrBreed.forEach(function (e) {
  const option = document.createElement("option"); // không hiểu vì sao đặt ở trong thì không bị lỗi
  option.innerHTML = e.input;
  breedInput.appendChild(option);
});

let petArr = JSON.parse(getFromStorage("key")); // chuyển dữ liệu từ dạng string về lại dạng object
petArr.forEach((e) => (e.date = new Date(e.date))); // đổi dữ liệu ngày tháng đang từ dạng string về đúng định dạng Date

// các hàm chèn dữ liệu vào bảng
function renderTableData(pets) {
  tableBodyEl.innerHTML = "";

  pets.forEach((pet) => {
    //
    const row = document.createElement("tr");

    row.innerHTML = genRow(pet); // pet đóng vai trò như biến i trong vòng lặp for, duyệt từng phần tử trong pets
    tableBodyEl.appendChild(row);
  });
}

function genRow(row) {
  return `

      <th scope="row">${row.id}</th>

      <td>${row.name}</td>

      <td>${row.age}</td>

      <td>${row.type}</td>

      <td>${row.weight} kg</td>

      <td>${row.length} cm</td>

      <td>${row.breed}</td>

      <td>

          <i class="bi bi-square-fill" style="color: ${row.color}"></i>

      </td>

      <td><i class="bi ${
        row.vaccinated ? "bi-check-circle-fill" : "bi bi-x-circle-fill"
      } "></i></td>

      <td><i class="bi ${
        row.dewormed ? "bi-check-circle-fill" : "bi bi-x-circle-fill"
      } "></i></td>

      <td><i class="bi ${
        row.sterilized ? "bi-check-circle-fill" : "bi bi-x-circle-fill"
      } "></i></td>

     

      <td>${row.date.getDay()} / ${row.date.getMonth()} / ${row.date.getFullYear()}</td>
  `;
}

btnFind.addEventListener("click", function () {
  let mot = petArr.filter(
    (e) => e.id.includes(idInput.value) && e.name.includes(nameInput.value)
  );
  if (typeInput.value != "Select Type") {
    mot = mot.filter((e) => e.type.includes(typeInput.value));
  }

  if (breedInput.value != "Select Breed") {
    mot = mot.filter((e) => e.breed.includes(breedInput.value));
  }

  if (vaccinatedInput.checked) {
    mot = mot.filter((e) => e.vaccinated == vaccinatedInput.checked);
  }
  if (dewormedInput.checked) {
    mot = mot.filter((e) => e.dewormed == dewormedInput.checked);
  }
  if (sterilizedInput.checked) {
    mot = mot.filter((e) => e.sterilized == sterilizedInput.checked);
  }

  renderTableData(mot);
});
