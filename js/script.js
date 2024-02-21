var employees = [];
var exportData = [];
let dropdownFilters = {};
document.querySelector("#sidebarToggle").addEventListener("click", () => { document.querySelector(".sidebar").classList.toggle("sidebar-toggle") });
function exportDataToCSV() {
  let csvFile = "S.No, User, Location, Departmant, Role, Employee ID, Status, Join Dt \n";
  exportData.forEach((element, i) => csvFile += `${i + 1},${element.firstname + " " + element.lastname}, ${element.location}, ${element.department},${element.role},${element.empno},${element.status},${element.joiningDate}\n`);
  let element = document.createElement("a");
  element.href = "data:text/csv;charset=utf-8," + encodeURI(csvFile);
  element.target = "_blank";
  element.download = "EmployeeData.csv";
  element.click();
}
function deleteEmployees() {
  let tableCheckbox = document.querySelectorAll("input.table-checkbox");
  let employeeCheckedDetails = [];
  tableCheckbox.forEach((element) => {
    element.checked ? employeeCheckedDetails.push(element.classList[1]) : ""
  });
  let unDeletedEmployees = employees;
  employeeCheckedDetails.forEach((id) => unDeletedEmployees = unDeletedEmployees.filter(emp => emp.empno != id));
  let unDeletedFilteredEmployees = employeeFilteredData;
  employeeCheckedDetails.forEach((id) => unDeletedFilteredEmployees = unDeletedFilteredEmployees.filter(emp => emp.empno != id));
  employees = unDeletedEmployees;
  employeeFilteredData = unDeletedEmployees;
  displayEmployeeTableData(unDeletedFilteredEmployees);
  employeeCheckBox();
}
let prevFilterButton;
function onFilterAlphabet(alphbet, element) {
  prevFilterButton ? prevFilterButton.classList.remove("active") : "";
  removeFilter(document.querySelector('.filter-aplhabets button'), "blur")
  prevFilterButton = element;
  let filterData1 = employees.filter((employee) => {
    return employee.firstname.toLowerCase().startsWith(alphbet);
  });
  let filterData = []
  filterData1.forEach((element) => {
    let flag = true;
    for (let key in dropdownFilters) {
      if (dropdownFilters[key] && element[key] != dropdownFilters[key])
        flag = false;
    }
    flag ? filterData.push(element) : "";
  });
  element.classList.add("active");
  employeeFilteredData = filterData;
  displayEmployeeTableData(filterData);
}
function setAlphbetFilters(id) {
  let filterBtnEle = document.getElementById(id);
  let filterbtns = "";
  for (let i = 65; i <= 90; i++) {
    filterbtns += `<button onclick="onFilterAlphabet('${String.fromCharCode(i + 32)}',this)">${String.fromCharCode(i)}</button>`;
  }
  filterBtnEle ? filterBtnEle.innerHTML += filterbtns : "";
}
function loadFilters() {
  setAlphbetFilters("filterBtns");
  setAlphbetFilters("buttonsWrapper");
}
let prevSortBtn;
function sortData(key, order, selector) {
  prevSortBtn ? prevSortBtn.style.background = "#000" : ""
  let sorteddata = exportData.sort(function (a, b) {
    let a1, a2;
    if (key == "name") {
      a1 = a.firstname + " " + a.lastname;
      a2 = b.firstname + " " + b.lastname;
    } else {
      a1 = a[key];
      a2 = b[key];
    }
    a1 = a1.toLowerCase(); a2 = a2.toLowerCase();
    if (order == "asec") {
      return a1 > a2 ? 1 : -1;
    }
    return a1 > a2 ? -1 : 1;
  });
  displayEmployeeTableData(sorteddata);
  document.querySelector(selector).style.background = "rgb(251, 192, 192)";
  prevSortBtn = document.querySelector(selector)
}
function deleteEmployee(empid) {
  let filterArray = employees.filter((employee) => {
    return employee.empno != empid;
  });
  let unDeletedEmployees = employeeFilteredData.filter((employee) => {
    return employee.empno != empid;
  });
  employees = filterArray;
  employeeFilteredData = unDeletedEmployees;
  displayEmployeeTableData(unDeletedEmployees);
}
function viewOrEditEmployee(empid, mode) {
  window.location = `addEmployee.html?id=${empid}`;
  localStorage.setItem('mode', mode)
}
function employeeCheckBox(e) {
  let tableCheckbox = document.querySelectorAll("input.table-checkbox");
  e && tableCheckbox?.forEach((element) => {
    (e && e.checked) ? element.checked = true : element.checked = false;
  });
  let flag = false;
  tableCheckbox.forEach((data) => {
    data.checked ? (flag = true) : "";
  });
  flag ? document.getElementById("deleteBtn").removeAttribute("disabled") : document.getElementById("deleteBtn").setAttribute("disabled", "true");
}
function displayEmployeeTableData(data) {
  exportData = data;
  let innerData = `<tr>
              <td>
                <div class="table-check-box"><input type="checkbox" onchange="employeeCheckBox(this)"/></div>
              </td>
              <td>
                <div class="head-user header">
                  <span>user</span>
                  <div class="icons">
                    <img id="up" src="images/chevron-up.svg" onclick="sortData('name','asec','.head-user #up')" class="fa table-icon">
                    <img id="down" src="images/chevron-down.svg" onclick="sortData('name','desc','.head-user #down')" class="fa table-icon" alt="down-arrow"/>
                  </div>
                </div>
              </td>
              <td>
                <div class="head-location header">
                  <span>location</span>
                  <div class="icons">
                    <img id="up" src="images/chevron-up.svg" onclick="sortData('location','asec','.head-location #up')"  class="fa table-icon" alt="arrow-up">
                    <img id="down" src="images/chevron-down.svg" onclick="sortData('location','desc','.head-location #down')"  class="fa table-icon" alt="down-arrow"/>
                  </div>
                </div>
              </td>
              <td>
                <div class="head-department header">
                  <span>department</span>
                  <div class="icons">
                    <img id="up" src="images/chevron-up.svg" onclick="sortData('department','asec','.head-department #up')"  class="fa table-icon" alt="arrow-up">
                    <img id="down" src="images/chevron-down.svg" onclick="sortData('department','desc','.head-department #down')"  class="fa table-icon" alt="down-arrow"/>
                  </div>
                </div>
              </td>
              <td>
                <div class="head-role header">
                  <span>role</span>
                  <div class="icons">
                    <img id="up" src="images/chevron-up.svg" onclick="sortData('role','asec','.head-role #up')"  class="fa table-icon" alt="arrow-up">
                    <img id="down" src="images/chevron-down.svg" onclick="sortData('role','desc','.head-role #down')"  class="fa table-icon" alt="down-arrow"/>
                  </div>
                </div>
              </td>
              <td>
                <div class="head-emp-no header">
                  <span>emp&nbsp;no</span>
                  <div class="icons">
                    <img id="up" src="images/chevron-up.svg" onclick="sortData('empno','asec','.head-emp-no #up')"  class="fa table-icon" alt="arrow-up">
                    <img id="down" src="images/chevron-down.svg" onclick="sortData('empno','desc','.head-emp-no #down')"  class="fa table-icon" alt="down-arrow"/>
                  </div>
                </div>
              </td>
              <td>
                <div class="head-status header">
                  <span>status</span>
                  <div class="icons">
                    <img id="up" src="images/chevron-up.svg" onclick="sortData('status','asec','.head-status #up')"  class="fa table-icon" alt="arrow-up">
                    <img id="down" src="images/chevron-down.svg" onclick="sortData('status','desc','.head-status #down')"  class="fa table-icon" alt="down-arrow"/>
                  </div>
                </div>
              </td>
              <td>
                <div class="head-join-date header">
                  <span>join&nbsp;dt</span>
                  <div class="icons">
                    <img id="up" src="images/chevron-up.svg" onclick="sortData('joiningDate','asec','.head-join-date #up')"  class="fa table-icon" alt="arrow-up">
                    <img id="down" src="images/chevron-down.svg" onclick="sortData('joiningDate','desc','.head-join-date #down')"  class="fa table-icon" alt="down-arrow"/>
                  </div>
                </div>
              </td>
              <td>
                <div class="user-modification">
                  <i> <img src="images/ellipsis.svg" class="fa-solid fa-ellipsis" /></i>
                </div>
              </td>
            </tr>`;
  data.forEach((element) => {
    innerData += `<tr>
            <td>
              <div class="table-check-box">
                <input type="checkbox" class="table-checkbox ${element.empno}" onchange="employeeCheckBox()" ${element.isEmployeeChecked ? "checked" : ""} />
              </div>
            </td>
            <td>
              <div class="user-profile-card">
                <div class="profile-img">
                  <img src="${element.image}" alt="user-profile" height="30px"/>
                </div>
                <div class="profile-description">
                  <div class="name">${element.firstname + " " + element.lastname}</div>
                  <div class="email">${element.email}</div>
                </div>
              </div>
            </td>
            <td>${element.location}</td>
            <td>${element.department}</td>
            <td>${element.role}</td>
            <td>${element.empno}</td>
            <td>
              <button class="active" style="text-transform:capitalize" title="status">${element.status}</button>
            </td>
            <td>${element.joiningDate}</td>
              <td class="view-edit">
                <button onclick="popUpDisplay(this)" onblur="hidePopUp(this)">
                    <i style="padding:0px 8px"><img src="images/ellipsis.svg" class="fa-solid fa-ellipsis" /></i>
                    <div>
                      <span onclick="viewOrEditEmployee(${element.empno},'view')">View&nbsp;Details </span>
                      <span onclick="viewOrEditEmployee(${element.empno},'edit')">Edit </span>
                      <span onclick="deleteEmployee(${element.empno})">Delete</span>
                    </div>
                </button>
              </td>
          </tr>`;
  });
  let tableElement = document.querySelector("#employeeTableData");
  data.length == 0 ? (tableElement ? tableElement.innerHTML = innerData + `<td colspan="9" style="text-align:center; padding:15px 0px">No data found</td>` : "") : tableElement.innerHTML = innerData;
  employeeCheckBox();
}
function loadEmployees() {
  employees = JSON.parse(localStorage.getItem("EmployeeData")) || [];
  displayEmployeeTableData(employees);
}
var employeeFilteredData = employees;
function employeeDropdown(value, key) {
  dropdownFilters[key] = value;
  let flag = false;
  for (let key in dropdownFilters) {
    if (dropdownFilters[key].length > 0) flag = true;
  }
  flag ? document.querySelector('#hideResetBtns').style.display = "block" : document.querySelector('#hideResetBtns').style.display = "none"
}
function initialize() {
  loadEmployees();
  loadFilters();
  employeeDropdown("", "status")
  removeFilter(document.querySelector('.filter-aplhabets button'), "focus");
}
initialize();
function applyEmployeeFilter() {
  let filteredData = [];
  employeeFilteredData.forEach((element) => {
    let flag = true;
    for (let key in dropdownFilters) {
      if (dropdownFilters[key] && element[key] != dropdownFilters[key]) flag = false;
    }
    flag ? filteredData.push(element) : "";
  });
  displayEmployeeTableData(filteredData);
}
function removeEmployeeFilter() {
  dropdownFilters = {};
  employeeDropdown("", "status")
  displayEmployeeTableData(employeeFilteredData);
}
let prevPopUpBtn;
function popUpDisplay(e) {
  e = e.parentNode;
  if (prevPopUpBtn && prevPopUpBtn == e) {
    prevPopUpBtn.classList.toggle("view-toggle"); return;
  }
  if (prevPopUpBtn && prevPopUpBtn.classList.contains("view-toggle")) prevPopUpBtn.classList.remove("view-toggle");
  e.classList.add("view-toggle");
  prevPopUpBtn = e;
}
function hidePopUp() {
  if (prevPopUpBtn && prevPopUpBtn.classList.contains("view-toggle")) prevPopUpBtn.classList.remove("view-toggle");
}
function removeFilter(e, eve) {
  if (prevFilterButton) prevFilterButton.classList.remove("active");
  employeeFilteredData = employees;
  displayEmployeeTableData(employees);
  if (eve == "focus") {
    e.children[0].style.filter = "grayscale(100%)";
    document.querySelector('#dropdownFilterForm').reset()
    dropdownFilters = {};
    employeeDropdown("", "status")
  } else e.children[0].style.filter = "grayscale(0%)"
}
window.location.pathname != "/addEmployee.html" ? localStorage.removeItem("mode") : "";
window.location.pathname != "/addRoles.html" ? localStorage.removeItem('roleIndex') : ""