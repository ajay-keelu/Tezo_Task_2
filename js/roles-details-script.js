let roleIndex = localStorage.getItem('roleIndex') || ""
if (!roleIndex) {
  window.location = 'roles.html'
}
function getRole(index) {
  return JSON.parse(localStorage.getItem("RolesData"))[index] || []
}
let role = getRole(roleIndex)
if (!role || role.length == 0) {
  window.location = 'roles.html'
}
let assignedEmployees = role.employeesAssigned;
document.getElementById('description').innerHTML = role.description
function displayRoleEmployees(data) {
  let innerData = "";
  data.forEach(employee => {
    innerData += `<div class="role-profile-card">
        <div class="role-profile">
          <div class="role-image">
            <img src="${employee.image}" alt="profile" height="30px" />
          </div>
          <div class="role-profile-description">
            <div class="name">${employee.firstname + " " + employee.lastname}</div>
            <div class="sub-line">Head of Product Design</div>
          </div>
        </div>
        <div class="profile-information">
          <div>
            <img src="images/address-card.svg" alt="address-card" />
            <span>${employee.empno}</span>
          </div>
          <div>
            <img src="images/email.svg" alt="email" />
            <span>${employee.email}</span>
          </div>
          <div>
            <img src="images/employees-black.svg" alt="technology" />
            <span>${employee.department}</span>
          </div>
          <div>
            <img src="images/location.svg" alt="location" />
            <span>${employee.location}</span>
          </div>
        </div>
        <div class="view-more">
          <div class="view">
            <span>View</span><img src="images/right-arrow.svg" alt="right-arrow" />
          </div>
        </div>
      </div>`
  });
  document.querySelector('.role-all-profiles').innerHTML = innerData
}
displayRoleEmployees(assignedEmployees)