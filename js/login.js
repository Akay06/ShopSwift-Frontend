const loginUrl = "http://localhost:9000/shopswift/login";
const signupUrl = "http://localhost:9000/shopswift/signup";
const username = "shopswift";
const password = "shopswift";

const headers = new Headers();
const authString = `${username}:${password}`;
const encodedAuthString = btoa(authString);
headers.append("Authorization", `Basic ${encodedAuthString}`);
headers.append("Content-Type", "application/json");
//headers.append('Access-Control-Allow-Origin', '*');

$(window).on("hashchange", function () {
  if (location.hash.slice(1) == "signup") {
    $(".page").addClass("extend");
    $("#login").removeClass("active");
    $("#signup").addClass("active");
  } else {
    $(".page").removeClass("extend");
    $("#login").addClass("active");
    $("#signup").removeClass("active");
  }
});
$(window).trigger("hashchange");

async function validateLoginForm() {
  event.preventDefault();

  var name = document.getElementById("logName").value;
  var password = document.getElementById("logPassword").value;

  if (name == "" || password == "") {
    document.getElementById("errorMsg").innerHTML =
      "Please fill the required fields";
    return false;
  } else if (password.length < 8) {
    document.getElementById("errorMsg").innerHTML =
      "Your password must include atleast 8 characters";
    return false;
  } else {
    let body = JSON.stringify({
      user_name: name,
      password: password,
    });

    let response = await fetch(loginUrl, {
      method: "POST",
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      document.getElementById("errorMsg").innerHTML = "Invalid Credential";
      return false;
    } else {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("account_name", name);
      window.location.replace(document.referrer);
      return false;
    }
  }
}
async function validateSignupForm() {
  event.preventDefault();

  var mail = document.getElementById("signEmail").value;
  var name = document.getElementById("signName").value;
  var password = document.getElementById("signPassword").value;
  var mobile = document.getElementById("signMobile").value;

  if (mail == "" || name == "" || password == "" || mobile == "") {
    document.getElementById("errorMsg").innerHTML =
      "Please fill the required fields";
    return false;
  } else if (!validateEmail(mail)) {
    document.getElementById("errorMsg").innerHTML =
      "Please enter valid email address";
    return false;
  } else if (!validatePhoneNumber(mobile)) {
    document.getElementById("errorMsg").innerHTML =
      "Please enter valid mobile number";
    return false;
  } else if (password.length < 8) {
    document.getElementById("errorMsg").innerHTML =
      "Your password must include atleast 8 characters";
    return false;
  } else {
    let body = JSON.stringify({
      user_name: name,
      password: password,
      email: mail,
      mobile: mobile,
    });

    let response = await fetch(signupUrl, {
      method: "POST",
      headers: headers,
      body: body,
    });

    const text = await response.text();

    if (!response.ok) {
      document.getElementById("errorMsg").innerHTML = "Invalid Details";
      return false;
    } else {
      if (text.includes("Username taken")) {
        document.getElementById("errorMsg").innerHTML =
          "Username taken! Please choose another";
        return false;
      } else {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("account_name", name);
        return true;
      }
    }
  }
}

var basicTimeline = anime.timeline({
  autoplay: false,
});

var pathEls = $(".check_anime");
for (var i = 0; i < pathEls.length; i++) {
  var pathEl = pathEls[i];
  var offset = anime.setDashoffset(pathEl);
  pathEl.setAttribute("stroke-dashoffset", offset);
}

basicTimeline
  .add({
    targets: ".text_anime",
    duration: 1,
    opacity: "0",
  })
  .add({
    targets: ".button_anime",
    duration: 1300,
    height: 15,
    width: 300,
    backgroundColor: "#2B2D2F",
    border: "0",
    borderRadius: 100,
  })
  .add({
    targets: ".progress-bar_anime",
    duration: 2000,
    width: 300,
    easing: "linear",
  })
  .add({
    targets: ".button_anime",
    width: 0,
    duration: 1,
  })
  .add({
    targets: ".progress-bar_anime",
    width: 80,
    height: 80,
    delay: 500,
    duration: 750,
    borderRadius: 80,
    backgroundColor: "#71DFBE",
  })
  .add({
    targets: pathEl,
    strokeDashoffset: [offset, 0],
    duration: 200,
    easing: "easeInOutSine",
    complete: function () {
      window.location.replace(document.referrer);
    },
  });

let isHandlingClick = false;

async function handleButtonClick() {
  if (isHandlingClick) return;
  isHandlingClick = true;
  try {
    if (await validateSignupForm()) {
      document.getElementById("errorMsg").innerHTML = "";
      basicTimeline.play();
    }
  } catch (error) {
    console.error("Error during signup form validation:", error);
  } finally {
    isHandlingClick = false;
  }
}

// Attach the handleButtonClick function to the click events
$(".button_anime, .text_anime, svg").click(handleButtonClick);

function validatePhoneNumber(phoneNumber) {
  var regex = /^[0-9]{10}$/;
  if (regex.test(phoneNumber)) {
    return true;
  } else {
    return false;
  }
}

function validateEmail(email) {
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (regex.test(email)) {
    return true;
  } else {
    return false;
  }
}
