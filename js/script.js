let showHideMenu = document.querySelector('img[alt="direction"]');
let sidebar = document.querySelector(".sidebar");
let addEmployee = document.querySelector(".form-add-employee");
showHideMenu.addEventListener("click", () => {
  sidebar.classList.toggle("sidebar-toggle");
});
// add employee validation
let formDataEmployee = {
  empno: "",
  firstname: "",
  lastname: "",
  dob: "",
  email: "",
  mobile: "",
  joiningDate: "",
  location: "",
  jobTitle: "",
  department: "",
  assignManager: "",
  assignProject: "",
};
let changeData = (value, name) => {
  formDataEmployee[name] = value;
};
let validateEmail = (email) => {
  let ele = document.querySelector(`.input-form-element[name="email"]`);
  let spanCheck = document.querySelector(
    `.input-form-element+span[name="email"]`
  );
  if (!email.includes("@") || !email.includes(".")) {
    if (spanCheck) {
      spanCheck.innerText = "email must contains @ and .";
    } else {
      let span = document.createElement("span");
      span.setAttribute("name", "email");
      ele.parentNode.appendChild(span);
      span.innerText = "please enter valid email address";
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
      span.innerText = "please enter valid email address";
    }
    return;
  }
  if (email.includes("..")) {
    if (spanCheck) {
      spanCheck.innerText = "email doesnot contain .. ";
    } else {
      let span = document.createElement("span");
      span.setAttribute("name", "email");
      ele.parentNode.appendChild(span);
      span.innerText = "please enter valid email address";
    }
    return;
  }
  return true;
};
addEmployee.addEventListener("click", (e) => {
  e.preventDefault();
  let flag = false;
  for (let key in formDataEmployee) {
    let spanCheck = document.querySelector(
      `.input-form-element+span[name="${key}"]`
    );
    let ele = document.querySelector(`.input-form-element[name="${key}"]`);
    if (!formDataEmployee[key]) {
      let span = document.createElement("span");
      span.setAttribute("name", key);
      if (!spanCheck) {
        ele.parentNode.appendChild(span);
        span.innerText = "please enter";
      }
      flag = true;
    } else {
      if (spanCheck) ele.parentNode.removeChild(spanCheck);
    }
  }
  if (flag) return;
  flag = validateEmail(formDataEmployee["email"]);
  if (flag) console.log("valid email");
});
