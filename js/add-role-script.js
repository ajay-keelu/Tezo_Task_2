var inputEmployeeSearch = document.querySelector('.assign-employees input[name="employeeSearch"]');
function getEmployeeData() {
  return JSON.parse(localStorage.getItem("EmployeeData")) || [];
}
var employees = getEmployeeData();
var role = {}
function getRoles() {
  return JSON.parse(localStorage.getItem("RolesData")) || [];
}
function setEmployeeData(data) {
  localStorage.setItem("EmployeeData", JSON.stringify(data));
}
let index = window.location.search.slice(7);
index ? editRole(index) : ""
class Role {
  constructor(roleName, department, description, location, employeesAssigned) {
    this.roleName = roleName
    this.department = department
    this.description = description
    this.location = location
    this.employeesAssigned = employeesAssigned
  }
}
function setRoles(data) {
  localStorage.setItem("RolesData", JSON.stringify(data));
}
inputEmployeeSearch.addEventListener("keyup", (e) => {
  document.querySelector(".search-employee-data").style.display = "flex";
  let filterArray = [];
  if (e.target.value) {
    employees.forEach((element) => {
      let name = element.firstname + element.lastname;
      name.toLowerCase().includes(e.target.value.toLowerCase()) ? filterArray.push(element) : ""
    });
  }
  displayEmployee(filterArray);
})
inputEmployeeSearch.addEventListener("focus", (e) => {
  document.querySelector(".search-employee-data").style.display = "flex";
  let filterArray = [];
  if (e.target.value) {
    employees.forEach((element) => {
      let name = element.firstname + element.lastname;
      e.toLowerCase().includes(e.target.value.toLowerCase()) ? filterArray.push(element) : ""
    }
    )
  }
  displayEmployee(filterArray);
  displayEmployeeRoleBubble
})
inputEmployeeSearch.addEventListener("blur", (e) => {
  if (!e.target.value) {
    document.querySelector(".search-employee-data").style.display = "none";
  }
})
function displayEmployee(data) {
  let empData = "";
  data.forEach((element) => {
    empData += `<label for="emp${element.empno}" class="employee-card">
    <div  class="profile">
      <div class="profile-image">
        <img src="${element.image}" width="23px" alt="profile" />
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
  employees.forEach((element) => element.empno == empno ? (element.isCheckedRole = false) : "");
  displayEmployeeRoleBubble();
}
function displayEmployeeRoleBubble() {
  let employeeBubble = document.querySelector(".employee-bubble");
  employeeBubble.innerHTML = "";
  let flag = true;
  employees.forEach((element) => {
    if (element.isCheckedRole) {
      flag = false;
      employeeBubble.innerHTML += `<div class="employee-card">
          <div>
            <img src=${element.image} alt="profile" />
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
  employees.forEach((employee) => employee.empno == empno ? document.querySelector(`.employee-card #emp${empno}`).checked ? (employee.isCheckedRole = true) : (employee.isCheckedRole = false) : "")
  displayEmployeeRoleBubble();
}
function getRoleData(value, key) {
  role[key] = value;
}
function toastToggle(message) {
  document.querySelector(".toast").classList.toggle("toast-toggle");
  document.querySelector(".toast .message").innerText = message;
}
let requiredFields = ["role", "department", "description", "location"]
function resetForm() {
  document.querySelector("#roleForm").reset();
  for (let field of requiredFields) {
    document.querySelector(`#${field}`).removeAttribute('error')
  }
  employees.forEach((employee) => employee.isCheckedRole = false)
  displayEmployeeRoleBubble()
  displayEmployee([])
}
document.querySelector('#addrole').addEventListener('click', (e) => {
  e.preventDefault()
  let flag = false;
  requiredFields.forEach((field => {
    let spanElement = document.querySelector(`#${field}`);
    if (!role[field]) {
      flag = true;
      spanElement.setAttribute('error', "")
    } else spanElement.removeAttribute('error')
  }))
  if (flag) return;
  let employeesAssigned = employees.filter(employee => employee.isCheckedRole)
  role["employeesAssigned"] = employeesAssigned
  let roleData = new Role(role["role"], role["department"], role["description"], role["location"], role["employeesAssigned"])
  let rolesData = getRoles();
  index ? rolesData[index] = roleData : rolesData.push(roleData);
  setRoles(rolesData)
  let message = index ? "Role Updated Successfully" : "Role Added Successfully"
  toastToggle(message);
  setTimeout(() => {
    toastToggle("");
    resetForm();
  }, 1500);
})
function editRole(index) {
  let roleData = getRoles()[index]
  document.querySelector('#addrole').innerHTML = "Update"
  document.querySelector('input[name="role"]').value = roleData.roleName;
  document.querySelector('select[name="department"]').value = roleData.department;
  document.querySelector('select[name="location"]').value = roleData.location;
  document.querySelector('textarea[name="description"]').value = roleData.description;
  let employeesAssigned = roleData.employeesAssigned;
  let employeeData = getEmployeeData();
  employeeData.forEach(employee => {
    employeesAssigned.forEach(emp => employee.empno == emp.empno ? employee.isCheckedRole = true : "")
  })
  employees = employeeData
  role = { ...roleData, 'role': roleData.roleName }
  displayEmployeeRoleBubble()
}