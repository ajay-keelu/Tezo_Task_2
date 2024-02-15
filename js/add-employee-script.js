function getEmployeeData() {
  return JSON.parse(localStorage.getItem("EmployeeData")) || [];
}

function setEmployeeData(data) {
  localStorage.setItem("EmployeeData", JSON.stringify(data));
}

function getEmployeeById(id) {
  return getEmployeeData().find((employee) => employee.empno == id);
}

let formEmployee = { status: "Active" };

let mode = localStorage.getItem("mode") || "";
let empid = localStorage.getItem("empid") || "";

mode == "view" ? viewPage(empid) : mode == "edit" ? editPage(empid) : "";

let changeData = (value, name) => {
  formEmployee[name] = value;
};

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
    joiningDate,
    assignManager,
    assignProject
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
    this.assignManager = assignManager;
    this.assignProject = assignProject;
  }
}

function validateEmail(email) {
  pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  let element = document.querySelector(
    `.employee-information .input-form-element[name="email"]`
  );
  let spanElement = document.querySelector(
    `.employee-information .input-form-element[name="email"]+span[name="email"]`
  );
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
  let element = document.querySelector(
    `.employee-information .input-form-element[name="firstname"]`
  );
  let spanElement = document.querySelector(
    `.employee-information .input-form-element[name="firstname"]+span[name="firstname"]`
  );
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
  let element = document.querySelector(
    `.employee-information .input-form-element[name="empno"]`
  );
  let spanElement = document.querySelector(
    `.employee-information .input-form-element[name="empno"]+span[name="empno"]`
  );
  let employee = employees.find((ele) => ele.empno == empno);
  if (employee) {
    if (spanElement) {
      spanElement.innerHTML = `<b class="exclamation"><b>!</b></b> employee no already exists`;
    } else {
      let span = document.createElement("span");
      span.setAttribute("name", "empno");
      element.parentNode.appendChild(span);
      span.innerHTML = `<b class="exclamation"><b>!</b></b> employee no already exists`;
    }
    return;
  }
  spanElement ? element.parentNode.removeChild(spanElement) : "";
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

function resetForm() {
  document.querySelector("#employeeForm").reset();
  document.querySelector(".left-wrapper .img-wrapper img").src =
    "images/user-profile.jpg";
  for (let field of requiredFields) {
    let spanElement = document.querySelector(
      `.input-form-element+span[name="${field}"]`
    );
    let element = document.querySelector(
      `.input-form-element[name="${field}"]`
    );
    spanElement ? element.parentNode.removeChild(spanElement) : "";
  }
}

addEmployee?.addEventListener("click", (e) => {
  e.preventDefault();
  let flag = false;
  for (let field of requiredFields) {
    let spanElement = document.querySelector(
      `.input-form-element+span[name="${field}"]`
    );
    let element = document.querySelector(
      `.input-form-element[name="${field}"]`
    );
    if (!formEmployee[field]) {
      let span = document.createElement("span");
      span.setAttribute("name", field);
      if (!spanElement) {
        element.parentNode.appendChild(span);
        span.innerHTML = `<b class="exclamation"><b>!</b></b> <b style="text-transform:capitalize">${field}</b> field is required`;
      } else {
        spanElement.innerHTML = `<b class="exclamation"><b>!</b></b> <b style="text-transform:capitalize">${field}</b> field is required`;
      }
      flag = true;
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
      if (!val) flag = true;
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
    formEmployee.joiningDate,
    formEmployee.assignManager,
    formEmployee.assignProject
  );
  let employeeData = getEmployeeData();
  mode != "edit"
    ? employeeData.push(employee)
    : (employeeData = replaceEmployee(employeeData, formEmployee));
  setEmployeeData(employeeData);
  formEmployee = { status: "Active" };
  let message =
    mode != "edit" ? "Employee Added Successfully" : "Updated Successfully";
  toastToggle(message);
  setTimeout(() => {
    toastToggle(message);
    resetForm();
  }, 1500);
});

function toastToggle(message) {
  document.querySelector(".toast").classList.toggle("toast-toggle");
  document.querySelector(".toast .message").innerText = message;
}

function viewPage(id) {
  let viewEmployee = getEmployeeById(id);
  let editOrDelete = document.querySelector("#editOrDelete");
  let editButton = document.createElement("button");
  let deleteButton = document.createElement("button");

  editOrDelete.append(editButton, deleteButton);

  editButton.innerText = "Edit";
  deleteButton.innerText = "Delete";

  editButton.classList.add("edit");
  deleteButton.classList.add("delete");

  editButton.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.setItem("mode", "edit");
    window.location.reload();
  });

  deleteButton.addEventListener("click", (e) => {
    e.preventDefault();
    let employees = getEmployeeData();
    employees = employees.filter((employee) => employee.empno != id);
    setEmployeeData(employees);
    window.location = "index.html";
  });

  document.querySelector(".left-wrapper .img-wrapper img").src =
    viewEmployee.image ? viewEmployee.image : "images/user-profile.jpg";
  document.querySelector(".employee-details > .title").innerText =
    "View Employee";
  document.querySelector(`input[name="empno"]`).value = viewEmployee.empno;
  document.querySelector(`input[name="empno"]`).disabled = "true";

  document.querySelector(`input[name="firstname"]`).value =
    viewEmployee.firstname;
  document.querySelector(`input[name="firstname"]`).disabled = "true";

  document.querySelector(`input[name="lastname"]`).value =
    viewEmployee.lastname;
  document.querySelector(`input[name="lastname"]`).disabled = "true";

  document.querySelector(`input[name="dob"]`).value = viewEmployee.dob
    ? viewEmployee.dob
    : "";
  document.querySelector(`input[name="dob"]`).disabled = "true";

  document.querySelector(`input[name="email"]`).value = viewEmployee.email;
  document.querySelector(`input[name="email"]`).disabled = "true";

  document.querySelector(`label[for="file"]`).style.display = "none";

  document.querySelector(`input[name="mobile"]`).value = viewEmployee.mobile
    ? viewEmployee.mobile
    : "";
  document.querySelector(`input[name="mobile"]`).disabled = "true";

  document.querySelector(`input[name="joiningDate"]`).value =
    viewEmployee.joiningDate;
  document.querySelector(`input[name="joiningDate"]`).disabled = "true";

  document.querySelector(`select[name="location"]`).value =
    viewEmployee.location ? viewEmployee.location : "";
  document.querySelector(`select[name="location"]`).disabled = "true";

  document.querySelector(`select[name="jobTitle"]`).value = viewEmployee.role
    ? viewEmployee.role
    : "";
  document.querySelector(`select[name="jobTitle"]`).disabled = "true";

  document.querySelector(`select[name="department"]`).value =
    viewEmployee.department ? viewEmployee.department : "";
  document.querySelector(`select[name="department"]`).disabled = "true";

  document.querySelector(`select[name="assignManager"]`).value =
    viewEmployee.assignManager ? viewEmployee.assignManager : "";
  document.querySelector(`select[name="assignManager"]`).disabled = "true";

  document.querySelector(`select[name="assignProject"]`).value =
    viewEmployee.assignProject ? viewEmployee.assignProject : "";
  document.querySelector(`select[name="assignProject"]`).disabled = "true";

  document.querySelector(".employment-information .btn-wrapper").style.display =
    "none";
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
  formEmployee = editEmployee;
  document.querySelector(".left-wrapper .img-wrapper img").src =
    editEmployee.image ? editEmployee.image : "images/user-profile.jpg";
  document.querySelector(".employee-details > .title").innerText =
    "Edit Employee";
  document.querySelector(`input[name="empno"]`).value = editEmployee.empno;
  document.querySelector(`input[name="empno"]`).disabled = "true";

  document.querySelector(`input[name="firstname"]`).value =
    editEmployee.firstname;
  document.querySelector(`input[name="lastname"]`).value =
    editEmployee.lastname;

  document.querySelector(`input[name="dob"]`).value = editEmployee.dob
    ? editEmployee.dob
    : "";

  document.querySelector(`input[name="email"]`).value = editEmployee.email;

  document.querySelector(`input[name="mobile"]`).value = editEmployee.mobile
    ? editEmployee.mobile
    : "";

  document.querySelector(`input[name="joiningDate"]`).value =
    editEmployee.joiningDate;

  document.querySelector(`select[name="location"]`).value =
    editEmployee.location ? editEmployee.location : "";

  document.querySelector(`select[name="jobTitle"]`).value = editEmployee.role
    ? editEmployee.role
    : "";

  document.querySelector(`select[name="department"]`).value =
    editEmployee.department ? editEmployee.department : "";

  document.querySelector(`select[name="assignManager"]`).value =
    editEmployee.assignManager ? editEmployee.assignManager : "";

  document.querySelector(`select[name="assignProject"]`).value =
    editEmployee.assignProject ? editEmployee.assignProject : "";
  document.querySelector(
    ".employment-information .btn-wrapper .add-employee button"
  ).innerText = "Update";
}
