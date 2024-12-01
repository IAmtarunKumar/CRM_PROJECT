if (!localStorage.getItem("token")) {
  window.location.href = "index.html";
}

// Import necessary functions and APIs
import { loading_shimmer, remove_loading_shimmer } from "./globalFunctions1.js";
import { dashboard_API } from "./apis.js";

// Retrieve token
const token = localStorage.getItem("token");

// Function to handle login and registration messages
window.onload = () => {
  const loginMessage = localStorage.getItem("loginMessage");
  const registerMessage = localStorage.getItem("registerMessage");
  const message = document.getElementById("response");

  if (loginMessage || registerMessage) {
    message.innerText = loginMessage || registerMessage;
    setTimeout(() => {
      message.style.display = "none";
    }, 3000);
    localStorage.removeItem("loginMessage");
    localStorage.removeItem("registerMessage");
  }

  // Fetch data for the dashboard
  fetchDashboardData();
  fetchTaskStatistics();
};

// Function to fetch dashboard data
async function fetchDashboardData() {
  try {
    loading_shimmer();

    const response = await fetch(dashboard_API, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch dashboard data");

    const data = await response.json();

    // Update dashboard counts
    document.querySelector(".projects-count").textContent =
      data.counts.projectCount || 0;
    document.querySelector(".clients-count").textContent =
      data.counts.clientCount || 0;
    document.querySelector(".tasks-count").textContent =
      data.counts.taskCount || 0;
    document.querySelector(".employees-count").textContent =
      data.counts.employeeCount || 0;

    // Update recent items
    updateRecentItems("invoicesTable", data.recentInvoices, [
      { field: "invoiceId", link: true, linkPath: "invoice-view.html" },
      { field: "client.name" },
      { field: "project.projectName" },
      { field: "dueDate" },
      { field: "total" },
    ]);

    updateRecentItems("clientsTable", data.recentClients, [
      { field: "name" },
      { field: "email" },
      { field: "mobile" },
      { field: "status" },
    ]);

    updateRecentItems("projectsTable", data.recentProjects, [
      { field: "projectName" },
      { field: "clientName.name" },
      { field: "deadline" },
      { field: "status" },
    ]);

    updateRecentItems("productsTable", data.recentProducts, [
      { field: "productName" },
      { field: "category.category" },
      { field: "price" },
      { field: "status" },
    ]);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  } finally {
    remove_loading_shimmer();
  }
}

// Helper function to update recent items in tables
function updateRecentItems(tableId, items, fields) {
  const table = document.querySelector(`#${tableId} tbody`);
  table.innerHTML = items
    .map((item) =>
      `<tr>${fields
        .map(({ field, link, linkPath }) => {
          const value = field.split(".").reduce((acc, key) => acc?.[key] || "-", item);
          if (link) {
            return `<td><a href="${linkPath || "#"}">${value}</a></td>`;
          }
          return `<td>${value}</td>`;
        })
        .join("")}</tr>`
    )
    .join("");
}

// Function to fetch task statistics for the dashboard with date filter
async function fetchTaskStatistics() {
  try {
    loading_shimmer();

    // Get date filters
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;

    // Build the query parameters
    const queryParams = new URLSearchParams();
    if (fromDate) queryParams.append("fromDate", fromDate);
    if (toDate) queryParams.append("toDate", toDate);

    const response = await fetch(`${dashboard_API}/task-status?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch task statistics");

    const data = await response.json();
    updateTaskStatistics(data);
  } catch (error) {
    console.error("Error fetching task statistics:", error);
    alert("Unable to fetch task statistics. Please try again later.");
  } finally {
    remove_loading_shimmer();
  }
}

// Event Listener for Date Filters
document.getElementById("fromDate").addEventListener("change", fetchTaskStatistics);
document.getElementById("toDate").addEventListener("change", fetchTaskStatistics);

// Existing function to update task statistics UI
function updateTaskStatistics(data) {
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
    return; // Exit the function if elements are missing
  }

  progressContainer.innerHTML = "";
  breakdownContainer.innerHTML = "";

  Object.entries(taskCounts).forEach(([status, count]) => {
    const percentage = totalTasks > 0 ? ((count / totalTasks) * 100).toFixed(2) : 0; // (count task ka)/(total task) *100
    const statusConfig = statusColors[status];

    // Add progress bar with corresponding color
    const progressBar = document.createElement("div");
    progressBar.className = `progress-bar ${statusConfig?.bgColor || "bg-secondary"}`;
    progressBar.style.width = `${percentage}%`;
    progressBar.innerText = `${percentage}%`;
    progressContainer.appendChild(progressBar);

    // Add task status breakdown with corresponding color
    const breakdown = document.createElement("p");
    breakdown.innerHTML = `
      <i class="fa-regular fa-circle-dot ${statusConfig?.color || "text-secondary"} me-2"></i>
      ${status} Tasks
      <span class="float-end">${count} (${percentage}%)</span>
    `;
    breakdownContainer.appendChild(breakdown);
  });
}



