console.clear();

const cartCountUrl =
  "https://shopswift-19of.onrender.com/shopswift/getCartCount/";
const getCartUrl = "https://shopswift-19of.onrender.com/shopswift/getCart/";
const removeFromCartUrl =
  "https://shopswift-19of.onrender.com/shopswift/removeFromCart/";
const decreaseFromCartUrl =
  "https://shopswift-19of.onrender.com/shopswift/decreaseFromCart/";
const addToCartUrl = "https://shopswift-19of.onrender.com/shopswift/addToCart";
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

document.getElementById("search").style.visibility = "hidden";

let cartContainer = document.getElementById("cartContainer");

let boxContainerDiv = document.createElement("div");
boxContainerDiv.id = "boxContainer";

// DYNAMIC CODE TO SHOW THE SELECTED ITEMS IN YOUR CART
async function dynamicCartSection(ob, itemCounter) {
  let boxDiv = document.createElement("div");
  boxDiv.id = "box";
  boxContainerDiv.appendChild(boxDiv);

  let boxDivLeft = document.createElement("div");
  boxDivLeft.id = "box-left";
  boxDiv.appendChild(boxDivLeft);

  let boxImg = document.createElement("img");
  boxImg.src = ob.preview_url;
  boxDivLeft.appendChild(boxImg);

  let boxh3 = document.createElement("h3");
  let h3Text = document.createTextNode(ob.product_name);
  // let h3Text = document.createTextNode(ob.name)
  boxh3.appendChild(h3Text);
  boxDivLeft.appendChild(boxh3);

  let boxh4 = document.createElement("h4");
  let h4Text = document.createTextNode("Amount: $" + ob.price);
  boxh4.appendChild(h4Text);
  boxDivLeft.appendChild(boxh4);

  let boxDivRight = document.createElement("div");
  boxDivRight.id = "box-right";
  boxDiv.appendChild(boxDivRight);

  let quantitySelectorDiv = document.createElement("div");
  quantitySelectorDiv.className = "input-group quantity-selector";

  let inputQuantitySelector = document.createElement("input");
  inputQuantitySelector.type = "number";
  inputQuantitySelector.id = "inputQuantitySelector" + ob.product_id;
  inputQuantitySelector.className = "form-control";
  inputQuantitySelector.setAttribute("aria-live", "polite");
  inputQuantitySelector.setAttribute("data-bs-step", "counter");
  inputQuantitySelector.name = "quantity";
  inputQuantitySelector.title = "quantity";
  inputQuantitySelector.value = itemCounter;
  inputQuantitySelector.min = "1";
  inputQuantitySelector.max = ob.stock_count;
  inputQuantitySelector.step = "1";
  inputQuantitySelector.setAttribute("data-bs-round", "0");
  inputQuantitySelector.setAttribute("aria-label", "Quantity selector");
  inputQuantitySelector.readOnly = true;

  inputQuantitySelector.addEventListener("keydown", (event) => {
    event.preventDefault();
  });

  let stepDownButton = document.createElement("button");
  stepDownButton.type = "button";
  stepDownButton.className = "btn btn-icon btn-secondary";
  stepDownButton.setAttribute("aria-describedby", "inputQuantitySelector");
  stepDownButton.setAttribute("data-bs-step", "down");
  stepDownButton.innerHTML = '<span class="visually-hidden">Step down</span>';

  let stepUpButton = document.createElement("button");
  stepUpButton.type = "button";
  stepUpButton.className = "btn btn-icon btn-secondary";
  stepUpButton.setAttribute("aria-describedby", "inputQuantitySelector");
  stepUpButton.setAttribute("data-bs-step", "up");
  stepUpButton.innerHTML = '<span class="visually-hidden">Step up</span>';

  quantitySelectorDiv.appendChild(inputQuantitySelector);
  quantitySelectorDiv.appendChild(stepDownButton);
  quantitySelectorDiv.appendChild(stepUpButton);

  boxDivRight.appendChild(quantitySelectorDiv);

  inputQuantitySelector.addEventListener("change", function () {
    let currentValue = parseInt(
      document.getElementById("inputQuantitySelector" + ob.product_id).value,
      10
    );

    let temp = obj[ob.product_id];

    if (currentValue > temp) {
      document.getElementById("totalItem").innerHTML =
        "Total Items: " +
        (parseInt(
          document.getElementById("totalItem").innerHTML.substring(13),
          10
        ) +
          1);
      totalAmount += (currentValue - temp) * ob.price;
      document.getElementById("tot").textContent =
        "Amount: $ " + totalAmount.toFixed(2);
      obj[ob.product_id] = currentValue;
      let body = JSON.stringify({
        product_id: ob.product_id,
        count: currentValue - temp,
        user_name: localStorage.getItem("account_name"),
      });

      fetch(addToCartUrl, {
        method: "POST",
        headers: headers,
        body: body,
      });
    } else if (currentValue < temp) {
      document.getElementById("totalItem").innerHTML =
        "Total Items: " +
        (parseInt(
          document.getElementById("totalItem").innerHTML.substring(13),
          10
        ) -
          1);
      totalAmount -= (temp - currentValue) * ob.price;
      document.getElementById("tot").textContent =
        "Amount: $ " + totalAmount.toFixed(2);
      obj[ob.product_id] = currentValue;

      fetch(
        decreaseFromCartUrl +
          ob.product_id +
          "/" +
          localStorage.getItem("account_name"),
        {
          method: "GET",
          headers: headers,
        }
      );
    }
  });

  let wrapperDiv = document.createElement("div");
  wrapperDiv.className = "wrapper";

  // Create anchor element
  let anchorElement = document.createElement("a");
  anchorElement.href = "#";
  anchorElement.className = "close-button";

  // Create inner div
  let innerDiv = document.createElement("div");
  innerDiv.className = "in";

  // Create and append two close-button-block divs to inner div
  for (let i = 0; i < 2; i++) {
    let closeButtonBlock = document.createElement("div");
    closeButtonBlock.className = "close-button-block";
    innerDiv.appendChild(closeButtonBlock);
  }

  // Create outer div
  let outerDiv = document.createElement("div");
  outerDiv.className = "out";

  // Create and append two close-button-block divs to outer div
  for (let i = 0; i < 2; i++) {
    let closeButtonBlock = document.createElement("div");
    closeButtonBlock.className = "close-button-block";
    outerDiv.appendChild(closeButtonBlock);
  }

  // Append inner and outer divs to anchor element
  anchorElement.appendChild(innerDiv);
  anchorElement.appendChild(outerDiv);

  anchorElement.addEventListener("click", function () {
    document.querySelector(".bg-modal-cart").style.display = "flex";

    document.querySelector(".close").addEventListener("click", function () {
      document.querySelector(".bg-modal-cart").style.display = "none";
    });

    $(".button-remove").click(function () {
      $(this).addClass("success");
      setTimeout(removeSuccess, 1000);
      fetch(
        removeFromCartUrl +
          ob.product_id +
          "/" +
          localStorage.getItem("account_name"),
        {
          method: "GET",
          headers: headers,
        }
      );
    });
  });

  // Append anchor element to wrapper div
  wrapperDiv.appendChild(anchorElement);

  boxDiv.appendChild(wrapperDiv);

  // console.log(boxContainerDiv);

  buttonLink.appendChild(buttonText);
  cartContainer.appendChild(boxContainerDiv);
  cartContainer.appendChild(totalContainerDiv);
  // let cartMain = document.createElement('div')
  // cartmain.id = 'cartMainContainer'
  // cartMain.appendChild(totalContainerDiv)

  return cartContainer;
}

let totalContainerDiv = document.createElement("div");
totalContainerDiv.id = "totalContainer";

let totalDiv = document.createElement("div");
totalDiv.id = "total";
totalContainerDiv.appendChild(totalDiv);

let totalh2 = document.createElement("h2");
let h2Text = document.createTextNode("Total Amount");
totalh2.appendChild(h2Text);
totalDiv.appendChild(totalh2);

// TO UPDATE THE TOTAL AMOUNT
function amountUpdate(amount) {
  let totalh4 = document.createElement("h4");
  totalh4.id = "tot";
  // let totalh4Text = document.createTextNode(amount)
  let totalh4Text = document.createTextNode("Amount: $ " + amount.toFixed(2));
  totalh4Text.id = "toth4";
  totalh4.appendChild(totalh4Text);
  totalDiv.appendChild(totalh4);
  totalDiv.appendChild(buttonDiv);
  console.log(totalh4);
}

let buttonDiv = document.createElement("div");
buttonDiv.id = "button";
totalDiv.appendChild(buttonDiv);

let buttonTag = document.createElement("button");
buttonDiv.appendChild(buttonTag);

let buttonLink = document.createElement("a");
buttonLink.href = "/orderSummary.html?";
buttonTag.appendChild(buttonLink);

buttonText = document.createTextNode("Proceed to Buy");
buttonTag.onclick = function () {
  console.log("clicked");
};

let totalAmount = 0;
let counter = 0;
let obj = {};

async function load() {
  document.getElementById("badge").style.backgroundColor = "white";
  document.getElementById("badge").innerHTML = "";

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
    contentDetails = await response.json();

    for (let i = 0; i < contentDetails.length; i++) {
      obj[contentDetails[i].product_id] = contentDetails[i].count;
      counter += contentDetails[i].count;
      totalAmount += contentDetails[i].count * contentDetails[i].price;
      dynamicCartSection(contentDetails[i], contentDetails[i].count);
    }

    amountUpdate(totalAmount);
    document.getElementById("totalItem").innerHTML = "Total Items: " + counter;
  }
}

load();

function removeSuccess() {
  $(".button-remove").removeClass("success");
  document.querySelector(".bg-modal-cart").style.display = "none";
  location.reload();
}
