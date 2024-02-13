let inputEmployeeSearch = document.querySelector(
  '.assign-employees input[name="employee-search"]'
);
function getEmployeeData() {
  return JSON.parse(localStorage.getItem("EmployeeData")) || [];
}
function setEmployeeData(data) {
  localStorage.setItem("EmployeeData", JSON.stringify(data));
}
let allEmployeeData = getEmployeeData();
inputEmployeeSearch?.addEventListener("focus", (e) => {
  document.querySelector(".search-employee-data").style.display = "flex";
  let filterArray = [];
  if (e.target.value) {
    allEmployeeData.forEach((ele) => {
      let name = ele.firstname + ele.lastname;
      if (name.toLowerCase().includes(e.target.value.toLowerCase()))
        filterArray.push(ele);
    });
  }
  displayEmployeeSearchData(filterArray);
});
inputEmployeeSearch?.addEventListener("keyup", (e) => {
  let filterArray = [];
  if (e.target.value) {
    allEmployeeData.forEach((ele) => {
      let name = ele.firstname + ele.lastname;
      if (name.toLowerCase().includes(e.target.value.toLowerCase()))
        filterArray.push(ele);
    });
  }
  displayEmployeeSearchData(filterArray);
});
inputEmployeeSearch?.addEventListener("blur", (e) => {
  if (!e.target.value) {
    document.querySelector(".search-employee-data").style.display = "none";
  }
});
document.querySelector('img[alt="direction"]').addEventListener("click", () => {
  sidebar.classList.toggle("sidebar-toggle");
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
function displayEmployeeSearchData(data) {
  let empData = "";
  data.forEach((ele) => {
    empData += `
<label for="emp${ele.empno}" class="employee-card">
  <div  class="profile">
    <div class="profile-image">
      <img
        src="${ele.image ? ele.image : "images/user-profile.jpg"}"
        width="23px"
        alt="profile"
      />
    </div>
    <div class="name">${ele.firstname + " " + ele.lastname}</div>
  </div>
  <input type="checkbox" onchange="addingRoleToEmployee(${ele.empno})" id="emp${
      ele.empno
    }" ${ele.isCheckedRole ? "checked" : ""} />
</label>`;
  });
  document.querySelector(".search-employee-data").innerHTML = empData;
}
let removeFromEmployeeBubble = (empno) => {
  let employee = document.querySelector(`.employee-card #emp${empno}`);
  employee ? (employee.checked = false) : "";
  allEmployeeData.forEach((ele) => {
    if (ele.empno == empno) ele.isCheckedRole = false;
  });
  displayEmployeeRoleBubble();
};
function displayEmployeeRoleBubble() {
  let employeeBubble = document.querySelector(".employee-bubble");
  employeeBubble.innerHTML = "";
  let flag = true;
  allEmployeeData.forEach((ele) => {
    if (ele.isCheckedRole && ele.isCheckedRole == true) {
      flag = false;
      employeeBubble.innerHTML += `<div class="employee-card">
        <img
          src=${ele.image ? ele.image : "images/user-profile.jpg"}
          alt="profile"
        />
        <div class="name">${ele.firstname}</div>
        <button onclick="removeFromEmployeeBubble(${
          ele.empno
        })">&times;</button>
      </div>`;
    }
  });
  if (flag) employeeBubble.style.display = "none";
  else employeeBubble.style.display = "flex";
}
let addingRoleToEmployee = (empno) => {
  allEmployeeData.forEach((ele) => {
    if (ele.empno == empno) {
      if (document.querySelector(`.employee-card #emp${empno}`).checked)
        ele.isCheckedRole = true;
      else ele.isCheckedRole = false;
    }
  });
  displayEmployeeRoleBubble();
};
var exportData;
let filterDropdown = {};
let EmployDropdown = (value, key) => {
  filterDropdown[key] = value;
};
function applyEmployeeFilter() {
  let filteredData = [];
  allEmployeeData.forEach((ele) => {
    let flag = true;
    for (let key in filterDropdown) {
      if (filterDropdown[key] && ele[key] != filterDropdown[key]) flag = false;
    }
    if (flag) filteredData.push(ele);
  });
  displayTable(filteredData);
}
let removeEmployeeFilter = () => {
  filterDropdown = {};
  displayTable(allEmployeeData);
};
let formDataEmployee = { status: "Active" };
let changeData = (value, name) => {
  formDataEmployee[name] = value;
};
function validateEmail(email) {
  if (!email) return;
  let ele = document.querySelector(
    `.employee-information .input-form-element[name="email"]`
  );
  let spanCheck = document.querySelector(
    `.employee-information .input-form-element[name="email"]+span[name="email"]`
  );
  if (!email.includes("@") || !email.includes(".")) {
    if (spanCheck) {
      spanCheck.innerText = "email must contains @ and .";
      console.log(spanCheck);
    } else {
      let span = document.createElement("span");
      span.setAttribute("name", "email");
      ele.parentNode.appendChild(span);
      span.innerHTML = `<b class="exclamation"><b>!</b></b> please enter valid email address`;
    }
    return;
  }
  if (email.indexOf("@") > email.lastIndexOf(".")) {
    if (spanCheck) {
      spanCheck.innerText = "@ must comes before .";
    } else {
      let span = document.createElement("span");
      span.setAttribute("name", "email");
      ele.parentNode.appendChild(span);
      span.innerHTML = `<b class="exclamation"><b>!</b></b> please enter valid email address`;
    }
    return;
  }
  if (email.includes("..")) {
    if (spanCheck) {
      spanCheck.innerHTML = `<b class="exclamation"><b>!</b></b> email doesnot contain .. `;
    } else {
      let span = document.createElement("span");
      span.setAttribute("name", "email");
      ele.parentNode.appendChild(span);
      span.innerHTML = `<b class="exclamation"><b>!</b></b> please enter valid email address`;
    }
    return;
  }
  return true;
}
let imageChange = (imagedata) => {
  let imageWrapper = document.querySelector(".left-wrapper .img-wrapper img");
  let file = imagedata.files[0];
  let reader = new FileReader(file);
  reader.readAsDataURL(file);
  reader.onload = () => {
    imageWrapper.src = reader.result;
    formDataEmployee["image"] = reader.result;
  };
  reader.onerror = () => {
    alert("Please upload the image again!");
  };
};
let requiredFields = ["empno", "firstname", "lastname", "email", "joiningDate"];
let addEmployee = document.querySelector(".form-add-employee");
addEmployee?.addEventListener("click", (e) => {
  e.preventDefault();
  let flag = false;
  for (let field of requiredFields) {
    let spanCheck = document.querySelector(
      `.input-form-element+span[name="${field}"]`
    );
    let ele = document.querySelector(`.input-form-element[name="${field}"]`);
    if (!formDataEmployee[field]) {
      let span = document.createElement("span");
      span.setAttribute("name", field);
      if (!spanCheck) {
        ele.parentNode.appendChild(span);
        span.innerHTML = `<b class="exclamation"><b>!</b></b> <b style="text-transform:capitalize">${field}</b> field is required`;
      }
      flag = true;
    } else {
      if (spanCheck) ele.parentNode.removeChild(spanCheck);
    }
  }

  if (flag) return;

  flag = validateEmail(formDataEmployee["email"]);

  if (!flag) return;

  let emp = new Employee(
    formDataEmployee.image,
    formDataEmployee.firstname,
    formDataEmployee.lastname,
    formDataEmployee.email,
    formDataEmployee.location,
    formDataEmployee.department,
    formDataEmployee.jobTitle,
    formDataEmployee.empno,
    formDataEmployee.status,
    formDataEmployee.joiningDate
  );

  let employeeData = getEmployeeData();
  employeeData.push(emp);
  setEmployeeData(employeeData);
  alert("added successful");
  formDataEmployee = { status: "Active" };
  document.querySelector("#employeeForm").reset();
  let imageWrapper = document.querySelector(".left-wrapper .img-wrapper img");
  imageWrapper.src = "images/user-profile.jpg";
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
  data.forEach((ele) => {
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
                  src="${ele.image ? ele.image : "images/user-profile.jpg"}"
                  alt="user-profile"
                  height="30px"
                />
              </div>
              <div class="profile-description">
                <div class="name">${ele.firstname + " " + ele.lastname}</div>
                <div class="email">${ele.email}</div>
              </div>
            </div>
          </td>
          <td>${ele.location}</td>
          <td>${ele.department}</td>
          <td>${ele.role}</td>
          <td>${ele.empno}</td>
          <td>
            <button class="active" style="text-transform:capitalize" title="status">${
              ele.status
            }</button>
          </td>
          <td>${ele.joiningDate}</td>
          <div>
          <td class="view-edit">
            <button onclick="editOrView(this)" onblur="editOrHide(this,${
              ele.empno
            })">
                <i class="fa-solid fa-ellipsis"></i>
            </button>
            <div>
              <span>View&nbsp;Details </span>
              <span>Edit </span>
              <span class="delete" id="emp-${ele.empno}">Delete</span>
            </div>
          </td>
        </tr>`;
  });

  let employeeTableData = document.querySelector("#employee-table-data");
  if (data.length == 0 && employeeTableData)
    employeeTableData.innerHTML =
      innerData +
      `<td colspan="9" style="text-align:center; padding:15px 0px">No data found</td>`;
  else {
    if (employeeTableData) employeeTableData.innerHTML = innerData;
  }
}
let prevEditViewBtn;
var tableDataDelete;
let editOrView = (e) => {
  e = e.parentNode;
  if (prevEditViewBtn && prevEditViewBtn == e) {
    prevEditViewBtn.classList.toggle("view-toggle");
    tableDataDelete = document.querySelector(".view-toggle div .delete");
    return;
  }
  if (prevEditViewBtn && prevEditViewBtn.classList.contains("view-toggle")) {
    prevEditViewBtn.classList.remove("view-toggle");
  }
  e.classList.add("view-toggle");
  tableDataDelete = document.querySelector(".view-toggle div .delete");
  prevEditViewBtn = e;
};
let editOrHide = (e, empno) => {
  e = e.parentNode;
  let tableDataDelete = document.querySelector(`span#emp-${empno}`);
  tableDataDelete.addEventListener("click", () => {
    let filterArray = allEmployeeData.filter((ele) => {
      return ele.empno != empno;
    });
    allEmployeeData = filterArray;
    displayTable(filterArray);
  });
};
let exportDataToCSV = () => {
  let csvFile = "User, Location, Departmant, Role, Emp No, Status, Join Dt \n";
  exportData.forEach((ele) => {
    let arr = [];
    arr.push(ele.firstname + " " + ele.lastname);
    arr.push(ele.location);
    arr.push(ele.department);
    arr.push(ele.role);
    arr.push(ele.empno);
    arr.push(ele.status);
    arr.push(ele.joiningDate);
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
    let ele = document.createElement("button");
    ele.innerText = String.fromCharCode(i);
    filterButtons?.append(ele);
    ele.addEventListener("click", () => {
      if (prevFilterButton) prevFilterButton.classList.remove("active");
      ele.classList.add("active");
      prevFilterButton = ele;
      let filterData = allEmployeeData.filter((data) => {
        return data.firstname
          .toLowerCase()
          .startsWith(ele.innerText.toLowerCase());
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
    displayTableData(allEmployeeData);
  }
};
let sortData = (key, ord) => {
  let sorteddata = allEmployeeData.sort(function (a, b) {
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
};
displayTable();
let deleteButton = document.querySelector(".delete-modifier button");
deleteButton?.addEventListener("click", () => {
  let tableCheckbox = document.querySelectorAll("input.table-checkbox");
  let employeeCheckedDetails = [];
  tableCheckbox.forEach((ele) => {
    if (ele.checked)
      employeeCheckedDetails.push(
        ele.parentNode.parentNode.parentNode.children[5].innerText
      );
  });
  let unDeletedEmployees = allEmployeeData;
  employeeCheckedDetails.forEach((ele) => {
    unDeletedEmployees = unDeletedEmployees.filter((emp) => {
      return ele != emp.empno;
    });
  });
  allEmployeeData = unDeletedEmployees;
  displayTable(unDeletedEmployees);
  employeeCheckBox();
});
let employeeCheckBox = (e) => {
  let tableCheckbox = document.querySelectorAll("input.table-checkbox");
  e &&
    tableCheckbox.forEach((ele) => {
      if (e && e.checked) ele.checked = true;
      else ele.checked = false;
    });
  let flag = false;
  tableCheckbox.forEach((data) => {
    if (data.checked) flag = true;
  });
  if (flag) {
    deleteButton.removeAttribute("disabled");
  } else {
    deleteButton.setAttribute("disabled", "true");
  }
};
