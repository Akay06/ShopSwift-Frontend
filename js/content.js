// console.clear();

let contentTitle;

console.log(document.cookie);

if (localStorage.getItem("isLoggedIn") === null)
  localStorage.setItem("isLoggedIn", false);
if (localStorage.getItem("account_name") === null)
  localStorage.setItem("account_name", "");

function dynamicClothingSection(ob) {
  let boxDiv = document.createElement("div");
  boxDiv.id = "box";

  let boxLink = document.createElement("a");
  // boxLink.href = '#'
  boxLink.href = "contentDetails.html?" + ob.id;
  // console.log('link=>' + boxLink);

  let imgTag = document.createElement("img");
  // imgTag.id = 'image1'
  // imgTag.id = ob.photos
  imgTag.src = ob.preview_url;

  let detailsDiv = document.createElement("div");
  detailsDiv.id = "details";

  let h3 = document.createElement("h3");
  let h3Text = document.createTextNode(ob.product_name);
  h3.appendChild(h3Text);

  let h4 = document.createElement("h4");
  let h4Text = document.createTextNode(ob.brand);
  h4.appendChild(h4Text);

  let h2 = document.createElement("h2");
  let h2Text = document.createTextNode("$  " + ob.price);
  h2.appendChild(h2Text);

  boxDiv.appendChild(boxLink);
  boxLink.appendChild(imgTag);
  boxLink.appendChild(detailsDiv);
  detailsDiv.appendChild(h3);
  detailsDiv.appendChild(h4);
  detailsDiv.appendChild(h2);

  return boxDiv;
}

//  TO SHOW THE RENDERED CODE IN CONSOLE
// console.log(dynamicClothingSection());

// console.log(boxDiv)

let mainContainer = document.getElementById("mainContainer");
let containerClothing = document.getElementById("containerClothing");
let containerAccessories = document.getElementById("containerAccessories");
// mainContainer.appendChild(dynamicClothingSection('hello world!!'))

// BACKEND CALLING

const url = "https://shopswift-19of.onrender.com/shopswift/product";
const cartCountUrl =
  "https://shopswift-19of.onrender.com/shopswift/getCartCount/";
const username = "shopswift";
const password = "shopswift";

const headers = new Headers();
const authString = `${username}:${password}`;
const encodedAuthString = btoa(authString);
headers.append("Authorization", `Basic ${encodedAuthString}`);
headers.append("Content-Type", "application/json");

async function load() {
  let response = await fetch(url, {
    method: "GET",
    headers: headers,
  });

  if (!response.ok) {
    alert("Something went wrong!!");
  } else {
    contentTitle = await response.json();
    if (localStorage.getItem("isLoggedIn") === "true") {
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
    for (let i = 0; i < contentTitle.length; i++) {
      containerClothing.appendChild(dynamicClothingSection(contentTitle[i]));
    }
  }
}

load();
