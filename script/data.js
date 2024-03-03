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
//// khai báo hàm để export
function saveDynamicDataToFile() {
  var userInput = getFromStorage("key"); // lấy dữ liệu từ bộ nhớ, dữ liệu bộ nhớ đang là string

  var blob = new Blob([userInput], { type: "text/plain;charset=utf-8" });
  saveAs(blob, "dynamic.txt"); // lưu dưới dạng tên file là dynamic.txt
}

const exportBtn = document.getElementById("export-btn");
const importBtn = document.getElementById("import-btn");

/// chạy event khi nhấn export
exportBtn.addEventListener("click", function () {
  saveDynamicDataToFile();
});

// khai báo hàm để import
let tam;
function importFile() {
  var file = document.getElementById("input-file").files[0]; // lấy giá trị của ô input
  if (file) {
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (evt) {
      ///
      tam = evt.target.result; // lấy giá trị lưu về 1 biến tạm
      tam = JSON.parse(tam); // đang là 1 chuỗi gồm nhiều object
      tam.forEach((e) => (e.date = new Date(e.date))); // đổi date trong từ phần tử về đúng định dạng date
      console.log(tam);
      // lấy dữ liệu từ bộ nhớ local ra, sau đó chuyển nó về dạng object
      let arr = JSON.parse(getFromStorage("key"));

      if (arr) {
        // nếu ban đầu đã có sẵn trong localstore
        arr.forEach((e) => (e.date = new Date(e.date)));
        console.log(arr);
        for (let i = 0; i < tam.length; i++) {
          // nếu đã có sẵn dữ liệu rồi thì ta tiến hành cho chạy từng cái biến tạm
          for (let j = 0; j < arr.length; j++) {
            // mỗi phần tử của tam sẽ được xét với toàn bộ phần tử của bộ nhớ
            if (tam[i].id === arr[j].id) {
              arr[j] = tam[i]; // nếu nó trùng id thì ta cập nhật và thoát ra giá trị hiện tại để đến giá trị tiếp theo
              break;
            }
            if (j === arr.length - 1) {
              // nếu chạy đến cuối bộ nhớ mà thấy ko bị trùng thì ta sẽ thêm dữ liệu ngoài vào đuôi bộ nhớ
              arr.push(tam[i]);
            }
          }
        }
      } else {
        // nếu chưa có thì gán vô
        arr = tam;
      }
      console.log(arr);
      saveToStorage("key", JSON.stringify(arr)); // lưu dữ liệu mới vô lại local
      alert("Import successfully");
    };
    reader.onerror = function (evt) {
      // document.getElementById("fileContents").innerHTML = "error reading file";
      console.log("ko mở được file");
      alert("Error !");
    };
  }
}
// chạy event để import
importBtn.addEventListener("click", function () {
  importFile();
});
