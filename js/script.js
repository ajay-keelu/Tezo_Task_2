let showHideMenu = document.querySelector('img[alt="direction"]');
let sidebar = document.querySelector(".sidebar");

showHideMenu.addEventListener("click", () => {
  sidebar.classList.toggle("sidebar-toggle");
});
