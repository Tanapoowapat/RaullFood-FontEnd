const order_url = "http://localhost:8000/orders/";
const user_url = "http://localhost:8000/users/";
const store_url = "http://localhost:8000/stores";
const location_url = "http://localhost:8000/location";

$(document).ready(() => {
  const token = localStorage.getItem("token");
  const orderListBody = $("#order_list_body");
  const orderSelect = $("#orderID");

  Promise.all([
    fetch(user_url),
    fetch(location_url),
    fetch(store_url),
    fetch(order_url),
    fetch(user_url + `me/`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }),
  ])
    .then((response) => Promise.all(response.map((res) => res.json())))
    .then(([allusers, location, store, order, userData]) => {
      localStorage.setItem("Location", JSON.stringify(location));
      localStorage.setItem("Store", JSON.stringify(store));
      localStorage.setItem("Order", JSON.stringify(order));
      localStorage.setItem("User", JSON.stringify(userData));
      orderSelect.empty();
      order.forEach((orderItem) => {
        orderSelect.append(
          '<option value="' +
            orderItem.order_id +
            '">' +
            orderItem.order_id +
            "</option>"
        );

        const storeItem = store.find(
          (store) => store.store_id == orderItem.store_id
        );

        const alluser = allusers.find(
          (all_users) => all_users.id === orderItem.user_id
        );

        const raider = allusers.find(
          (raider) => raider.id === orderItem.raider_id
        );

        const locationItem = location.find(
          (location) => location.location_id === storeItem.location_id
        );

        const locationName = locationItem ? locationItem.location_name : "-";
        const storeName = storeItem ? storeItem.store_name : "-";
        const Orderby = alluser ? alluser.username : "-";
        const raidername = raider ? raider.username : "-";

        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${orderItem.order_id}</td>
        <td>${locationName}</td>
        <td>${storeName}</td>
        <td>${orderItem.orderDetails}</td>
        <td>${Orderby}</td>
        <td>${raidername}</td>
        <td><a href="#">Contact</a></td>
        `;
        orderListBody.append(row);
      });
    })
    .catch((error) => {
      console.error("Error :", error);
    });
});

$("#AcceptOrderModel").submit((e) => {
  e.preventDefault();
  let order_id = $("#orderID").val();
  let user = JSON.parse(localStorage.getItem("User"));
  let thisorder = JSON.parse(localStorage.getItem("Order"));
  const req_url = `http://localhost:8000/orders/${parseInt(order_id)}`;
  thisorder = thisorder.filter(
    (order) => order.order_id === parseInt(order_id)
  );

  console.log(thisorder[0].orderDetails);

  if (thisorder[0].raider_id === null) {
    thisorder[0].raider_id = user.id;

    let data = {
      order_id: parseInt(order_id),
      orderDetails: thisorder[0].orderDetails,
      raider_id: parseInt(user.id),
    };

    fetch(req_url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("BAD SERVER RESPONSE");
        }
        return response;
      })
      .then((order) => {
        let orders = JSON.parse(localStorage.getItem("Order")) || [];
        orders = orders.filter((order) => order.order_id !== order_id);
        localStorage.setItem("Order", JSON.stringify(orders));
        location.href = "";
      });
  } else {
    alert("รายการนี้มีคนรับฝากแล้ว");
  }
});
