console.clear();

const productUrl = "http://localhost:9000/shopswift/product/";
const cartCountUrl = "http://localhost:9000/shopswift/getCartCount/";
const cartProductCountUrl =
  "http://localhost:9000/shopswift/getCartProductCount/";
const addToCartUrl = "http://localhost:9000/shopswift/addToCart";
const username = "shopswift";
const password = "shopswift";

const headers = new Headers();
const authString = `${username}:${password}`;
const encodedAuthString = btoa(authString);
headers.append("Authorization", `Basic ${encodedAuthString}`);
headers.append("Content-Type", "application/json");

let id = location.search.split("?")[1];
console.log(id);

/*if(document.cookie.indexOf(',counter=')>=0)
{
    let counter = document.cookie.split(',')[1].split('=')[1]
    document.getElementById("badge").innerHTML = counter
}*/

async function dynamicContentDetails(ob) {
  let maxCount = 0;

  if (localStorage.getItem("isLoggedIn") === "true") {
    let response3 = await fetch(
      cartProductCountUrl + ob.id + "/" + localStorage.getItem("account_name"),
      {
        method: "GET",
        headers: headers,
      }
    );

    maxCount = ob.stock_count - (await response3.text());

    let response = await fetch(
      cartCountUrl + localStorage.getItem("account_name"),
      {
        method: "GET",
        headers: headers,
      }
    );

    if (!response.ok) {
      alert("Something went wrong!!");
    } else {
      document.getElementById("badge").innerHTML = await response.text();
    }
  }

  let mainContainer = document.createElement("div");
  mainContainer.id = "containerD";
  document.getElementById("containerProduct").appendChild(mainContainer);

  let imageSectionDiv = document.createElement("div");
  imageSectionDiv.id = "imageSection";

  let imgTag = document.createElement("img");
  imgTag.id = "imgDetails";
  //imgTag.id = ob.photos
  imgTag.src = ob.preview_url;

  imageSectionDiv.appendChild(imgTag);

  let productDetailsDiv = document.createElement("div");
  productDetailsDiv.id = "productDetails";

  // console.log(productDetailsDiv);

  let h1 = document.createElement("h1");
  let h1Text = document.createTextNode(ob.product_name);
  h1.appendChild(h1Text);

  let h4 = document.createElement("h4");
  let h4Text = document.createTextNode(ob.brand);
  h4.appendChild(h4Text);
  console.log(h4);

  let detailsDiv = document.createElement("div");
  detailsDiv.id = "details";

  let h3DetailsDiv = document.createElement("h3");
  let h3DetailsText = document.createTextNode("$ " + ob.price);
  h3DetailsDiv.appendChild(h3DetailsText);

  let h3 = document.createElement("h3");
  let h3Text = document.createTextNode("Description");
  h3.appendChild(h3Text);

  let para = document.createElement("p");
  let paraText = document.createTextNode(ob.description);
  para.appendChild(paraText);

  let productPreviewDiv = document.createElement("div");
  productPreviewDiv.id = "productPreview";

  let h3ProductPreviewDiv = document.createElement("h3");
  let h3ProductPreviewText = document.createTextNode("Product Preview");
  h3ProductPreviewDiv.appendChild(h3ProductPreviewText);
  productPreviewDiv.appendChild(h3ProductPreviewDiv);

  let i;
  for (i = 0; i < ob.image.length; i++) {
    let imgTagProductPreviewDiv = document.createElement("img");
    imgTagProductPreviewDiv.id = "previewImg";
    imgTagProductPreviewDiv.src = ob.image[i].url;
    imgTagProductPreviewDiv.onclick = function (event) {
      console.log("clicked" + this.src);
      imgTag.src = this.src;
      document.getElementById("imgDetails").src = this.src;
    };
    productPreviewDiv.appendChild(imgTagProductPreviewDiv);
  }

  let buttonDiv = document.createElement("div");
  buttonDiv.id = "button-div";

  let buttonTag = document.createElement("button");
  buttonTag.id = "cartButton";

  buttonText = document.createTextNode("Add to Cart");
  buttonTag.onclick = async function () {
    if (localStorage.getItem("isLoggedIn") === "false") {
      document.querySelector(".bg-modal").style.display = "flex";

      document.body.classList.add("modal-open");

      document.querySelector(".close").addEventListener("click", function () {
        document.querySelector(".bg-modal").style.display = "none";

        document.body.classList.remove("modal-open");
      });
    } else if (parseInt(document.getElementById("number").value) > 0) {
      let body = JSON.stringify({
        product_id: ob.id,
        count:
          parseInt(document.getElementById("number").value) >=
          parseInt(inputBox.max)
            ? parseInt(inputBox.max)
            : document.getElementById("number").value,
        user_name: localStorage.getItem("account_name"),
      });

      await fetch(addToCartUrl, {
        method: "POST",
        headers: headers,
        body: body,
      });

      let response1 = await fetch(
        cartCountUrl + localStorage.getItem("account_name"),
        {
          method: "GET",
          headers: headers,
        }
      );

      if (!response1.ok) {
        alert("Something went wrong!!");
      } else {
        document.getElementById("badge").innerHTML = await response1.text();
      }

      let response2 = await fetch(
        cartProductCountUrl +
          ob.id +
          "/" +
          localStorage.getItem("account_name"),
        {
          method: "GET",
          headers: headers,
        }
      );

      let cartCount = 0;

      if (!response2.ok) {
        alert("Something went wrong!!");
      } else {
        cartCount = await response2.text();
      }

      if (ob.stock_count - cartCount <= 0) {
        minusButton.disabled = true;
        plusButton.disabled = true;
        inputBox.value = "0";
        inputBox.disabled = true;
      } else {
        inputBox.value = "1";
        inputBox.min = "1";
        inputBox.max = ob.stock_count - cartCount;
      }
    }
  };
  const quantityDiv = document.createElement("div");
  quantityDiv.className = "quantity";

  // Create the minus button
  const minusButton = document.createElement("button");
  minusButton.className = "minus";
  minusButton.id = "minus";
  minusButton.setAttribute("aria-label", "Decrease");
  minusButton.innerHTML = "&minus;";

  // Create the input box
  const inputBox = document.createElement("input");
  inputBox.type = "number";
  inputBox.id = "number";
  inputBox.className = "input-box";
  inputBox.value = maxCount == 0 ? 0 : 1;
  inputBox.min = maxCount == 0 ? 0 : 1;
  inputBox.max = maxCount;

  // Create the plus button
  const plusButton = document.createElement("button");
  plusButton.className = "plus";
  plusButton.id = "plus";
  plusButton.setAttribute("aria-label", "Increase");
  plusButton.innerHTML = "&plus;";

  minusButton.onclick = function () {
    let value = parseInt(inputBox.value);
    value = isNaN(value) ? 1 : Math.max(value - 1, 1);
    inputBox.value = value;
    minusButton.disabled = value <= 1;
    plusButton.disabled = value >= parseInt(inputBox.max);
  };

  plusButton.onclick = function () {
    let value = parseInt(inputBox.value);
    value = isNaN(value) ? 1 : Math.min(value + 1, parseInt(inputBox.max));
    inputBox.value = value;
    minusButton.disabled = value <= 1;
    plusButton.disabled = value >= parseInt(inputBox.max);
  };

  // Append the elements to the quantity div
  quantityDiv.appendChild(minusButton);
  quantityDiv.appendChild(inputBox);
  quantityDiv.appendChild(plusButton);

  buttonDiv.appendChild(quantityDiv);

  buttonDiv.appendChild(buttonTag);

  buttonTag.appendChild(buttonText);

  console.log(mainContainer.appendChild(imageSectionDiv));
  mainContainer.appendChild(imageSectionDiv);
  mainContainer.appendChild(productDetailsDiv);
  productDetailsDiv.appendChild(h1);
  productDetailsDiv.appendChild(h4);
  productDetailsDiv.appendChild(detailsDiv);
  detailsDiv.appendChild(h3DetailsDiv);
  detailsDiv.appendChild(h3);
  detailsDiv.appendChild(para);
  productDetailsDiv.appendChild(productPreviewDiv);

  productDetailsDiv.appendChild(buttonDiv);

  return mainContainer;
}

async function load() {
  let response = await fetch(productUrl + id, {
    method: "GET",
    headers: headers,
  });

  if (!response.ok) {
    alert("Something went wrong!!");
  } else {
    contentDetails = await response.json();
    dynamicContentDetails(contentDetails);
  }
}

load();

function updateButtonStates() {
  const value = parseInt(inputBox.value);
  minusBtn.disabled = value <= 1;
  plusBtn.disabled = value >= parseInt(inputBox.max);
}

function handleQuantityChange() {
  let value = parseInt(inputBox.value);
  value = isNaN(value) ? 1 : value;

  // Execute your code here based on the updated quantity value
  console.log("Quantity changed:", value);
}
