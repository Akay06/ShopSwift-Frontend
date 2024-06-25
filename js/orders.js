const getOrdersUrl = "https://shopswift-19of.onrender.com/shopswift/getOrders/";

const username = "shopswift";
const password = "shopswift";

const headers = new Headers();
const authString = `${username}:${password}`;
const encodedAuthString = btoa(authString);
headers.append("Authorization", `Basic ${encodedAuthString}`);
headers.append("Content-Type", "application/json");

if (localStorage.getItem("isLoggedIn") === null)
  localStorage.setItem("isLoggedIn", false);
if (localStorage.getItem("account_name") === null)
  localStorage.setItem("account_name", "");

document.addEventListener("DOMContentLoaded", async () => {
  let orders;

  let response = await fetch(
    getOrdersUrl + localStorage.getItem("account_name"),
    {
      method: "GET",
      headers: headers,
    }
  );

  if (!response.ok) {
    alert("Something went wrong!!");
  } else {
    orders = await response.json();

    orders.forEach((order) => {
      renderPage(order);
    });
  }
});

function renderPage(order) {
  const receiptContainer = document.createElement("div");
  receiptContainer.classList.add("receipt");

  // Create the invoice element
  const invoiceElement = document.createElement("div");
  invoiceElement.id = "invoice";
  invoiceElement.textContent = "Order ID: #" + order.order_no;
  receiptContainer.appendChild(invoiceElement);

  // Create the date paragraph
  const dateParagraph = document.createElement("p");
  dateParagraph.id = "date";
  dateParagraph.textContent = order.ordered_at.replace("T", " ");
  receiptContainer.appendChild(dateParagraph);

  // Create the table
  const tableElement = document.createElement("table");
  const tableHead = document.createElement("thead");
  const tableHeadRow = document.createElement("tr");
  const itemHeader = document.createElement("th");
  itemHeader.textContent = "Product";
  const quantityHeader = document.createElement("th");
  quantityHeader.textContent = "Quantity";
  const priceHeader = document.createElement("th");
  priceHeader.textContent = "Price";
  tableHeadRow.appendChild(itemHeader);
  tableHeadRow.appendChild(quantityHeader);
  tableHeadRow.appendChild(priceHeader);
  tableHead.appendChild(tableHeadRow);
  tableElement.appendChild(tableHead);

  // Create the table body for receipt items
  const tableBody = document.createElement("tbody");
  tableBody.id = "receipt-items-" + order.order_no;
  tableElement.appendChild(tableBody);
  receiptContainer.appendChild(tableElement);

  // Create the total div
  const totalDiv = document.createElement("div");
  totalDiv.classList.add("total");
  const totalParagraph = document.createElement("p");
  totalParagraph.textContent = "Paid: $";
  const totalPriceSpan = document.createElement("span");
  totalPriceSpan.id = "total-price";
  totalPriceSpan.textContent = order.total;
  totalParagraph.appendChild(totalPriceSpan);
  totalDiv.appendChild(totalParagraph);
  receiptContainer.appendChild(totalDiv);

  // Append the receipt container to the document body
  document.getElementById("orderContainer").appendChild(receiptContainer);

  const receiptItemsElement = document.getElementById(
    "receipt-items-" + order.order_no
  );

  order.order_products.forEach((item) => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = item.product_name;
    row.appendChild(nameCell);

    const quantityCell = document.createElement("td");
    quantityCell.textContent = item.product_qty;
    row.appendChild(quantityCell);

    const priceCell = document.createElement("td");
    priceCell.textContent = "$" + item.product_price.toFixed(2);
    row.appendChild(priceCell);

    receiptItemsElement.appendChild(row);
  });
}
