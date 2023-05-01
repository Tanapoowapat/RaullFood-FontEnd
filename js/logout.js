$("#logout").click(() => {
  localStorage.removeItem("Order");
  localStorage.removeItem("token");
  localStorage.removeItem("Store");
  localStorage.removeItem("Location");
  localStorage.removeItem("User");
  localStorage.removeItem("MyOrder");
  location.href = "/index.html";
});

$("#raider_page").click(() => {
  let myOrders = JSON.parse(localStorage.getItem("MyOrder"));
  if (!myOrders || myOrders.length == 0) {
    location.href = "/raider.html";
  } else {
    alert(
      "คุณไม่สามารถเปลี่ยนไปเป็นผู้ส่งได้เนื่องจากคุณยังมีรายการสั่งอาหารอยู่"
    );
  }
});

$("#user_page").click(() => {
  location.href = "/food-buy.html";
});
