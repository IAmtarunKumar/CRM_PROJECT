if(!localStorage.getItem("token")) {
  window.location.href = 'index.html';
}

import {status_popup} from './globalFunctions1.js';
import {task_API, user_API, project_API} from './apis.js';

const token = localStorage.getItem('token');
// =======================================================
// =======================================================
// =======================================================
let id_param = new URLSearchParams(window.location.search).get("id");
// ===============================================================================================================
const newOption = document.createElement("option");
newOption.value = localStorage.getItem('User_id');
newOption.text = localStorage.getItem('User_name'); 
const select = document.getElementById("assigned_by_select_option");
select.add(newOption);
select.value = newOption.value;
// ===============================================================================================================

async function dropdownForAddTask(){
  // =========================================================

  const r1 = await fetch(`${project_API}/get`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
  });
  const r2 = await r1.json();
  
  const project_select_option = document.getElementById("project_select_option");
  console.log(r2?.data)
  r2?.data.map((e) => {
    let a1 = document.createElement("option");
    a1.value = e?._id || '-';
    a1.text = `${e?.projectName} (${e?.projectId})` || '-' ;
    project_select_option.appendChild(a1);
  });
  project_select_option.value = id_param;
  // =========================================================
  // =========================================================
  const r3 = await fetch(`${user_API}/data/get`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
  });
  const r4 = (await r3.json());

  const dropdownContent_my_shivaur_mohit = document.getElementById("dropdownContent_my_shivaur_mohit");
  r4?.users?.employees.map((e) => {
    let d1 = document.createElement("div");
    d1.innerHTML = `
                    <input type="checkbox" value="${e._id}" class="assignee-checkbox_my_shivaur_mohit">
                    <label class="checkbox-label_my_shivaur_mohit">${e.name} (${e.userId})</label>`;
    d1.classList.add("checkbox-container_my_shivaur_mohit");
    dropdownContent_my_shivaur_mohit.appendChild(d1);    
  });
  assignee_drop_down_checkbox();
  // =========================================================
}
dropdownForAddTask();
// Task Post API 
const addTaskForm = document.getElementById('add_task_form');
addTaskForm.addEventListener('submit',async(event)=>{
  event.preventDefault();

  let startDate = document.getElementById('startDate').value;
  let status = document.getElementById('status').value;
  let assignedBy = document.getElementById('assigned_by_select_option').value;
  let title = document.getElementById('task-title').value;
  let project = document.getElementById('project_select_option').value;
  let taskDescription = document.getElementById('description').value;

  let formData = new FormData();

  Array.from(document.getElementById("selectedAssignees_my_shivaur_mohit").children).forEach((e)=>{
    formData.append("assignedTo",e.getAttribute('value'));
  });
  
  let files = document.getElementById('file').files;
  for (const file of files) {
    formData.append("file", file);
  }

  formData.append("startDate", startDate);
  formData.append("status", status);
  formData.append("assignedBy", assignedBy);
  formData.append("title", title);
  formData.append("project", project);
  formData.append("taskDescription", taskDescription);

  try {
    const response = await fetch(`${task_API}/create-and-assign`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const c1 = (response.ok);
    try{
      status_popup( ((c1) ? "Task Added <br> Successfully" : "Please try again later"), (c1) );
      setTimeout(function(){
        window.location.href = `project-view.html?id=${id_param}`; 
      },(Number(document.getElementById("b1b1").innerText)*1000));
    } catch (error){
      status_popup("Please try again later", false);
    }
  } catch (error) {
    console.log(error)
    status_popup("Please try again later", false);
  }
});


// ==========================================================================================
// ==========================================================================================

function assignee_drop_down_checkbox(){
    
  const dropdownContent_my_shivaur_mohit = document.getElementById("dropdownContent_my_shivaur_mohit");
  const selectedAssignees_my_shivaur_mohit = document.getElementById("selectedAssignees_my_shivaur_mohit");
  const checkboxes_my_shivaur_mohit = document.querySelectorAll(".assignee-checkbox_my_shivaur_mohit");

  // Function to toggle dropdown visibility
  window.toggleDropdown_my_shivaur_mohit = function toggleDropdown_my_shivaur_mohit() {
    dropdownContent_my_shivaur_mohit.classList.toggle("show_my_shivaur_mohit");
  }

  // Close dropdown if clicked outside
  window.addEventListener("click", function (event) {
    if (!event.target.matches('.dropdown-btn_my_shivaur_mohit')) {
      dropdownContent_my_shivaur_mohit.classList.remove("show_my_shivaur_mohit");
    }
  });

  // Function to update selected assignees display
  function updateSelectedAssignees_my_shivaur_mohit() {
    // Clear the display area
    selectedAssignees_my_shivaur_mohit.innerHTML = "";

    // Loop through each checkbox and add selected ones to display
    checkboxes_my_shivaur_mohit.forEach((checkbox) => {
      if (checkbox.checked) {
        const label = checkbox.nextElementSibling.textContent; // Get the label text
        const tag = document.createElement("span");
        tag.classList.add("tag_my_shivaur_mohit");
        tag.textContent = label; // Display the label text
        tag.setAttribute("value", checkbox.value);
        selectedAssignees_my_shivaur_mohit.appendChild(tag);
      }
    });
  }

  // Attach event listeners to all checkboxes for selection
  checkboxes_my_shivaur_mohit.forEach((checkbox) => {
    checkbox.addEventListener("change", updateSelectedAssignees_my_shivaur_mohit);
  });
}