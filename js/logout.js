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
    localStorage.removeItem("Order");
    localStorage.removeItem("Store");
    localStorage.removeItem("Location");
    localStorage.removeItem("MyOrder");
  } else {
    alert(
      "คุณไม่สามารถเปลี่ยนไปเป็นผู้ส่งได้เนื่องจากคุณยังมีรายการสั่งอาหารอยู่"
    );
  }
});

$("#user_page").click(() => {
  let deliveryOrder = JSON.parse(localStorage.getItem("Order"));
  let myData = JSON.parse(localStorage.getItem("User"));

  let mydeliver = deliveryOrder.filter(
    (deliver) => deliver.raider_id === myData.id
  );

  if (mydeliver.length === 0) {
    localStorage.removeItem("Order");
    localStorage.removeItem("Store");
    localStorage.removeItem("Location");
    localStorage.removeItem("MyOrder");
    location.href = "/food-buy.html";
  } else {
    alert("คุณยังมีรายการรับฝากอยู่");
  }

  // location.href = "/food-buy.html";
});
