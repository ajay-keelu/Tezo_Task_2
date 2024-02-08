let showHideMenu = document.querySelector('img[alt="direction"]');
let sidebar = document.querySelector(".sidebar");
let addEmployee = document.querySelector(".form-add-employee");
let filterButtons = document.querySelectorAll(".filter-buttons-wrapper button");
showHideMenu.addEventListener("click", () => {
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
var tableEmployeeData = JSON.parse(
  localStorage.getItem("tableEmpData")
    ? localStorage.getItem("tableEmpData")
    : "[]"
);
var exportData;
let filterDropdown = {};
let EmployDropdown = (value, key) => {
  filterDropdown[key] = value;
};
let applyEmployeeFilter = () => {
  let filteredData = [];
  tableEmployeeData.forEach((ele) => {
    let flag = true;
    for (let key in filterDropdown) {
      if (filterDropdown[key] && ele[key] != filterDropdown[key]) flag = false;
    }
    if (flag) filteredData.push(ele);
  });
  displayTable(filteredData);
};
let removeEmployeeFilter = () => {
  filterDropdown = {};
  displayTable(tableEmployeeData);
};
let formDataEmployee = { status: "Active" };
let requiredFields = ["empno", "firstname", "lastname", "email", "joiningDate"];
let changeData = (value, name) => {
  formDataEmployee[name] = value;
};
let validateEmail = (email) => {
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
};
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

addEmployee?.addEventListener("click", (e) => {
  e.preventDefault();
  let flag = false;
  validateEmail(formDataEmployee["email"]);
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
        span.innerHTML = `<b class="exclamation"><b>!</b></b> this field is required`;
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
  tableEmployeeData.push(emp);
  localStorage.setItem("tableEmpData", JSON.stringify(tableEmployeeData));
  alert("added successful");
  formDataEmployee = { status: "Active" };
  window.location.reload();
});
let displayTableData = (data) => {
  exportData = data;
  let innerData = ` 
          <tr>
            <td>
              <div class="table-check-box">
                <input type="checkbox" />
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
              <div class="user-modification">
                <i class="fa-solid fa-ellipsis"></i>
              </div>
            </td>
          </tr>`;
  data.forEach((ele) => {
    innerData += ` 
        <tr>
          <td>
            <div class="table-check-box">
              <input type="checkbox" class="table-checkbox" />
            </div>
          </td>
          <td>
            <div class="user-profile-card">
              <div class="profile-img">
                <img
                  src="${ele.image ? ele.image : "/images/user-profile.jpg"}"
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
            <button onclick="editOrView(this)" onblur="editOrHide(this)"><i class="fa-solid fa-ellipsis"></i></button>
            <div>
              <span>View&nbsp;Details </span>
              <span>Edit </span>
              <span>Delete</span>
            </div>
          </td>
        </tr>`;
  });
  let employeeTableData = document.querySelector("#employee-table-data");
  if (data.length == 0)
    employeeTableData.innerHTML =
      innerData +
      `<td colspan="9" style="text-align:center">no data found</td>`;
  else employeeTableData.innerHTML = innerData;
};
let prevEditViewBtn;
let editOrView = (e) => {
  e = e.parentNode;
  if (prevEditViewBtn && prevEditViewBtn == e) {
    prevEditViewBtn.classList.toggle("view-toggle");
    return;
  }
  if (prevEditViewBtn && prevEditViewBtn.classList.contains("view-toggle"))
    prevEditViewBtn.classList.remove("view-toggle");
  e.classList.add("view-toggle");
  prevEditViewBtn = e;
};
let editOrHide = (e) => {
  e = e.parentNode;
  if (e.classList.contains("view-toggle")) e.classList.remove("view-toggle");
};
let exportDataToCSV = () => {
  let csvFile = "User, Location, Departmant, Role, Emp No, Join Dt \n";
  exportData.forEach((ele) => {
    let arr = [];
    arr.push(ele.firstname + " " + ele.lastname);
    arr.push(ele.location);
    arr.push(ele.department);
    arr.push(ele.role);
    arr.push(ele.empno);
    arr.push(ele.joiningDate);
    csvFile += arr.join(",");
    csvFile += "\n";
  });
  let element = document.createElement("a");
  element.href = "data:text/csv;charset=utf-8," + encodeURI(csvFile);
  element.target = "_blank";
  element.download = "data.csv";
  element.click();
};

let displayTable = (...data) => {
  if (data.length != 0) {
    displayTableData(...data);
  } else {
    displayTableData(tableEmployeeData);
  }
};
let prevFilterButton;
filterButtons.forEach((ele) => {
  ele.addEventListener("click", () => {
    if (prevFilterButton) prevFilterButton.classList.remove("active");
    ele.classList.add("active");
    prevFilterButton = ele;
    let filterData = tableEmployeeData.filter((data) => {
      return data.firstname
        .toLowerCase()
        .startsWith(ele.innerText.toLowerCase());
    });
    displayTable(filterData);
  });
});
let sortData = (key, ord) => {
  let sorteddata = tableEmployeeData.sort(function (a, b) {
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
let tableCheckbox = document.querySelectorAll(".table-checkbox");
let deleteButton = document.querySelector(".delete-modifier button");
deleteButton.addEventListener("click", () => {
  console.log("hello");
});
tableCheckbox.forEach((ele) => {
  ele.addEventListener("change", () => {
    let flag = false;
    tableCheckbox.forEach((data) => {
      if (data.checked) flag = true;
    });
    if (flag) {
      deleteButton.removeAttribute("disabled");
    } else {
      deleteButton.setAttribute("disabled", "true");
    }
  });
});
