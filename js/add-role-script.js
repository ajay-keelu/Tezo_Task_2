var inputEmployeeSearch = document.querySelector('.assign-employees input[name="employee-search"]');
function getEmployeeData() {
  return JSON.parse(localStorage.getItem("EmployeeData")) || [];
}
function getRoles() {
  return JSON.parse(localStorage.getItem("RolesData")) || [];
}
function setEmployeeData(data) {
  localStorage.setItem("EmployeeData", JSON.stringify(data));
}
function setRoles(data) {
  localStorage.setItem("RolesData", JSON.stringify(data));
}
var employees = getEmployeeData();
var roles = getRoles();
inputEmployeeSearch.addEventListener("keyup", (e) => {
  document.querySelector(".search-employee-data").style.display = "flex";
  let filterArray = [];
  if (e.target.value) {
    employees.forEach((element) => {
      let name = element.firstname + element.lastname;
      if (name.toLowerCase().includes(e.target.value.toLowerCase()))
        filterArray.push(element);
    });
  }
  displayEmployee(filterArray);
})
inputEmployeeSearch.addEventListener("blur", (e) => {
  if (!e.target.value) {
    document.querySelector(".search-employee-data").style.display = "none";
  }
})
function displayEmployee(data) {
  let empData = "";
  data.forEach((element) => {
    empData += `
  <label for="emp${element.empno}" class="employee-card">
    <div  class="profile">
      <div class="profile-image">
        <img src="${element.image ? element.image : "images/user-profile.jpg"}" width="23px" alt="profile" />
      </div>
      <div class="name">${element.firstname + " " + element.lastname}</div>
    </div>
    <input type="checkbox" onchange="addingRoleToEmployee(${element.empno})" id="emp${element.empno}" ${element.isCheckedRole ? "checked" : ""} />
  </label>`;
  });
  document.querySelector(".search-employee-data").innerHTML = empData;
}
function removeFromEmployeeBubble(empno) {
  let employee = document.querySelector(`.employee-card #emp${empno}`);
  employee ? (employee.checked = false) : "";
  employees.forEach((element) => {
    element.empno == empno ? (element.isCheckedRole = false) : "";
  });
  displayEmployeeRoleBubble();
}
function displayEmployeeRoleBubble() {
  let employeeBubble = document.querySelector(".employee-bubble");
  employeeBubble.innerHTML = "";
  let flag = true;
  employees.forEach((element) => {
    if (element.isCheckedRole) {
      flag = false;
      employeeBubble.innerHTML += `
        <div class="employee-card">
          <div>
            <img src=${element.image ? element.image : "images/user-profile.jpg"} alt="profile" />
            <div class="name">${element.firstname}</div>
          </div>
          <button onclick="removeFromEmployeeBubble(${element.empno})">x</button>
        </div>`;
    }
  });
  employeeBubble.style.display = flag ? "none" : "flex";
  inputEmployeeSearch.style.maxWidth = flag ? "100%" : "calc(100% - 147px)";
  employeeBubble.style.width = flag ? "0" : "147px";
}
function addingRoleToEmployee(empno) {
  employees.forEach((employee) => {
    if (employee.empno == empno) {
      document.querySelector(`.employee-card #emp${empno}`).checked
        ? (employee.isCheckedRole = true)
        : (employee.isCheckedRole = false);
    }
  });
  displayEmployeeRoleBubble();
}
let role = {}
function getRoleData(value, key) {
  role[key] = value;
}
