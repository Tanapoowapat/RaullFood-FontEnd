$("#loginform").submit((event) => {
  event.preventDefault();

  var order = localStorage.getItem("MyOrder");
  if (order) {
    localStorage.removeItem("MyOrder");
  }

  var username = $("#username").val();
  var password = $("#password").val();
  var role = $("#role").val();

  let formdata = new FormData();
  formdata.append("username", username);
  formdata.append("password", password);

  const url = "http://localhost:8000/token";
  let request = new Request(url, {
    method: "POST",
    body: new URLSearchParams({
      username: username,
      password: password,
      grant_type: "password",
    }),
    headers: {
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  });

  fetch(request)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Invalid credentials");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Access Token:", data.access_token);
      localStorage.setItem("token", data.access_token);
      if (parseInt(role) === 2) {
        location.href = "raider.html";
      } else if (parseInt(role) === 1) {
        location.href = "food-buy.html";
      }
    })
    .catch((error) => {
      console.error("Login Error : ", error);
      alert("Invalid credentials");
    });
});
