function getEmployeeData() {
  return JSON.parse(localStorage.getItem("EmployeeData")) || [];
}
function setEmployeeData(data) {
  localStorage.setItem("EmployeeData", JSON.stringify(data));
}
function getEmployeeById(id) {
  return getEmployeeData().find((employee) => employee.empno == id);
}
let urlData = window.location.search.slice(1);
empid = urlData.slice(3)
mode = localStorage.getItem('mode') || []
var formEmployee = { status: "Active", image: "images/user-profile.jpg" }
if ((mode == "view" || mode == "edit") && !empid) {
  alert("Employee not Found")
  window.location = "index.html";
}
mode == "view" && empid ? viewPage(empid) : mode == "edit" && empid ? editPage(empid) : ""
let changeData = (value, name) => {
  formEmployee[name] = value;
};
class Employee {
  constructor(image, firstname, lastname, email, location, department, dob, mobile, role, empno, status, joiningDate, assignManager, assignProject) {
    this.image = image;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.empno = empno;
    this.location = location;
    this.mobile = mobile;
    this.dob = dob;
    this.department = department;
    this.status = status;
    this.role = role;
    this.joiningDate = joiningDate;
    this.assignManager = assignManager;
    this.assignProject = assignProject;
  }
}
function validateEmail(email) {
  pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  let element = document.querySelector(`.employee-information .input-form-element[name="email"]`);
  let spanElement = document.querySelector(`.employee-information .input-form-element[name="email"]+span[name="email"]`);
  if (!pattern.test(email)) {
    if (spanElement) {
      spanElement.innerHTML = `<b class="exclamation"><b>!</b></b> please enter valid email address`;
    } else {
      let span = document.createElement("span");
      span.setAttribute("name", "email");
      element.parentNode.appendChild(span);
      span.innerHTML = `<b class="exclamation"><b>!</b></b> please enter field is required`;
    }
    return;
  }
  spanElement ? element.parentNode.removeChild(spanElement) : "";
  return true;
}
function validateFirstname(name) {
  let element = document.querySelector(`.employee-information .input-form-element[name="firstname"]`);
  let spanElement = document.querySelector(`.employee-information .input-form-element[name="firstname"]+span[name="firstname"]`);
  if (!name || name.length <= 3) {
    if (spanElement) {
      spanElement.innerHTML = `<b class="exclamation"><b>!</b></b> length should be greater then three`;
    } else {
      let span = document.createElement("span");
      span.setAttribute("name", "firstname");
      element.parentNode.appendChild(span);
      span.innerHTML = `<b class="exclamation"><b>!</b></b> length should be greater then three`;
    }
    return;
  }
  spanElement ? element.parentNode.removeChild(spanElement) : "";
  return true;
}
function validateEmployeeNumber(empno) {
  let element = document.querySelector(`.employee-information .input-form-element[name="empno"]`);
  let spanElement = document.querySelector(`.employee-information .input-form-element[name="empno"]+span[name="empno"]`);
  let employee = employees.find((ele) => ele.empno == empno);
  if (employee) {
    if (spanElement) {
      spanElement.innerHTML = `<b class="exclamation"><b>!</b></b> employee number already exists`;
    } else {
      let span = document.createElement("span");
      span.setAttribute("name", "empno");
      element.parentNode.appendChild(span);
      span.innerHTML = `<b class="exclamation"><b>!</b></b> employee number already exists`;
    }
    return;
  }
  spanElement ? element.parentNode.removeChild(spanElement) : "";
  return true;
}
function imageChange(imagedata) {
  let reader = new FileReader(imagedata.files[0]);
  reader.readAsDataURL(imagedata.files[0]);
  reader.onload = () => {
    document.querySelector(".left-wrapper .img-wrapper img").src = reader.result;
    formEmployee["image"] = reader.result;
  };
  reader.onerror = () => alert("Please upload the image again!");
};
function resetForm() {
  mode == "edit" ? window.location.reload() : "";
  document.querySelector("#employeeForm").reset();
  document.querySelector(".left-wrapper .img-wrapper img").src = "images/user-profile.jpg";
  for (let field of requiredFields) {
    let spanElement = document.querySelector(`.input-form-element+span[name="${field}"]`);
    let element = document.querySelector(`.input-form-element[name="${field}"]`);
    spanElement ? element.parentNode.removeChild(spanElement) : "";
  }
}
let requiredFields = ["empno", "email", "firstname", "lastname", "joiningDate"];
document.querySelector(".form-add-employee").addEventListener("click", (e) => {
  e.preventDefault();
  let flag = false;
  for (let field of requiredFields) {
    let spanElement = document.querySelector(`.input-form-element+span[name="${field}"]`);
    let element = document.querySelector(`.input-form-element[name="${field}"]`);
    if (!formEmployee[field]) {
      let span = document.createElement("span");
      span.setAttribute("name", field);
      if (!spanElement) {
        element.parentNode.appendChild(span);
        span.innerHTML = `<b class="exclamation"><b>!</b></b> <b style="text-transform:capitalize">${field}</b> field is required`;
      } else spanElement.innerHTML = `<b class="exclamation"><b>!</b></b> <b style="text-transform:capitalize">${field}</b> field is required`; flag = true;
    } else {
      let val = true;
      if (field == "email") val = validateEmail(formEmployee["email"]);
      else if (field == "firstname")
        val = validateFirstname(formEmployee["firstname"]);
      else if (mode != "edit" && field == "empno")
        val = validateEmployeeNumber(formEmployee["empno"]);
      else {
        if (spanElement) element.parentNode.removeChild(spanElement);
      }
      !val ? flag = true : "";
    }
  }
  if (flag) return;
  let employee = new Employee(formEmployee.image, formEmployee.firstname, formEmployee.lastname, formEmployee.email, formEmployee.location, formEmployee.department,
    formEmployee.dob, formEmployee.mobile, formEmployee.jobTitle, formEmployee.empno, formEmployee.status, formEmployee.joiningDate, formEmployee.assignManager, formEmployee.assignProject);
  let employeeData = getEmployeeData();
  mode != "edit" ? employeeData.push(employee) : (employeeData = replaceEmployee(employeeData, formEmployee));
  setEmployeeData(employeeData);
  formEmployee = { status: "Active", image: "images/user-profile.jpg" };
  toastToggle(mode != "edit" ? "Employee Added Successfully" : "Updated Successfully");
  setTimeout(() => {
    toastToggle("");
    mode == "edit" ? (localStorage.setItem('mode', 'view'), window.location.reload()) : ""
    resetForm();
  }, 1500);
});
function toastToggle(message) {
  document.querySelector(".toast").classList.toggle("toast-toggle");
  document.querySelector(".toast .message").innerText = message;
}
function replaceEmployee(employeeData, employee) {
  let index;
  for (let i = 0; i < employeeData.length; i++) {
    if (employeeData[i].empno == employee.empno) {
      index = i;
      break;
    }
  }
  employeeData[index] = employee;
  return employeeData;
}
function editPage(id) {
  let editEmployee = getEmployeeById(id);
  if (!editEmployee) {
    alert("Employee not Found")
    window.location = "index.html"
  }
  formEmployee = editEmployee;
  document.querySelector(".left-wrapper .img-wrapper img").src = editEmployee.image;
  document.querySelector(".employee-details > .title").innerText = "Edit Employee";
  document.querySelector(`input[name="empno"]`).value = editEmployee.empno;
  document.querySelector(`input[name="empno"]`).disabled = "true";
  document.querySelector(`input[name="firstname"]`).value = editEmployee.firstname;
  document.querySelector(`input[name="lastname"]`).value = editEmployee.lastname;
  document.querySelector(`input[name="dob"]`).value = editEmployee.dob ? editEmployee.dob : "";
  document.querySelector(`input[name="email"]`).value = editEmployee.email;
  document.querySelector(`input[name="mobile"]`).value = editEmployee.mobile ? editEmployee.mobile : "";
  document.querySelector(`input[name="joiningDate"]`).value = editEmployee.joiningDate;
  document.querySelector(`select[name="location"]`).value = editEmployee.location ? editEmployee.location : "";
  document.querySelector(`select[name="jobTitle"]`).value = editEmployee.role ? editEmployee.role : "";
  document.querySelector(`select[name="department"]`).value = editEmployee.department ? editEmployee.department : "";
  document.querySelector(`select[name="assignManager"]`).value = editEmployee.assignManager ? editEmployee.assignManager : "";
  document.querySelector(`select[name="assignProject"]`).value = editEmployee.assignProject ? editEmployee.assignProject : "";
  document.querySelector(".employment-information .btn-wrapper .add-employee button").innerText = "Update";
}
function viewPage(id) {
  let viewEmployee = getEmployeeById(id);
  if (!viewEmployee) {
    alert("Employee not Found")
    window.location = "index.html"
  }
  let editOrDelete = document.querySelector("#editOrDelete");
  let editButton = document.createElement('button')
  editButton.classList.add('edit')
  editButton.innerHTML = 'Edit'
  editButton.addEventListener('click', (e) => {
    e.preventDefault()
    localStorage.setItem("mode", "edit")
    window.location.reload()
  })
  let deleteButton = document.createElement('button')
  deleteButton.classList.add('delete')
  deleteButton.innerHTML = 'Delete'
  deleteButton.addEventListener('click', (e) => {
    e.preventDefault()
    let employees = getEmployeeData();
    employees = employees.filter((employee) => employee.empno != id);
    setEmployeeData(employees);
    window.location = "index.html";
  })
  editOrDelete.append(editButton, deleteButton);
  document.querySelector(".left-wrapper .img-wrapper img").src = viewEmployee.image
  document.querySelector(".employee-details > .title").innerText = "View Employee";
  document.querySelector(`input[name="empno"]`).value = viewEmployee.empno;
  document.querySelector(`input[name="empno"]`).disabled = "true";
  document.querySelector(`input[name="firstname"]`).value = viewEmployee.firstname;
  document.querySelector(`input[name="firstname"]`).disabled = "true";
  document.querySelector(`input[name="lastname"]`).value = viewEmployee.lastname;
  document.querySelector(`input[name="lastname"]`).disabled = "true";
  document.querySelector(`input[name="dob"]`).value = viewEmployee.dob ? viewEmployee.dob : "";
  document.querySelector(`input[name="dob"]`).disabled = "true";
  document.querySelector(`input[name="email"]`).value = viewEmployee.email;
  document.querySelector(`input[name="email"]`).disabled = "true";
  document.querySelector(`label[for="file"]`).style.display = "none";
  document.querySelector(`input[name="mobile"]`).value = viewEmployee.mobile ? viewEmployee.mobile : "";
  document.querySelector(`input[name="mobile"]`).disabled = "true";
  document.querySelector(`input[name="joiningDate"]`).value = viewEmployee.joiningDate;
  document.querySelector(`input[name="joiningDate"]`).disabled = "true";
  document.querySelector(`select[name="location"]`).value = viewEmployee.location ? viewEmployee.location : "";
  document.querySelector(`select[name="location"]`).disabled = "true";
  document.querySelector(`select[name="jobTitle"]`).value = viewEmployee.role ? viewEmployee.role : "";
  document.querySelector(`select[name="jobTitle"]`).disabled = "true";
  document.querySelector(`select[name="department"]`).value = viewEmployee.department ? viewEmployee.department : "";
  document.querySelector(`select[name="department"]`).disabled = "true";
  document.querySelector(`select[name="assignManager"]`).value = viewEmployee.assignManager ? viewEmployee.assignManager : "";
  document.querySelector(`select[name="assignManager"]`).disabled = "true";
  document.querySelector(`select[name="assignProject"]`).value = viewEmployee.assignProject ? viewEmployee.assignProject : "";
  document.querySelector(`select[name="assignProject"]`).disabled = "true";
  document.querySelector(".employment-information .btn-wrapper").style.display = "none";
}