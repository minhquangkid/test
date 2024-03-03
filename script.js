"use strict";
//lấy ra các DOM Element mình cần sử dụng
const submitBtn = document.getElementById("submit-btn"); // các biến này ko sử dụng chung cho các file js được, phải khai báo lại từ đầu
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
// const bmiInput = document.getElementById("bmi-btn");
const healthy = document.getElementById("healthy-btn");

// tạo biến global
let petArr = []; // khởi tạo giá trị ban đầu cho mảng chứa dữ liệu là rỗng

if (getFromStorage("key") == null) {
  // kiểm tra xem trong bộ nhớ local ban đầu có chứa giá trị nào ko ? nếu ko có thì vẫn gán cho mảng petArr là rỗng
  petArr = [];
} else {
  // nếu trong bộ nhớ đã có sẵn dữ liệu
  petArr = JSON.parse(getFromStorage("key")); // chuyển dữ liệu từ dạng string về lại dạng object
  petArr.forEach((e) => (e.date = new Date(e.date))); // đổi dữ liệu ngày tháng đang từ dạng string về đúng định dạng Date
  renderTableData(petArr); // đưa dữ liệu vô bảng hiển thị
}

console.log(localStorage.getItem("key"));
console.log(petArr);
let healthyCheck = false; // biến kiểm tra có đang ở chế độ healthy check hay ko?
let healthyPetArr; // tạo mảng các thú cưng healthy
// tạo hàm lọc pet healthy
function healthyArr() {
  healthyPetArr = petArr.filter(
    (e) => e.vaccinated == true && e.dewormed == true && e.sterilized == true
  ); // e đóng vai trò như biến i trong vòng lặp for, duyệt từng phần tử trong petArr xem cái nào thỏa điều kiện thì gắn phần tử đó vô mảng healthyPetArr
}

// các hàm chèn dữ liệu vào bảng
function renderTableData(pets) {
  tableBodyEl.innerHTML = ""; // làm rỗng hết dữ liệu cũ

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

      <td>

          <button type="button" class="btn btn-danger btn-delete"

          id="btn-delete" data-id="${row.id}">Delete</button>

      </td>

  `;
}

// xử lý sự kiện khi nhấn nút submit
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

  // tạo hàm kiểm tra
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
    // kiểm tra id bị trùng hay ko ?
    for (let i = 0; i < petArr.length; i++) {
      if (data.id == petArr[i].id) {
        notification.message = "ID must unique!";
        notification.ok = false;
      }
    }

    return;
  }
  // chạy hàm kiểm tra
  validatedForm();
  if (notification.ok) {
    petArr.push(data); // đưa vào mảng thông tin tổng
    saveToStorage("key", JSON.stringify(petArr)); // lưu thông tin tổng vô bộ nhớ local ( có chuyển đổi chúng về dạng string trước rồi mới lưu được)

    renderTableData(petArr); // đưa dữ liệu vào bảng

    resetForm(); // xóa form điền để người dùng nhập dữ liệu mới vào
    //alert("good");
  } else {
    window.alert(notification.message);
  }

  //Sau khi thêm thú cưng thành công, xóa các dữ liệu mà người dùng vừa nhập ở trên Form
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
});

// event xóa thông tin khi nhấn nút delete
tableBodyEl.addEventListener("click", function (e) {
  console.log(e.target);
  if (e.target.id != "btn-delete") return;

  const petId = e.target.getAttribute("data-id");

  if (!petId) return;

  const isConfirm = confirm("Are you sure?");

  if (!isConfirm) return;

  console.log(`Delete pet with id = ${petId}`);

  //remove

  petArr.splice(
    petArr.findIndex((pet) => pet.id == petId),
    1
  );

  //reload
  saveToStorage("key", JSON.stringify(petArr));
  renderTableData(petArr);
});

// lọc các thú cưng khỏe mạnh

healthy.addEventListener("click", function () {
  if (healthyCheck == false) {
    healthyCheck = true;
    healthy.textContent = "Show All Pet"; // dùng healthy.value là sai
    // let healthyPetArr = petArr.filter(function (e) {
    //   return e.vaccinated == true && e.dewormed == true && e.sterilized == true;
    // });
    // let healthyPetArr = petArr.filter(
    //   (e) => e.vaccinated == true && e.dewormed == true && e.sterilized == true
    // );
    // gọi hàm tạo danh sách thú cưng healthy
    healthyArr();
    renderTableData(healthyPetArr);
  } else {
    healthyCheck = false;
    healthy.textContent = "Show Healthy Pet";
    renderTableData(petArr);
  }
});

// tính toán BMI
// bmiInput.addEventListener("click", function () {
//   const bmiDog = (weight, length) => {
//     return (weight * 703) / (length * length);
//   };
//   const bmiCat = (weight, length) => {
//     return (weight * 886) / (length * length);
//   };
//   //console.log(bmiDog(7, 3));

//   //tạo hàm tính toán cho từng trường hợp Dog hoặc Cat
//   function calBmi(arr) {
//     for (let i = 0; i < arr.length; i++) {
//       if (arr[i].type == "Dog") {
//         arr[i].bmi = Number(bmiDog(arr[i].weight, arr[i].length)).toFixed(2); // toFixed(2) để làm tròn 2 số thập phân
//         //console.log(arr[i].bmi);
//       } else {
//         arr[i].bmi = Number(bmiCat(arr[i].weight, arr[i].length)).toFixed(2);
//         //console.log(arr[i].bmi);
//       }
//     }
//   }
//   // gọi hàm
//   if (healthyCheck == false) {
//     calBmi(petArr);
//     renderTableData(petArr);
//   } else {
//     healthyArr();
//     calBmi(healthyPetArr);
//     renderTableData(healthyPetArr);
//   }
// });

/////////// toggle class .active
const act = document.querySelector("#sidebar");

act.addEventListener("click", function (e) {
  console.log(e.target);
  act.classList.toggle("active");
});

const listNav = document.querySelector(".listNav");

listNav.addEventListener("click", function (e) {
  console.log(e.target);
  event.stopPropagation();
});

// sự kiện thay đổi type
// const option = document.createElement("option");

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
    const option = document.createElement("option");

    option.innerHTML = e.input;

    breedInput.appendChild(option);
  });
};

typeInput.addEventListener("change", function () {
  renderBreed();
  // console.log(option.innerHTML); //  là nội dung bên trong của tag option
  // console.log(option); // là toàn bộ tag <option>nội dung</option>
  // console.log("change");
});
