const cartCountUrl = "http://localhost:9000/shopswift/getCartCount/";
const getCartUrl = "http://localhost:9000/shopswift/getCart/";
const profileUrl = "http://localhost:9000/shopswift/profile/";
const placeOrderUrl = "http://localhost:9000/shopswift/placeOrder/";

const username = "shopswift";
const password = "shopswift";

const headers = new Headers();
const authString = `${username}:${password}`;
const encodedAuthString = btoa(authString);
headers.append("Authorization", `Basic ${encodedAuthString}`);
headers.append("Content-Type", "application/json");

document.getElementById("search").style.visibility = "hidden";
document.getElementById("badge").style.backgroundColor = "white";
document.getElementById("badge").innerHTML = "";

document.addEventListener("DOMContentLoaded", async () => {
  let response2 = await fetch(
    profileUrl + localStorage.getItem("account_name"),
    {
      method: "GET",
      headers: headers,
    }
  );

  if (!response2.ok) {
    alert("Something went wrong!!");
  } else {
    let profileDetails = await response2.json();
    document.getElementById("name").value = profileDetails.name;
    document.getElementById("email").value = profileDetails.email;
    document.getElementById("mobile").value = profileDetails.phone;
    document.getElementById("address").value = profileDetails.address;
  }

  let items;

  let response = await fetch(
    getCartUrl + localStorage.getItem("account_name"),
    {
      method: "GET",
      headers: headers,
    }
  );

  if (!response.ok) {
    alert("Something went wrong!!");
  } else {
    items = await response.json();
  }

  const dateElement = document.getElementById("date");
  const receiptItemsElement = document.getElementById("receipt-items");
  const totalPriceElement = document.getElementById("total-price");

  const now = new Date();
  dateElement.textContent =
    now.toLocaleDateString() + "  " + now.toLocaleTimeString("en-GB");

  let totalPrice = 0;

  items.forEach((item) => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = item.product_name;
    row.appendChild(nameCell);

    const quantityCell = document.createElement("td");
    quantityCell.textContent = item.count;
    row.appendChild(quantityCell);

    const priceCell = document.createElement("td");
    priceCell.textContent = "$" + item.price.toFixed(2);
    row.appendChild(priceCell);

    receiptItemsElement.appendChild(row);

    totalPrice += item.count * item.price;
  });

  totalPriceElement.textContent = totalPrice.toFixed(2);
});

async function placeOrder() {
  event.preventDefault();

  if (!document.getElementById("orderForm").checkValidity()) {
    return;
  }

  const strippedValue = creditCardInput.value.replace(/\s/g, "");

  if (!strippedValue.match(/^[0-9]{16}$/)) {
    alert("Please enter a valid credit card number");
    return;
  }

  let response = await fetch(
    placeOrderUrl + localStorage.getItem("account_name"),
    {
      method: "GET",
      headers: headers,
    }
  );

  if (!response.ok) {
    alert("Couldn't place order. Try again!!");
  } else {
    window.location.replace("orderPlaced.html");
  }
}

async function placeOrderBackend() {}

document.getElementById("orderForm").addEventListener("submit", placeOrder);

const creditCardInput = document.getElementById("creditcard");
const cvv = document.getElementById("cvv");

cvv.addEventListener("input", function () {
  let value = this.value.replace(/\D/g, "");

  this.value = value;
});
creditCardInput.addEventListener("input", function () {
  let value = this.value.replace(/\D/g, "");

  value = value.replace(/(\d{4})/g, "$1 ").trim();

  this.value = value;
});
