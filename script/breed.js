"use strict";
const act = document.querySelector("#sidebar");

act.addEventListener("click", function (e) {
  act.classList.toggle("active");
});

const listNav = document.querySelector(".listNav");

listNav.addEventListener("click", function (e) {
  console.log(e.target);
  event.stopPropagation();
});

//lấy ra các DOM Element mình cần sử dụng
const submitBtnBreed = document.getElementById("submit-btn");
const breedInput = document.getElementById("input-breed"); //

const typeInput = document.getElementById("input-type"); //

const tableBodyEl = document.getElementById("tbody");

// tạo biến global
let breedArr = []; // khởi tạo giá trị ban đầu cho mảng chứa dữ liệu là rỗng
let stt = 1;
if (getFromStorage("breed") == null) {
  // kiểm tra xem trong bộ nhớ local ban đầu có chứa giá trị nào ko ? nếu ko có thì vẫn gán cho mảng petArr là rỗng
  breedArr = [];
} else {
  // nếu trong bộ nhớ đã có sẵn dữ liệu
  breedArr = JSON.parse(getFromStorage("breed")); // chuyển dữ liệu từ dạng string về lại dạng object
  breedArr.forEach((e) => (e.date = new Date(e.date))); // đổi dữ liệu ngày tháng đang từ dạng string về đúng định dạng Date
  renderBreedTable(breedArr); // đưa dữ liệu vô bảng hiển thị
}

console.log(localStorage.getItem("breed"));
console.log(breedArr);

// các hàm chèn dữ liệu vào bảng , nó phải có tên khác với bên script.js
function renderBreedTable(pets) {
  tableBodyEl.innerHTML = "";
  stt = 1;
  pets.forEach((pet) => {
    //
    const row = document.createElement("tr");

    row.innerHTML = genRow(pet); // pet đóng vai trò như biến i trong vòng lặp for, duyệt từng phần tử trong pets
    tableBodyEl.appendChild(row);
  });
}

function genRow(row) {
  return `

      <th scope="row">${stt}</th>
  
      <td>${row.input}</td>

      <td>${row.type}</td>     

      <td>

          <button type="button" class="btn btn-danger btn-delete"

          id="btn-delete" data-id="${stt++}">Delete</button> 

      </td>

  `;
} // tạo nút delete , gán id cho nó là btn-delete, sau đó gán cho nó data-id = stt

// xử lý sự kiện khi nhấn nút submit
submitBtnBreed.addEventListener("click", function () {
  //tạo object chứa dữ liệu 1 pet
  const data = {
    input: breedInput.value,
    type: typeInput.value,
  };

  // tạo hàm kiểm tra
  let notification = {
    ok: true,
  };
  function validatedForm() {
    if (data.input === "") {
      notification.message = "Please input breed !";
      notification.ok = false;
      //console.log(data.age); // nó sẽ xuất ra khoảng trống, có định dạng là NaN, chỉ khi thêm phép toán isNaN(data.age) vào thì cửa sổ Console của brower mới hiện lên NaN được
    }

    if (data.type == "Select Type") {
      notification.message = "Please select Type!";
      notification.ok = false;
      //console.log(data.type);
    }

    // kiểm tra có bị trùng hay ko
    for (let i = 0; i < breedArr.length; i++) {
      if (data.input == breedArr[i].input && data.type == breedArr[i].type) {
        notification.message = "Your information has already existed !";
        notification.ok = false;
      }
    }

    return;
  }
  // chạy hàm kiểm tra
  validatedForm();
  if (notification.ok) {
    breedArr.push(data); // đưa vào mảng thông tin tổng
    saveToStorage("breed", JSON.stringify(breedArr)); // lưu thông tin tổng vô bộ nhớ local ( có chuyển đổi chúng về dạng string trước rồi mới lưu được)

    renderBreedTable(breedArr); // đưa dữ liệu vào bảng

    resetForm(); // xóa form điền để người dùng nhập dữ liệu mới vào
    //alert("good");
  } else {
    window.alert(notification.message);
  }

  //Sau khi thêm thú cưng thành công, xóa các dữ liệu mà người dùng vừa nhập ở trên Form
  function resetForm() {
    breedInput.value = "";
    typeInput.value = "Select Type";
  }
});

// event xóa thông tin khi nhấn nút delete
tableBodyEl.addEventListener("click", function (e) {
  console.log(e.target);
  console.log(e.target.id);
  if (e.target.id != "btn-delete") return; // nếu chỗ nhấn vô ko phải là nút có class là btn-delete thì thoát ra khỏi event

  const petId = e.target.getAttribute("data-id"); // lấy giá trị của data-id

  if (!petId) return; // nếu ko có giá trị thì thoát khỏi event

  const isConfirm = confirm("Are you sure?");

  if (!isConfirm) return;

  console.log(`Delete pet with id = ${petId}`);

  //remove

  breedArr.splice(petId - 1, 1); // xóa 1 phần tử trong mảng ngay tại vị trí petId - 1 ( do petId đang là stt bắt đầu từ 1 còn thứ tự trong mảng bắt đầu từ 0 nên phải trừ đi 1)

  //reload lưu lại vô bộ nhớ local
  saveToStorage("breed", JSON.stringify(breedArr));
  renderBreedTable(breedArr);
});

//
// const renderBreed = function () {
//   const arr = JSON.parse(getFromStorage("breed"));
//   const option = document.createElement("option");
//   arr.forEach(function (e) {
//     option.innerHTML = e.input;

//     breedInput.appendChild(option);
//   });
// };
