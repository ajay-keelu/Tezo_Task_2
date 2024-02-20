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
<<<<<<< Updated upstream
=======
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
  toastToggle(index ? "Role Updated Successfully" : "Role Added Successfully");
  setTimeout(() => {
    toastToggle("");
    resetForm();
    window.location = "roles.html"
  }, 1500);
})
function editRole(index) {
  let roleData = getRoles()[index]
  if(!roleData){
    window.location = "roles.html"
  }
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
>>>>>>> Stashed changes
