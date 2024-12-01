// Ensure the token is available
if (!localStorage.getItem("token")) {
  window.location.href = 'index.html';
}

import { status_popup, loading_shimmer, remove_loading_shimmer } from './globalFunctions1.js';
import { formatDate } from './globalFunctions2.js';
import { project_API } from './apis.js';

const token = localStorage.getItem('token');

// Fetch Project Details and Task Statistics
async function fetchProjectDetailsAndTaskStatistics(projectId) {
  try {
    loading_shimmer();

     // Get the date range values from input fields
     const fromDate = document.getElementById("fromDate").value;
     const toDate = document.getElementById("toDate").value;
 
     // Prepare query parameters for the API call
     const queryParams = new URLSearchParams();
     if (fromDate) queryParams.append("fromDate", fromDate);
     if (toDate) queryParams.append("toDate", toDate);
 
     // Construct the API URL with query parameters
     const apiUrl = `${project_API}/get/${projectId}?${queryParams.toString()}`;
 
     const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch project details and task statistics");
    }

 

    const data = await response.json();

    updateProjectDetailsUI(data.projectDetails);
    updateTaskStatisticsUI(data.taskStatistics);

  } catch (error) {
    console.error("Error fetching project details and task statistics:", error);
    alert("Unable to fetch project data. Please try again later.");
  } finally {
    remove_loading_shimmer();
  }
}

// Event listeners for date range inputs
document.getElementById("fromDate").addEventListener("input", () => {
  const projectId = new URLSearchParams(window.location.search).get("id");
  if (projectId) {
    fetchProjectDetailsAndTaskStatistics(projectId);
  }
});

document.getElementById("toDate").addEventListener("input", () => {
  const projectId = new URLSearchParams(window.location.search).get("id");
  if (projectId) {
    fetchProjectDetailsAndTaskStatistics(projectId);
  }
});

// Update Project Details
function updateProjectDetailsUI(projectDetails) {
  const description = document.getElementById("description");
  const tableData = document.getElementById("tbodyone");
  const tableData2 = document.getElementById("tbodytwo");
  const tableData3 = document.getElementById("tbodythree");
  const tableInstallmentData = document.getElementById("tbodyInstallment");
  const taskDetailsBody = document.getElementById("task_details_tbodyone");
  const projectName = document.getElementById("project-name");
  document.getElementById("task_page").href = `add-tasks.html?id=${projectDetails._id}`;

  // Update project metadata
  projectName.innerText = `${projectDetails.projectName} (${projectDetails.projectId})`;
  description.innerText = projectDetails.description || "-";

  tableData.innerHTML = `
    <tr><td>Start Date :</td><td class="text-end">${formatDate(projectDetails?.startDate)}</td></tr>
    <tr><td>Deadline :</td><td class="text-end">${formatDate(projectDetails?.deadline)}</td></tr>
    <tr><td>Status :</td><td class="text-end">${projectDetails?.status}</td></tr>
    <tr><td>Priority :</td><td class="text-end">${projectDetails?.priority}</td></tr>
    <tr><td>Price :</td><td class="text-end">₹${projectDetails?.price}</td></tr>
    <tr><td>Discount :</td><td class="text-end">${projectDetails?.discountPercentage}% (₹${projectDetails?.discountRupee})</td></tr>
    <tr><td>Tax :</td><td class="text-end">${projectDetails?.tax}% (₹${projectDetails?.tax_rs})</td></tr>
    <tr><td>Total Price :</td><td class="text-end">₹${projectDetails?.totalPrice}</td></tr>`;

  // Update client details
  const client = projectDetails?.clientName;
  tableData2.innerHTML = `
    <tr><td>Name :</td><td class="text-end"><a href='clientProfile.html?id=${client?._id}'>${client?.name}</a></td></tr>
    <tr><td>ID :</td><td class="text-end"><a href='clientProfile.html?id=${client?._id}'>${client?.userId}</a></td></tr>
    <tr><td>Email :</td><td class="text-end"><a href='clientProfile.html?id=${client?._id}'>${client?.email}</a></td></tr>`;

    
  // Update assigned user details
  const assTo = projectDetails?.assignedTo;
  tableData3.innerHTML = `

    <tr><td>Name :</td><td class="text-end"><a href='userProfile.html?id=${assTo?._id}'>${assTo?.name}</a></td></tr>
    <tr><td>ID :</td><td class="text-end"><a href='userProfile.html?id=${assTo?._id}'>${assTo?.userId}</a></td></tr>
    <tr><td>Email :</td><td class="text-end"><a href='userProfile.html?id=${assTo?._id}'>${assTo?.email}</a></td></tr>
    <tr><td>Assigned To :</td><td class="text-end"><a href='userProfile.html?id=${assTo?._id}'>${assTo?.roles}</a></td></tr>`

  // Update installment details
  tableInstallmentData.innerHTML = projectDetails.installmentDetails.map((installment, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${formatDate(installment.paymentDate)}</td>
      <td>₹${installment.paymentAmount}</td>
      <td>${installment.paymentStatus}</td>
      <td>${formatDate(installment.paidDate)}</td>
    </tr>
  `).join("");

  // Update tasks
  taskDetailsBody.innerHTML = projectDetails.tasks.map((task, index) => {
    const contractorNames = task.assignedTo.map(contractor => contractor.ContractorName).join(", ") || "N/A";
    return `
      <tr>
        <td>${index + 1}</td>
        <td><a href="task-view.html?id=${task._id}">${task.title}</a></td>
        <td>${contractorNames}</td>
        <td>${task.status}</td>
        <td>${formatDate(task.startDate)}</td>
        <td class="text-center">
          <a href="task-view.html?id=${task._id}" class="btn btn-primary"><i class="fa-solid fa-eye"></i></a>
        </td>
      </tr>
    `;
  }).join("");
}

 
// Function to update the UI with task statistics
function updateTaskStatisticsUI(data) {
  const totalTasks = data.totalTasks || 0;
  const taskCounts = data.taskCounts || {};

  // Update total and overdue tasks
  const totalTasksCountEl = document.getElementById("totalTasksCount");
  const overdueTasksCountEl = document.getElementById("overdueTasksCount");

  if (totalTasksCountEl) {
    totalTasksCountEl.innerText = totalTasks;
  }

  if (overdueTasksCountEl) {
    overdueTasksCountEl.innerText = data.overdueTasks || 0;
  }

  // Define colors for task statuses
  const statusColors = {
    Completed: { color: "text-purple", bgColor: "bg-purple" },
    "In-Progress": { color: "text-warning", bgColor: "bg-warning" },
    Hold: { color: "text-success", bgColor: "bg-success" },
    Pending: { color: "text-danger", bgColor: "bg-danger" },
    Active: { color: "text-info", bgColor: "bg-info" },
    Inactive: { color: "text-secondary", bgColor: "bg-secondary" },
    "Ready to Start": { color: "text-primary", bgColor: "bg-primary" },
    Closed: { color: "text-black", bgColor: "bg-dark" },
  };

  const progressContainer = document.querySelector(".progress");
  const breakdownContainer = document.getElementById("taskStatisticsBreakdown");

  // Ensure the elements exist before modifying them
  if (!progressContainer || !breakdownContainer) {
    console.error("Missing required elements: .progress or #taskStatisticsBreakdown");
    return;
  }

  // Clear previous content
  progressContainer.innerHTML = "";
  breakdownContainer.innerHTML = "";

  // Add progress bars and breakdown for each task status
  Object.entries(taskCounts).forEach(([status, count]) => {
    const percentage = totalTasks > 0 ? ((count / totalTasks) * 100).toFixed(2) : 0;
    const statusConfig = statusColors[status];

    // Create progress bar
    const progressBar = document.createElement("div");
    progressBar.className = `progress-bar ${statusConfig?.bgColor || "bg-secondary"}`;
    progressBar.style.width = `${percentage}%`;
    progressBar.innerText = `${percentage}%`;
    progressContainer.appendChild(progressBar);

    // Create task status breakdown
    const breakdown = document.createElement("p");
    breakdown.innerHTML = `
      <i class="fa-regular fa-circle-dot ${statusConfig?.color || "text-secondary"} me-2"></i>
      ${status} Tasks
      <span class="float-end">${count} (${percentage}%)</span>
    `;
    breakdownContainer.appendChild(breakdown);
  });
}

 

window.onload = () => {
  const projectId = new URLSearchParams(window.location.search).get("id");
  if (projectId) {
    fetchProjectDetailsAndTaskStatistics(projectId);
  } else {
    alert("Invalid project ID");
    window.location.href = "project-list.html";
  }
};