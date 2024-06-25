const sellProductUrl =
  "https://shopswift-19of.onrender.com/shopswift/sell/product";
const getSellProductsUrl =
  "https://shopswift-19of.onrender.com/shopswift/sell/getProducts/";
const sellEditProductUrl =
  "https://shopswift-19of.onrender.com/shopswift/sell/editProduct";
const sellDeleteProductUrl =
  "https://shopswift-19of.onrender.com/shopswift/sell/deleteProduct/";
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

document.addEventListener("DOMContentLoaded", async function () {
  let id;

  const productList = document.getElementById("product-list");
  const productDetails = document.getElementById("product-details");
  const editForm = document.getElementById("edit-form");
  const productNameInput = document.getElementById("productName");
  const pickupAddressInput = document.getElementById("pickupAddress");
  const productPriceInput = document.getElementById("productPrice");
  const productDescriptionTextarea =
    document.getElementById("productDescription");
  const ownerContactInput = document.getElementById("ownerContact");
  const saveChangesBtn = document.getElementById("saveChanges");
  const deleteProductBtn = document.getElementById("deleteProduct");
  const cancelBtn = document.getElementById("cancel");
  const addProductBtn = document.getElementById("addProduct");
  const uploadProductBtn = document.getElementById("uploadProduct");

  let products;

  let response = await fetch(
    getSellProductsUrl + localStorage.getItem("account_name"),
    {
      method: "GET",
      headers: headers,
    }
  );

  if (!response.ok) {
    alert("Server error!! Please try again");
  } else {
    products = await response.json();
  }

  function populateProductList() {
    productList.innerHTML = "";
    products.forEach((product) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
                <div>
                    <strong>${product.product_name}</strong><br>
                    <span>Posted Date: ${product.date_time}</span><br>
                    <span>Price: ${product.price}</span>
                </div>
            `;
      listItem.setAttribute("data-product-id", product.id);
      listItem.addEventListener("click", () => displayProductDetails(product));
      productList.appendChild(listItem);
    });
  }

  function displayProductDetails(product) {
    productDetails.innerHTML = "";
    if (product) {
      editForm.style.display = "block";
      productNameInput.value = product.product_name;
      pickupAddressInput.value = product.address;
      productPriceInput.value = product.price;
      productDescriptionTextarea.value = product.description;
      ownerContactInput.value = product.mobile;
      id = product.id;

      // Show Save Changes and Delete Product buttons
      saveChangesBtn.style.display = "inline-block";
      deleteProductBtn.style.display = "inline-block";
      uploadProductBtn.style.display = "none";
      addProductBtn.style.display = "none"; // Hide Add Product button
    } else {
      editForm.style.display = "block";
      productNameInput.value = "";
      pickupAddressInput.value = "";
      productPriceInput.value = "";
      productDescriptionTextarea.value = "";
      ownerContactInput.value = "";

      // Hide Save Changes and Delete Product buttons
      saveChangesBtn.style.display = "none";
      deleteProductBtn.style.display = "none";
      addProductBtn.style.display = "inline-block"; // Show Add Product button
      uploadProductBtn.style.display = "inline-block";
    }
  }

  saveChangesBtn.addEventListener("click", () => {
    saveChanges(id);
  });

  deleteProductBtn.addEventListener("click", () => {
    deleteProduct(id);
  });

  cancelBtn.addEventListener("click", () => {
    editForm.style.display = "none";
    productDetails.innerHTML = "<p>Select a product to view details.</p>";
    addProductBtn.style.display = "inline-block"; // Show Add Product button on cancel
    saveChangesBtn.style.display = "none"; // Hide Save Changes button on cancel
    deleteProductBtn.style.display = "none"; // Hide Delete Product button on cancel
  });

  addProductBtn.addEventListener("click", () => {
    editForm.style.display = "block"; // Show the edit form
    displayProductDetails(null); // Pass null to indicate adding a new product
  });

  uploadProductBtn.addEventListener("click", () => {
    addProduct();
  });

  async function saveChanges(id) {
    const newName = productNameInput.value.trim();
    const newAddress = pickupAddressInput.value.trim();
    const newPrice = productPriceInput.value.trim();
    const newDescription = productDescriptionTextarea.value.trim();
    const newOwnerContact = ownerContactInput.value.trim();

    if (
      newName === "" ||
      newAddress === "" ||
      newPrice === "" ||
      newDescription === "" ||
      newOwnerContact === ""
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (newOwnerContact.length != 10) {
      alert("Contact number should be 10 digits");
      return;
    }

    let body = JSON.stringify({
      product_name: newName,
      price: newPrice,
      address: newAddress,
      description: newDescription,
      mobile: newOwnerContact,
      user_name: localStorage.getItem("account_name"),
      id: id,
    });

    let response = await fetch(sellEditProductUrl, {
      method: "POST",
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      alert("Server error!! Please try again");
    } else {
      alert("Changes saved successfully!");
      window.location.reload();
    }
  }

  async function addProduct() {
    const newName = productNameInput.value.trim();
    const newAddress = pickupAddressInput.value.trim();
    const newPrice = productPriceInput.value.trim();
    const newDescription = productDescriptionTextarea.value.trim();
    const newOwnerContact = ownerContactInput.value.trim();

    if (
      newName === "" ||
      newAddress === "" ||
      newPrice === "" ||
      newDescription === "" ||
      newOwnerContact === ""
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (newOwnerContact.length != 10) {
      alert("Contact number should be 10 digits");
      return;
    }

    let body = JSON.stringify({
      product_name: newName,
      price: newPrice,
      address: newAddress,
      description: newDescription,
      mobile: newOwnerContact,
      user_name: localStorage.getItem("account_name"),
    });

    let response = await fetch(sellProductUrl, {
      method: "POST",
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      alert("Server error!! Please try again");
    } else {
      alert("Product added successfully!");
      window.location.reload();
    }
  }

  async function deleteProduct(id) {
    let response = await fetch(
      sellDeleteProductUrl + id + "/" + localStorage.getItem("account_name"),
      {
        method: "GET",
        headers: headers,
      }
    );

    if (!response.ok) {
      alert("Not able to delete the product right now!! Please try again");
    } else {
      alert("Product deleted successfully!");
      window.location.reload();
    }
  }

  populateProductList();
});
