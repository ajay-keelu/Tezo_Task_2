function getRoles() {
  return JSON.parse(localStorage.getItem("RolesData")) || [];
}
function setEmployeeData(data) {
  localStorage.setItem("EmployeeData", JSON.stringify(data));
}
function displayRoles(data) {
  let innerData = ""
  data.forEach((role, i) => {
    innerData += `<div class="roles-description">
        <div class="roles-heading">
          <h3>${role.roleName}</h3>
          <img src="images/edit.svg" alt="edit" onclick="editRole(${i})" />
        </div>
        <div class="role-information">
          <div class="role-item">
            <div class="left-item">
              <img src="images/employees-black.svg" alt="employee" />Department
            </div>
            <div class="right-item">${role.department}</div>
          </div>
          <div class="role-item">
            <div class="left-item">
              <img src="images/location.svg" alt="location" />Location
            </div>
            <div class="right-item">${role.location}</div>
          </div>
          <div class="role-item">
            <div class="left-item">Total Employees</div>
            <div class="right-item">
              <div class="image-container">
                    ${role.employeesAssigned.length > 4 ? (`<div class="top"> +${role.employeesAssigned.length - 4}</div>` +
                      role.employeesAssigned.slice(0, 4).map(employee => {
                        return `<div class="top">
                                  <img src="${employee.image}" height="20px" alt="profile" />
                                </div>`
                      })) : role.employeesAssigned.map(employee => {
                        return `<div class="top">
                                  <img src="${employee.image}" height="20px" alt="profile" />
                                </div>`})}
              </div>
            </div>
          </div>
        </div>
        <div class="view-more-employees">
            <div class="view">
                <button onclick="redirectToEmployees(${i})">View all Employees</button>
                <img src="images/right-arrow.svg" alt="right-arrow" />
            </div>
        </div>
      </div >`
  });
  document.querySelector('.roles-items').innerHTML = innerData;
}
function editRole(index) {
  window.location = `addRoles.html?index=${index}`;
}
function redirectToEmployees(index) {
  localStorage.setItem('roleIndex', index);
  window.location = 'rolesDetails.html';
}
displayRoles(getRoles())
let filter = {}
function filterChange(value, key) {
  filter[key] = value;
  let flag = false;
  for (let key in filter) {
    if (filter[key].length > 0) flag = true;
  }
  flag ? document.querySelector('#hideResetBtns').style.display = "block" : document.querySelector('#hideResetBtns').style.display = "none"
}
document.querySelector('#hideResetBtns').style.display = "none"
document.querySelector('.right-item .reset').addEventListener('click', () => displayRoles(roles))
document.querySelector('.right-item .apply').addEventListener('click', (e) => {
  e.preventDefault();
  let filteredData = [];
  getRoles().forEach((role) => {
    let flag = true;
    for (let key in filter) {
      if (filter[key] && role[key] != filter[key]) flag = false;
    }
    flag ? filteredData.push(role) : "";
  });
  displayRoles(filteredData);
})