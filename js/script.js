function getEmployeeData() {
  return JSON.parse(localStorage.getItem("EmployeeData")) || [];
}

function setEmployeeData(data) {
  localStorage.setItem("EmployeeData", JSON.stringify(data));
}

let employees = getEmployeeData();

document.querySelector('img[alt="direction"]').addEventListener("click", () => {
  document.querySelector(".sidebar").classList.toggle("sidebar-toggle");
});

var exportData;

var employeeFilteredData = employees;

let filterDropdown = {};

let EmployeeDropdown = (value, key) => {
  filterDropdown[key] = value;
};

function applyEmployeeFilter() {
  let filteredData = [];
  employeeFilteredData.forEach((element) => {
    let flag = true;
    for (let key in filterDropdown) {
      if (filterDropdown[key] && element[key] != filterDropdown[key])
        flag = false;
    }
    flag ? filteredData.push(element) : "";
  });
  displayTable(filteredData);
}

let removeEmployeeFilter = () => {
  filterDropdown = {};
  displayTable(employeeFilteredData);
};

function displayTableData(data) {
  exportData = data;
  let innerData = ` 
          <tr>
            <td>
              <div class="table-check-box">
                <input type="checkbox" onchange="employeeCheckBox(this)" />
              </div>
            </td>
            <td>
              <div class="head-user header">
                <span>user</span>
                <div class="icons">
                  <i
                    onclick="sortData('name','asec')"
                    class="fa fa-chevron-up"
                  ></i>
                  <i
                    onclick="sortData('name','desc')"
                    class="fa fa-chevron-down"
                  ></i>
                </div>
              </div>
            </td>
            <td>
              <div class="head-location header">
                <span>location</span>
                <div class="icons">
                  <i
                    onclick="sortData('location','asec')"
                    class="fa fa-chevron-up"
                  ></i>
                  <i
                    onclick="sortData('location','desc')"
                    class="fa fa-chevron-down"
                  ></i>
                </div>
              </div>
            </td>
            <td>
              <div class="head-department header">
                <span>department</span>
                <div class="icons">
                  <i
                    onclick="sortData('department','asec')"
                    class="fa fa-chevron-up"
                  ></i>
                  <i
                    onclick="sortData('department','desc')"
                    class="fa fa-chevron-down"
                  ></i>
                </div>
              </div>
            </td>
            <td>
              <div class="head-role header">
                <span>role</span>
                <div class="icons">
                  <i
                    onclick="sortData('role','asec')"
                    class="fa fa-chevron-up"
                  ></i>
                  <i
                    onclick="sortData('role','desc')"
                    class="fa fa-chevron-down"
                  ></i>
                </div>
              </div>
            </td>
            <td>
              <div class="head-emp-no header">
                <span>emp&nbsp;no</span>
                <div class="icons">
                  <i
                    onclick="sortData('empno','asec')"
                    class="fa fa-chevron-up"
                  ></i>
                  <i
                    onclick="sortData('empno','desc')"
                    class="fa fa-chevron-down"
                  ></i>
                </div>
              </div>
            </td>
            <td>
              <div class="head-status header">
                <span>status</span>
                <div class="icons">
                  <i
                    onclick="sortData('status','asec')"
                    class="fa fa-chevron-up"
                  ></i>
                  <i
                    onclick="sortData('status','desc')"
                    class="fa fa-chevron-down"
                  ></i>
                </div>
              </div>
            </td>
            <td>
              <div class="head-join-date header">
                <span>join&nbsp;dt</span>
                <div class="icons">
                  <i
                    onclick="sortData('joiningDate','asec')"
                    class="fa fa-chevron-up"
                  ></i>
                  <i
                    onclick="sortData('joiningDate','desc')"
                    class="fa fa-chevron-down"
                  ></i>
                </div>
              </div>
            </td>
            <td>
              <div class="user-modification" style="padding:0px 10px">
                <i class="fa-solid fa-ellipsis"></i>
              </div>
            </td>
          </tr>`;
  data.forEach((element) => {
    innerData += ` 
        <tr>
          <td>
            <div class="table-check-box">
              <input type="checkbox" class="table-checkbox" onchange="employeeCheckBox()" />
            </div>
          </td>
          <td>
            <div class="user-profile-card">
              <div class="profile-img">
                <img
                  src="${
                    element.image ? element.image : "images/user-profile.jpg"
                  }"
                  alt="user-profile"
                  height="30px"
                />
              </div>
              <div class="profile-description">
                <div class="name">${
                  element.firstname + " " + element.lastname
                }</div>
                <div class="email">${element.email}</div>
              </div>
            </div>
          </td>
          <td>${element.location}</td>
          <td>${element.department}</td>
          <td>${element.role}</td>
          <td>${element.empno}</td>
          <td>
            <button class="active" style="text-transform:capitalize" title="status">${
              element.status
            }</button>
          </td>
          <td>${element.joiningDate}</td>
          <div>
          <td class="view-edit">
            <button onclick="editOrView(this,${
              element.empno
            })" onblur="editOrHide(this)">
                <i class="fa-solid fa-ellipsis"></i>
                <div>
                  <span id="viewemp-${element.empno}">View&nbsp;Details </span>
                  <span id="editemp-${element.empno}">Edit </span>
                  <span class="delete" id="deleteemp-${
                    element.empno
                  }">Delete</span>
                </div>
            </button>
          </td>
        </tr>`;
  });

  let employeeTableData = document.querySelector("#employee-table-data");
  if (data.length == 0 && employeeTableData)
    employeeTableData.innerHTML =
      innerData +
      `<td colspan="9" style="text-align:center; padding:15px 0px">No data found</td>`;
  else {
    employeeTableData ? (employeeTableData.innerHTML = innerData) : "";
  }
}

let prevEditViewBtn;

let editOrView = (e, empno) => {
  e = e.parentNode;
  let tableDataDelete = document.querySelector(`span#deleteemp-${empno}`);
  let tableDataEdit = document.querySelector(`span#editemp-${empno}`);
  let tableDataView = document.querySelector(`span#viewemp-${empno}`);
  tableDataDelete?.addEventListener("click", () => {
    let filterArray = employees.filter((element) => {
      return element.empno != empno;
    });
    let unDeletedEmployee = employeeFilteredData.filter((element) => {
      return element.empno != empno;
    });
    employees = filterArray;
    employeeFilteredData = unDeletedEmployee;
    displayTable(unDeletedEmployee);
    return;
  });
  tableDataEdit?.addEventListener("click", () => {
    localStorage.setItem("mode", "edit");
    localStorage.setItem("empid", empno);
    window.location = "addEmployee.html";
  });
  tableDataView?.addEventListener("click", () => {
    localStorage.setItem("mode", "view");
    localStorage.setItem("empid", empno);
    window.location = "addEmployee.html";
  });
  if (prevEditViewBtn && prevEditViewBtn == e) {
    prevEditViewBtn.classList.toggle("view-toggle");
    return;
  }
  if (prevEditViewBtn && prevEditViewBtn.classList.contains("view-toggle")) {
    prevEditViewBtn.classList.remove("view-toggle");
  }
  e.classList.add("view-toggle");
  prevEditViewBtn = e;
};

let editOrHide = () => {
  if (prevEditViewBtn && prevEditViewBtn.classList.contains("view-toggle")) {
    prevEditViewBtn.classList.remove("view-toggle");
  }
};

let exportDataToCSV = () => {
  let csvFile =
    "Sno, User, Location, Departmant, Role, Employee ID, Status, Join Dt \n";
  exportData.forEach((element, i) => {
    let arr = [];
    arr.push(i + 1);
    arr.push(element.firstname + " " + element.lastname);
    arr.push(element.location);
    arr.push(element.department);
    arr.push(element.role);
    arr.push(element.empno);
    arr.push(element.status);
    arr.push(element.joiningDate);
    csvFile += arr.join(",");
    csvFile += "\n";
  });
  let element = document.createElement("a");
  element.href = "data:text/csv;charset=utf-8," + encodeURI(csvFile);
  element.target = "_blank";
  element.download = "EmployeeData.csv";
  element.click();
};

let prevFilterButton;

let filterButtonsAdder = () => {
  let filterButtons = document.querySelector(".filter-buttons-wrapper");
  for (let i = 65; i <= 90; i++) {
    let element = document.createElement("button");
    element.innerText = String.fromCharCode(i);
    filterButtons?.append(element);
    element.addEventListener("click", () => {
      prevFilterButton ? prevFilterButton.classList.remove("active") : "";
      element.classList.add("active");
      prevFilterButton = element;
      let filterData = employees.filter((data) => {
        return data.firstname
          .toLowerCase()
          .startsWith(element.innerText.toLowerCase());
      });
      employeeFilteredData = filterData;
      displayTable(filterData);
    });
  }
};

filterButtonsAdder();

let removeFilter = (e, eve) => {
  if (prevFilterButton) prevFilterButton.classList.remove("active");
  displayTable();
  if (eve == "focus") {
    e.style.background = "rgb(234, 235, 238)";
    e.children[0].style.filter = "grayscale(100%)";
  } else {
    e.style.background = "";
    e.children[0].style.filter = "grayscale(0%)";
  }
};

let displayTable = (...data) => {
  if (data.length != 0) {
    displayTableData(...data);
  } else {
    displayTableData(employees);
  }
};

function sortData(key, ord) {
  let sorteddata = exportData.sort(function (a, b) {
    let a1, a2;
    if (key == "name") {
      a1 = a.firstname + " " + a.lastname;
      a2 = b.firstname + " " + b.lastname;
    } else {
      a1 = a[key];
      a2 = b[key];
    }
    a1 = a1.toLowerCase();
    a2 = a2.toLowerCase();
    if (ord == "asec") {
      return a1 > a2 ? 1 : -1;
    }
    return a1 > a2 ? -1 : 1;
  });
  displayTable(sorteddata);
}

displayTable();

let deleteButton = document.querySelector(".delete-modifier button");

deleteButton?.addEventListener("click", () => {
  let tableCheckbox = document.querySelectorAll("input.table-checkbox");
  let employeeCheckedDetails = [];
  tableCheckbox.forEach((element) => {
    if (element.checked)
      employeeCheckedDetails.push(
        element.parentNode.parentNode.parentNode.children[5].innerText
      );
  });
  let unDeletedEmployees = employees;
  employeeCheckedDetails.forEach((element) => {
    unDeletedEmployees = unDeletedEmployees.filter((emp) => {
      return element != emp.empno;
    });
  });
  let unDeletedFilteredEmployees = employeeFilteredData;
  employeeCheckedDetails.forEach((element) => {
    unDeletedFilteredEmployees = unDeletedFilteredEmployees.filter((emp) => {
      return element != emp.empno;
    });
  });
  employees = unDeletedEmployees;
  employeeFilteredData = unDeletedEmployees;
  displayTable(unDeletedFilteredEmployees);
  // setEmployeeData(unDeletedEmployees)
  employeeCheckBox();
});

let employeeCheckBox = (e) => {
  let tableCheckbox = document.querySelectorAll("input.table-checkbox");
  e &&
    tableCheckbox.forEach((element) => {
      if (e && e.checked) element.checked = true;
      else element.checked = false;
    });
  let flag = false;
  tableCheckbox.forEach((data) => {
    data.checked ? (flag = true) : "";
  });
  flag
    ? deleteButton.removeAttribute("disabled")
    : deleteButton.setAttribute("disabled", "true");
};

window.location.pathname != "/addEmployee.html"
  ? (localStorage.removeItem("mode"), localStorage.removeItem("empid"))
  : "";
