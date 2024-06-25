const profileUrl = "https://shopswift-19of.onrender.com/shopswift/profile/";
const editProfileUrl =
  "https://shopswift-19of.onrender.com/shopswift/profile/edit/";
const cartCountUrl =
  "https://shopswift-19of.onrender.com/shopswift/getCartCount/";
const username = "shopswift";
const password = "shopswift";

const headers = new Headers();
const authString = `${username}:${password}`;
const encodedAuthString = btoa(authString);
headers.append("Authorization", `Basic ${encodedAuthString}`);
headers.append("Content-Type", "application/json");

document.getElementById("search").style.visibility = "hidden";

document.addEventListener("DOMContentLoaded", async function () {
  if (localStorage.getItem("isLoggedIn") === "true") {
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
      document.getElementById("name").textContent = profileDetails.name;
      document.getElementById("email").textContent = profileDetails.email;
      document.getElementById("phone").textContent = profileDetails.phone;
      document.getElementById("address").textContent = profileDetails.address;
    }
  }
});

function editProfile() {
  // Switch to edit mode
  document.querySelector(".profile-view").style.display = "none";
  document.querySelector(".profile-edit").style.display = "block";

  // Populate edit fields with current values
  document.getElementById("editName").value =
    document.getElementById("name").textContent;
  document.getElementById("editEmail").value =
    document.getElementById("email").textContent;
  document.getElementById("editPhone").value =
    document.getElementById("phone").textContent;
  document.getElementById("editAddress").value =
    document.getElementById("address").textContent;
}

function cancelEdit() {
  // Switch back to view mode
  document.querySelector(".profile-view").style.display = "block";
  document.querySelector(".profile-edit").style.display = "none";
}

async function saveProfile() {
  // Save edited values
  var newName = document.getElementById("editName").value;
  var newEmail = document.getElementById("editEmail").value;
  var newPhone = document.getElementById("editPhone").value;
  var newAddress = document.getElementById("editAddress").value;

  let body = JSON.stringify({
    name: newName,
    email: newEmail,
    phone: newPhone,
    address: newAddress,
  });

  let response = await fetch(
    editProfileUrl + localStorage.getItem("account_name"),
    {
      method: "POST",
      headers: headers,
      body: body,
    }
  );

  if (!response.ok) {
    alert("Save Failed. PLease try again!!");
  } else {
    window.location.reload();
  }
}

function validateForgotPassword() {
  var mail = document.getElementById("email").value;

  /*if (newPassword.length < 8 || confirmPassword.length < 8) {
		document.getElementById("errorMsg").innerHTML = "Your password must include atleast 8 characters"
		return false;
	}
    else if(!(newPassword === confirmPassword)){
        document.getElementById("errorMsg").innerHTML = "Your password does not match"
		return false;
    }
    else {
        document.getElementById("errorMsg").innerHTML = "";
        setTimeout(function() {
            alert("Password successfully reseted!!");
        }, 0);
        return false;
    }*/

  document.getElementById("errorMsg").innerHTML = "";
  setTimeout(function () {
    alert("Email with reset link sent to " + mail);
  }, 0);
  return false;
}
