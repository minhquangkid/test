"use strict";
// tạo hàm lưu thú cưng trong local
function saveToStorage(key, value) {
  localStorage.setItem(key, value);
}
// tạo hàm lấy giá trị lưu  trong local
function getFromStorage(key) {
  return localStorage.getItem(key); // phải có return
}

////////////

// localStorage.removeItem("key");
