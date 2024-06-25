document.addEventListener("DOMContentLoaded", function () {
  function isLoggedIn() {
    return localStorage.getItem("isLoggedIn") === "true";
  }

  function updateUI() {
    if (isLoggedIn()) {
      document.getElementById("logged-in-view").style.display = "";
      document.getElementById("account_name").innerText =
        localStorage.getItem("account_name");
    } else {
      document.getElementById("logged-out-view").style.display = "";
    }
  }

  updateUI();
});

function logout() {
  localStorage.setItem("isLoggedIn", "false");
}

async function searchFunction() {
  let items;
  let response = await fetch(
    "http://localhost:9000/shopswift/getProductNamesAndId",
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

  let input = document.getElementById("search-input").value.toLowerCase();
  let resultsContainer = document.getElementById("searchResults");
  resultsContainer.innerHTML = "";

  if (input === "") {
    resultsContainer.style.display = "none";
    return;
  }
  console.log(items);
  let filteredItems = Object.entries(items).filter(([key, value]) =>
    value.toLowerCase().includes(input)
  );

  if (filteredItems.length > 0) {
    let ul = document.createElement("ul");
    filteredItems.forEach((item) => {
      let li = document.createElement("li");
      li.textContent = item[1];
      li.addEventListener("click", function () {
        window.location.href =
          "http://localhost:8000/contentDetails.html?" + item[0];
      });
      ul.appendChild(li);
    });
    resultsContainer.appendChild(ul);
    resultsContainer.style.display = "block";
  } else {
    resultsContainer.style.display = "none";
  }
}

document.addEventListener("click", function (event) {
  let searchContainer = document.querySelector("#search");
  let isClickInside = searchContainer.contains(event.target);

  if (!isClickInside) {
    document.getElementById("searchResults").style.display = "none";
  }
});
