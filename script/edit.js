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
//// khởi tạo lại giá trị ban đầu
const submitBtn = document.getElementById("submit-btn");
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

////// hiện bảng để edit
function renderTableData_edit(pets) {
  // tạo hàm khác so với script.js
  tableBodyEl.innerHTML = "";

  pets.forEach((pet) => {
    //
    const row = document.createElement("tr");

    row.innerHTML = genRow_edit(pet); // tạo hàm khác so với script.js vì có nút edit
    tableBodyEl.appendChild(row);
  });
}

function genRow_edit(row) {
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

      <td>

          <button type="button" class="btn btn-warning btn-edit"

          id="btn-edit" data-id="${row.id}">Edit</button>

      </td>

  `;
}

let petArr = [];
let position = 0; // tạo biến để xác định vị trí của pet được edit trong mảng
if (getFromStorage("key") == null) {
  // kiểm tra xem trong bộ nhớ local ban đầu có chứa giá trị nào ko ? nếu ko có thì vẫn gán cho mảng petArr là rỗng
  petArr = [];
} else {
  // nếu trong bộ nhớ đã có sẵn dữ liệu
  petArr = JSON.parse(getFromStorage("key")); // chuyển dữ liệu từ dạng string về lại dạng object
  petArr.forEach((e) => (e.date = new Date(e.date))); // đổi dữ liệu ngày tháng đang từ dạng string về đúng định dạng Date
  renderTableData_edit(petArr); // đưa dữ liệu vô bảng hiển thị
}

// event khi nhấn nút edit
tableBodyEl.addEventListener("click", function (e) {
  // console.log(e.target.id);
  if (e.target.id != "btn-edit") return;

  const petId = e.target.getAttribute("data-id");

  if (!petId) return;

  // petArr.splice(
  //   petArr.findIndex((pet) => pet.id == petId),
  //   1
  // )
  document.getElementById("container-form").classList.remove("hide"); // bỏ class hide để hiện bảng edit

  position = petArr.findIndex((pet) => pet.id == petId); // tìm vị trí của phần tử cần sửa đổi trong mảng và gán cho biến position
  // điền thông tin của pet cần edit vào các form
  idInput.value = petArr[position].id;
  nameInput.value = petArr[position].name;
  ageInput.value = petArr[position].age;
  typeInput.value = petArr[position].type;
  weightInput.value = petArr[position].weight;
  lengthInput.value = petArr[position].length;
  colorInput.value = petArr[position].color;

  renderBreed(); // vì trong file html chưa có sẵn nội dung cho select nên ta phải chạy hàm này để khởi tạo giá trị cho nó trước
  breedInput.value = petArr[position].breed;
  // sau khi có giá trị rồi ta mới gán nó vô đúng với giá trị của thú cưng đang chỉnh sửa

  vaccinatedInput.checked = petArr[position].vaccinated;
  dewormedInput.checked = petArr[position].dewormed;
  sterilizedInput.checked = petArr[position].sterilized;
});

const renderBreed = function () {
  const arr = JSON.parse(getFromStorage("breed"));
  // const option = document.createElement("option"); // nếu đặt ở ngoài thì chỉ có giá trị cuối cùng được đưa vào
  let loc = {};
  while (breedInput.hasChildNodes()) {
    breedInput.removeChild(breedInput.firstChild);
  } // xóa hết toàn bộ child cũ trước khi chèn child mới vào
  if (typeInput.value == "Dog") {
    loc = arr.filter((e) => e.type == "Dog");
  } else if (typeInput.value == "Cat") {
    loc = arr.filter((e) => e.type == "Cat");
  }
  loc.forEach(function (e) {
    const option = document.createElement("option"); // không hiểu vì sao đặt ở trong thì không bị lỗi
    option.innerHTML = e.input;

    breedInput.appendChild(option);
  });
};

// chạy event khi thay đổi type
typeInput.addEventListener("change", function () {
  renderBreed();
});

submitBtn.addEventListener("click", function () {
  //tạo object chứa dữ liệu 1 pet
  const data = {
    id: idInput.value,
    name: nameInput.value,
    age: parseInt(ageInput.value),
    type: typeInput.value,
    weight: parseInt(weightInput.value),
    length: parseInt(lengthInput.value),
    color: colorInput.value,
    breed: breedInput.value,
    vaccinated: vaccinatedInput.checked,
    dewormed: dewormedInput.checked,
    sterilized: sterilizedInput.checked,

    date: new Date(),
  };

  let notification = {
    ok: true,
  };

  function validatedForm() {
    if (isNaN(data.age) || data.age < 1 || data.age > 15) {
      notification.message = "Age must be between 1 and 15!";
      notification.ok = false;
      //console.log(data.age); // nó sẽ xuất ra khoảng trống, có định dạng là NaN, chỉ khi thêm phép toán isNaN(data.age) vào thì cửa sổ Console của brower mới hiện lên NaN được
    }
    if (isNaN(data.weight) || data.weight < 1 || data.weight > 15) {
      notification.message = "Weight must be between 1 and 15!";
      notification.ok = false;
    }
    if (isNaN(data.length) || data.length < 1 || data.length > 100) {
      notification.message = "Length must be between 1 and 100!";
      notification.ok = false;
    }
    if (data.type == "Select Type") {
      notification.message = "Please select Type!";
      notification.ok = false;
      //console.log(data.type);
    }
    if (data.breed == "Select Breed") {
      notification.message = "Please Select Breed!";
      notification.ok = false;
    }
    if (data.id === "") {
      notification.message = "Please input id!";
      notification.ok = false;
    }
    if (data.name === "") {
      notification.message = "Please input name!";
      notification.ok = false;
    }

    return;
  }

  validatedForm(); // chạy hàm kiểm tra
  if (notification.ok) {
    petArr[position] = data; // ghi đè lên nội dung pet đang chỉnh sửa
    saveToStorage("key", JSON.stringify(petArr)); // lưu thông tin tổng vô bộ nhớ local ( có chuyển đổi chúng về dạng string trước rồi mới lưu được)

    renderTableData_edit(petArr); // đưa dữ liệu vào bảng edit

    resetForm(); // xóa form điền để người dùng nhập dữ liệu mới vào
    //alert("good");
  } else {
    window.alert(notification.message);
  }

  function resetForm() {
    idInput.value = "";
    nameInput.value = "";
    ageInput.value = "";
    typeInput.value = "Select Type"; // để trống "" cũng được
    weightInput.value = "";
    lengthInput.value = "";
    colorInput.value = "#000000";
    // colorInput.value = ""; // chọn cái này cũng được
    breedInput.value = "Select Breed";
    vaccinatedInput.checked = false;
    // vaccinatedInput.checked = "";// chọn cái này cũng được
    dewormedInput.checked = false;
    sterilizedInput.checked = false;
  }

  document.getElementById("container-form").classList.add("hide");
});
