window.addEventListener("load", function () {
  history.pushState(null, "", "index.html");
  window.addEventListener("popstate", function () {
    window.location.href = "index.html"; // Redirect to your desired page
  });
});

document.getElementById("search").style.visibility = "hidden";
document.getElementById("badge").style.backgroundColor = "white";
document.getElementById("badge").innerHTML = "";
