const url = "http://localhost:8000/users/";
const order_url = "http://localhost:8000/orders/";
const store_url = "http://localhost:8000/stores";
const location_url = "http://localhost:8000/location";

$(document).ready(() => {
  const token = localStorage.getItem("token");
  const orderListBody = $("#order_list_body");
  const locationSelect = $("#location");
  const storeSelect = $("#store");
  const delOrderIDSelect = $("#del_orderID");
  const editOrderIDSelect = $("#editorderID");

  Promise.all([
    fetch(url),
    fetch(location_url),
    fetch(store_url),
    fetch(url + `me/`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }),
  ])
    .then((responses) => Promise.all(responses.map((res) => res.json())))
    .then(([allusers, locations, stores, userData]) => {
      localStorage.setItem("Location", JSON.stringify(locations));
      localStorage.setItem("Store", JSON.stringify(stores));
      localStorage.setItem("User", JSON.stringify(userData));

      // Populate locations select element
      let locationName = JSON.parse(localStorage.getItem("Location"));
      $.each(locationName, function (index, location) {
        locationSelect.append(
          '<option value="' +
            location.location_id +
            '">' +
            location.location_name +
            "</option>"
        );
      });

      // Handle location select change event
      locationSelect.on("change", function () {
        const selectedLocationId = $(this).val();

        // Populate stores select element based on selected location
        storeSelect.empty();
        let stores = JSON.parse(localStorage.getItem("Store"));
        $.each(stores, function (index, store) {
          if (store.location_id == selectedLocationId) {
            storeSelect.append(
              '<option value="' +
                store.store_id +
                '">' +
                store.store_name +
                "</option>"
            );
          }
        });
      });
      const mydata = JSON.parse(localStorage.getItem("User"));

      //FETCH ORDER LIST
      fetch(url + `${mydata.id}/orders`, {
        method: "GET",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Order not Found");
          }
          return response.json();
        })
        .then((orders) => {
          localStorage.setItem("MyOrder", JSON.stringify(orders));
          delOrderIDSelect.empty();
          editOrderIDSelect.empty();
          orders.forEach((order) => {
            delOrderIDSelect.append(
              '<option value="' +
                order.order_id +
                '">' +
                order.order_id +
                "</option>"
            );
            editOrderIDSelect.append(
              '<option value="' +
                order.order_id +
                '">' +
                order.order_id +
                "</option>"
            );
            const store = stores.find(
              (store) => store.store_id === order.store_id
            );
            const storeName = store ? store.store_name : "-";

            const location = locations.find(
              (location) => location.location_id === store.location_id
            );
            const locationName = location ? location.location_name : "-";

            const alluser = allusers.find(
              (alluser) => alluser.id === order.raider_id
            );
            const raider_name = alluser ? alluser.username : "-";
            const raider_contact = alluser ? alluser.contact : "-";

            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${order.order_id}</td>
              <td>${locationName}</td>
              <td>${storeName}</td>
              <td>${order.orderDetails}</td>
              <td>${raider_name ? raider_name : "-"}</td>
              <td><a href="${
                raider_contact ? raider_contact : "#"
              }">Contact</a></td>
            `;
            orderListBody.append(row);
          });
        })
        .catch((error) => {
          console.error("Order Not Found");
        });
    });
});

$("#create_order").submit(function (event) {
  event.preventDefault(); // prevent the form from submitting normally

  // get the selected values
  var storeValue = $("#store").val();
  var OrderDetails = $("#orderDetails").val();

  let user = JSON.parse(localStorage.getItem("User"));
  let user_id = user.id;
  // log the selected values to the console

  let data = {
    orderDetails: OrderDetails,
    store_id: storeValue,
    user_id: user_id,
    raider_id: null,
  };

  let request = new Request(order_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  fetch(request)
    .then((respons) => {
      if (!respons.ok) {
        throw new Error("BAD SERVER RESPONE");
      }
      return respons.json();
    })
    .then((data) => {
      console.log("Suscess", data);
      location.href = "";
    })
    .catch((error) => {
      console.error(error);
    });

  // submit the form
});

// Add an event listener to the "Delete" Order from table id = order_list by button in the "CancelOrderModal"
$("#CancelOrderModal").submit(function (e) {
  e.preventDefault();

  let OrderID = $("#del_orderID").val();

  fetch(order_url + `${parseInt(OrderID)}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete order.");
      }
      return response.json();
    })
    .then((data) => {
      //remove it from html table i will give html file later
      console.log(data);
      //then remove order from localStorge name ("MyOrder") use order_id to data.order_id for remove it localstroge
      // Remove the order from the HTML table
      $("#order_list_body tr").each(function () {
        if ($(this).find("td:first").text() == OrderID) {
          $(this).remove();
        }
      });

      // Remove the order from the local storage
      let myOrders = JSON.parse(localStorage.getItem("MyOrder")) || [];
      myOrders = myOrders.filter((order) => order.order_id !== OrderID);
      localStorage.setItem("MyOrder", JSON.stringify(myOrders));
      location.href = "";
    })
    .catch((error) => {
      console.error(error);
    });
});
// Add an event listener to the "Delete" Order from table id = order_list by button in the "CancelOrderModal"

$("#editOrderModal").submit((e) => {
  e.preventDefault();
  let order_id = $("#editorderID").val();
  let order_area = $("#order_details").val();

  let myOrders = JSON.parse(localStorage.getItem("MyOrder"));
  myOrders = myOrders.filter((order) => order.order_id === parseInt(order_id));
  const req_url = `http://localhost:8000/orders/${parseInt(order_id)}`;
  if (myOrders[0].raider_id === null) {
    myOrders[0].raider_id = 0;
  }

  let data = {
    order_id: parseInt(order_id),
    orderDetails: order_area,
    raider_id: myOrders[0].raider_id,
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
      return response.json();
    })
    .then((order) => {
      let myOrders = JSON.parse(localStorage.getItem("MyOrder")) || [];
      myOrders = myOrders.filter((order) => order.order_id !== order_id);
      localStorage.setItem("MyOrder", JSON.stringify(myOrders));
      location.href = "";
    })
    .catch((error) => {
      console.error("ERROR : ", error);
    });
});
//OPEN THE NEW TAB WHEN CLICK THE LINK
$("#orderListBody").on("click", "a", function (event) {
  event.preventDefault(); // prevent the default action of following the link
  const link = $(this).attr("href"); // get the link from the clicked <a> element
  window.open(link); // open the link in a new tab or window
});
