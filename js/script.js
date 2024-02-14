let inputEmployeeSearch = document.querySelector(
  '.assign-employees input[name="employee-search"]'
);
function getEmployeeData() {
  return JSON.parse(localStorage.getItem("EmployeeData")) || [];
}
function setEmployeeData(data) {
  localStorage.setItem("EmployeeData", JSON.stringify(data));
}
let employees = getEmployeeData();
inputEmployeeSearch?.addEventListener("keyup", (e) => {
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
});
inputEmployeeSearch?.addEventListener("blur", (e) => {
  if (!e.target.value) {
    document.querySelector(".search-employee-data").style.display = "none";
  }
});
document.querySelector('img[alt="direction"]').addEventListener("click", () => {
  document.querySelector(".sidebar").classList.toggle("sidebar-toggle");
});
class Employee {
  constructor(
    image,
    firstname,
    lastname,
    email,
    location,
    department,
    role,
    empno,
    status,
    joiningDate
  ) {
    this.image = image;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.empno = empno;
    this.location = location;
    this.department = department;
    this.status = status;
    this.role = role;
    this.joiningDate = joiningDate;
  }
}
function displayEmployee(data) {
  let empData = "";
  data.forEach((element) => {
    empData += `
<label for="emp${element.empno}" class="employee-card">
  <div  class="profile">
    <div class="profile-image">
      <img
        src="${element.image ? element.image : "images/user-profile.jpg"}"
        width="23px"
        alt="profile"
      />
    </div>
    <div class="name">${element.firstname + " " + element.lastname}</div>
  </div>
  <input type="checkbox" onchange="addingRoleToEmployee(${
    element.empno
  })" id="emp${element.empno}" ${element.isCheckedRole ? "checked" : ""} />
</label>`;
  });
  document.querySelector(".search-employee-data").innerHTML = empData;
}
let removeFromEmployeeBubble = (empno) => {
  let employee = document.querySelector(`.employee-card #emp${empno}`);
  employee ? (employee.checked = false) : "";
  employees.forEach((element) => {
    element.empno == empno ? (element.isCheckedRole = false) : "";
  });
  displayEmployeeRoleBubble();
};
function displayEmployeeRoleBubble() {
  let employeeBubble = document.querySelector(".employee-bubble");
  employeeBubble.innerHTML = "";
  let flag = true;
  employees.forEach((element) => {
    if (element.isCheckedRole) {
      flag = false;
      employeeBubble.innerHTML += `<div class="employee-card">
        <div>
          <img
            src=${element.image ? element.image : "images/user-profile.jpg"}
            alt="profile"
          />
          <div class="name">${element.firstname}</div>
        </div>
        <button onclick="removeFromEmployeeBubble(${
          element.empno
        })">&times;</button>
      </div>`;
    }
  });
  employeeBubble.style.display = flag ? "none" : "flex";
  inputEmployeeSearch.style.minWidth = flag ? "100%" : "calc(100% - 147px)";
  employeeBubble.style.maxWidth = flag ? "0" : "fit-content";
}
let addingRoleToEmployee = (empno) => {
  employees.forEach((employee) => {
    if (employee.empno == empno) {
      document.querySelector(`.employee-card #emp${empno}`).checked
        ? (employee.isCheckedRole = true)
        : (employee.isCheckedRole = false);
    }
  });
  displayEmployeeRoleBubble();
};
var exportData;
let filterDropdown = {};
let EmployeeDropdown = (value, key) => {
  filterDropdown[key] = value;
};
function applyEmployeeFilter() {
  let filteredData = [];
  employees.forEach((element) => {
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
  displayTable(employees);
};
let formEmployee = { status: "Active" };
let changeData = (value, name) => {
  formEmployee[name] = value;
};
function validateEmail(email) {
  pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  let element = document.querySelector(
    `.employee-information .input-form-element[name="email"]`
  );
  let spanCheck = document.querySelector(
    `.employee-information .input-form-element[name="email"]+span[name="email"]`
  );
  if (!pattern.test(email)) {
    if (spanCheck) {
      spanCheck.innerHTML = `<b class="exclamation"><b>!</b></b> please enter valid email address`;
    } else {
      let span = document.createElement("span");
      span.setAttribute("name", "email");
      element.parentNode.appendChild(span);
      span.innerHTML = `<b class="exclamation"><b>!</b></b> please enter field is required`;
    }
    return;
  }
  element.parentNode.removeChild(spanCheck);
  return true;
}
function validateFirstname(name) {
  let element = document.querySelector(
    `.employee-information .input-form-element[name="firstname"]`
  );
  let spanCheck = document.querySelector(
    `.employee-information .input-form-element[name="firstname"]+span[name="firstname"]`
  );
  if (name.length <= 3) {
    if (spanCheck) {
      spanCheck.innerHTML = `<b class="exclamation"><b>!</b></b> length should be greater then three`;
    } else {
      let span = document.createElement("span");
      span.setAttribute("name", "firstname");
      element.parentNode.appendChild(span);
      span.innerHTML = `<b class="exclamation"><b>!</b></b> length should be greater then three`;
    }
    return;
  }
  element.parentNode.removeChild(spanCheck);
  return true;
}
let imageChange = (imagedata) => {
  let imageWrapper = document.querySelector(".left-wrapper .img-wrapper img");
  let file = imagedata.files[0];
  let reader = new FileReader(file);
  reader.readAsDataURL(file);
  reader.onload = () => {
    imageWrapper.src = reader.result;
    formEmployee["image"] = reader.result;
  };
  reader.onerror = () => {
    alert("Please upload the image again!");
  };
};
let requiredFields = ["empno", "email", "firstname", "lastname", "joiningDate"];
let addEmployee = document.querySelector(".form-add-employee");
addEmployee?.addEventListener("click", (e) => {
  e.preventDefault();
  let flag = false;
  for (let field of requiredFields) {
    let spanCheck = document.querySelector(
      `.input-form-element+span[name="${field}"]`
    );
    let element = document.querySelector(
      `.input-form-element[name="${field}"]`
    );
    if (!formEmployee[field]) {
      let span = document.createElement("span");
      span.setAttribute("name", field);
      if (!spanCheck) {
        element.parentNode.appendChild(span);
        span.innerHTML = `<b class="exclamation"><b>!</b></b> <b style="text-transform:capitalize">${field}</b> field is required`;
      } else {
        spanCheck.innerHTML = `<b class="exclamation"><b>!</b></b> <b style="text-transform:capitalize">${field}</b> field is required`;
      }
      flag = true;
    } else {
      if (field != "email" && field != "firstname") {
        if (spanCheck) element.parentNode.removeChild(spanCheck);
      } else {
        let val = validateFirstname(formEmployee["firstname"]);
        val = validateEmail(formEmployee["email"]);
        if (!val) return;
      }
    }
  }
  if (flag) return;
  let employee = new Employee(
    formEmployee.image,
    formEmployee.firstname,
    formEmployee.lastname,
    formEmployee.email,
    formEmployee.location,
    formEmployee.department,
    formEmployee.jobTitle,
    formEmployee.empno,
    formEmployee.status,
    formEmployee.joiningDate
  );
  let employeeData = getEmployeeData();
  employeeData.push(employee);
  setEmployeeData(employeeData);
  formEmployee = { status: "Active" };
  toastToggle();
  setTimeout(() => {
    toastToggle();
    document.querySelector("#employeeForm").reset();
    let imageWrapper = document.querySelector(".left-wrapper .img-wrapper img");
    imageWrapper.src = "images/user-profile.jpg";
  }, 1500);
});
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
            })" onblur="editOrHide()">
                <i class="fa-solid fa-ellipsis"></i>
                <div>
                  <span>View&nbsp;Details </span>
                  <span>Edit </span>
                  <span class="delete" id="emp-${element.empno}">Delete</span>
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
  let tableDataDelete = document.querySelector(`span#emp-${empno}`);
  tableDataDelete?.addEventListener("click", () => {
    let filterArray = employees.filter((element) => {
      return element.empno != empno;
    });
    employees = filterArray;
    displayTable(filterArray);
    return;
  });
  if (prevEditViewBtn && prevEditViewBtn == e) {
    prevEditViewBtn.classList.toggle("view-toggle");
    return;
  }
  if (prevEditViewBtn && prevEditViewBtn.classList.contains("view-toggle")) {
    prevEditViewBtn.classList.remove("view-toggle");
  }
  e.classList.add("view-toggle");
  tableDataDelete = document.querySelector(".view-toggle div .delete");
  prevEditViewBtn = e;
};
let editOrHide = () => {
  if (prevEditViewBtn && prevEditViewBtn.classList.contains("view-toggle")) {
    prevEditViewBtn.classList.remove("view-toggle");
  }
};
let exportDataToCSV = () => {
  let csvFile = "User, Location, Departmant, Role, Emp No, Status, Join Dt \n";
  exportData.forEach((element) => {
    let arr = [];
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
      if (prevFilterButton) prevFilterButton.classList.remove("active");
      element.classList.add("active");
      prevFilterButton = element;
      let filterData = employees.filter((data) => {
        return data.firstname
          .toLowerCase()
          .startsWith(element.innerText.toLowerCase());
      });
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
  let sorteddata = employees.sort(function (a, b) {
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
  employees = unDeletedEmployees;
  displayTable(unDeletedEmployees);
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
function toastToggle() {
  document.querySelector(".toast").classList.toggle("toast-toggle");
}
