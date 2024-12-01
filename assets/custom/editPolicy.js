const token = localStorage.getItem("token");
import { status_popup } from "./globalFunctions1.js";
import { departments_API, policy_API } from "./apis.js";

try {
  const response = await fetch(`${departments_API}/get`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const res = await response.json();
  console.log(res);

  const department = document.getElementById("department_select_option");
  res?.data.forEach((departments) => {
    const option = document.createElement("option");
    option.value = departments._id;
    option.text = `${departments?.departments}`;
    department.appendChild(option);
  });
} catch (error) {
  console.error("Error fetching data:", error);
  alert("Failed to load client and employee data.");
}
let id;
let resp;

document.addEventListener('DOMContentLoaded',async () => {
  try{
  id = new URLSearchParams(window.location.search).get("id");
  const responseData = await fetch(`${policy_API}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  resp = await responseData.json();
  document.querySelector(".note-editable").children[0].innerText =
    resp.description;
  document.getElementById("policy-name").value = resp.policyName;
  document.getElementById("date").value = resp.date;
  document.getElementById("department_select_option")[0].innerText =
    resp.department?.departments;
}catch(error){
  console.log(error);
}
})

 

const editPolicyForm = document.getElementById("edit-policy-form");
editPolicyForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  try {
    const description = document.querySelector(".note-editable").childNodes[0].textContent;
    const policyName = document.getElementById("policy-name").value;
    const date = document.getElementById("date").value;
    const departmentSelect = document.getElementById(
      "department_select_option"
    );
    const department = departmentSelect.value
      ? departmentSelect.value
      : resp.department._id;

    const _id = id;
    const formData = new FormData();

    // Append project files
    const files = document.getElementById("policy_upload").files;
    for (const file of files) {
      formData.append("file", file);
    }

    // Append form fields
    formData.append("policyName", policyName);
    formData.append("description", description);
    formData.append("department", department);
    formData.append("date", date);
    formData.append("_id", _id);

    console.log("Form Data:", formData);

    // Send form data to server
    const response = await fetch(`${policy_API}/update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const res = await response.json();
    console.log(res);
    const c1 = response.ok == true;
    try {
      status_popup(
        c1 ? "Policy Updated <br> Successfully" : "Please try again later",
        c1
      );
      setTimeout(function () {
        window.location.href = "policies.html"; // Adjust this path if needed
      }, Number(document.getElementById("b1b1").innerText) * 1000);
    } catch (error) {
      status_popup("Please try again later", false);
    }
  } catch (error) {
    status_popup("Please try again later", false);
  }
});