function check() {
  if (localStorage.getItem("isLoggedIn") === "false") {
    document.querySelector(".bg-modal").style.display = "flex";

    document.body.classList.add("modal-open");

    document.querySelector(".close").addEventListener("click", function () {
      document.querySelector(".bg-modal").style.display = "none";

      document.body.classList.remove("modal-open");
    });
  } else {
    location.href = "sell.html";
  }
}
