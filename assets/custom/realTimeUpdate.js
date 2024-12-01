window.onload = async () => {
  try {
    loading_shimmer(); // Show loading shimmer
  } catch (error) {
    console.error("Error initializing loading shimmer:", error);
  }

  try {
    const _id_param = new URLSearchParams(window.location.search).get("id");

    // Fetch project details
    const response = await fetch(`${project_API}/get/${_id_param}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = await response.json();
    console.log("Project Data:", responseData);

    // Update project details
    document.getElementById("project-name").innerText = `${responseData.projectName} (${responseData.projectId})`;
    document.getElementById("description").innerText = responseData.description;

    // Handle tasks
    const tasks = responseData.tasks || [];
    if (tasks.length > 0) {
      document.getElementById("file_main_div2").classList.remove("d-none");

      const taskDetailsBody = document.getElementById("task_details_tbodyone");
      tasks.forEach((task, i) => {
        const contractorNames = task?.assignedTo
          ?.map((contractor) => contractor?.ContractorName)
          .join(", ") || "No Contractor Assigned";

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${i + 1}</td>
          <td><a href="task-view.html?id=${task?._id}">${task?.title}</a></td>
          <td><span>${contractorNames}</span></td>
          <td><span>${task?.status}</span></td>
          <td><span>${formatDate(task?.startDate)}</span></td>
          <td class="text-center">
            <a href="task-view.html?id=${task?._id}" class="btn btn-primary"><i class="fa-solid fa-eye"></i></a>
          </td>`;
        taskDetailsBody.appendChild(row);
      });
    } else {
      document.getElementById("file_main_div2").classList.add("d-none");
    }

    // Handle uploaded files
    const uploadedFiles = responseData.document || [];
    if (uploadedFiles.length > 0) {
      document.getElementById("file_main_div").classList.remove("d-none");

      const uploadedFilesBody = document.getElementById("uploaded_files_tbodyone");
      uploadedFiles.forEach((file, i) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${i + 1}</td>
          <td>
            <input class="form-control" type="text" value="File ${i + 1}" disabled>
          </td>
          <td class="text-center">
            <a href="${file}" target="_blank" class="btn btn-primary"><i class="fa-regular fa-eye"></i></a>
          </td>`;
        uploadedFilesBody.appendChild(row);
      });
    } else {
      document.getElementById("file_main_div").classList.add("d-none");
    }

    // Handle project details
    document.getElementById("tbodyone").innerHTML = `
      <tr><td>Start Date:</td><td class="text-end">${formatDate(responseData?.startDate)}</td></tr>
      <tr><td>Deadline:</td><td class="text-end">${formatDate(responseData?.deadline)}</td></tr>
      <tr><td>Status:</td><td class="text-end">${responseData?.status}</td></tr>
      <tr><td>Priority:</td><td class="text-end">${responseData?.priority}</td></tr>
      <tr><td>Price:</td><td class="text-end">₹${responseData?.price}</td></tr>
      <tr><td>Discount:</td><td class="text-end">${responseData?.discountPercentage}% (₹${responseData?.discountRupee})</td></tr>
      <tr><td>Tax:</td><td class="text-end">${responseData?.tax}% (₹${responseData?.tax_rs})</td></tr>
      <tr><td>Total Price:</td><td class="text-end">₹${responseData?.totalPrice}</td></tr>`;

    // Handle client details
    const client = responseData.clientName || {};
    document.getElementById("tbodytwo").innerHTML = `
      <tr><td>Name:</td><td class="text-end"><a href="clientProfile.html?id=${client._id}">${client.name}</a></td></tr>
      <tr><td>Id:</td><td class="text-end"><a href="clientProfile.html?id=${client._id}">${client.userId}</a></td></tr>
      <tr><td>Email:</td><td class="text-end"><a href="mailto:${client.email}">${client.email}</a></td></tr>`;

    // Handle assigned to details
    const assignedTo = responseData.assignedTo || {};
    document.getElementById("tbodythree").innerHTML = `
      <tr><td>Name:</td><td class="text-end"><a href="userProfile.html?id=${assignedTo._id}">${assignedTo.name}</a></td></tr>
      <tr><td>Id:</td><td class="text-end">${assignedTo.userId}</td></tr>
      <tr><td>Email:</td><td class="text-end"><a href="mailto:${assignedTo.email}">${assignedTo.email}</a></td></tr>`;

    // Handle task statuses and progress bar
    const statusCount = tasks.reduce(
      (acc, task) => {
        if (task.status === "Completed") acc.completed++;
        else if (task.status === "In Progress") acc.inProgress++;
        else if (task.status === "Ready to start") acc.readyToStart++;
        else if (task.status === "Active") acc.Active++;
        else if (task.status === "Inactive") acc.Inactive++;
        else if (task.status === "Hold") acc.Hold++;
        else if (task.status === "In-Progress") acc.InProgress++;
        else if (task.status === "Pending") acc.Pending++;
        else if (task.status === "Closed") acc.Closed++;

        acc.total++;
        return acc;
      },
      { completed: 0, inProgress: 0, readyToStart: 0, total: 0, Active: 0, Inactive: 0, Hold: 0, InProgress: 0, Pending: 0, Closed: 0 }
    );

    const completionPercentage = statusCount.total > 0
      ? Math.round((statusCount.completed / statusCount.total) * 100)
      : 0;

    const taskBar = document.getElementById("taskBar");
    if (taskBar) {
      taskBar.style.width = `${completionPercentage}%`;
      taskBar.setAttribute("aria-valuenow", completionPercentage);
      taskBar.innerText = `${completionPercentage}% Completed`;
    }

    const taskBreakdown = `
      <p>Completed: ${statusCount.completed}</p>
      <p>In Progress: ${statusCount.inProgress}</p>
      <p>Ready to Start: ${statusCount.readyToStart}</p>
      <p>Active: ${statusCount.Active}</p>
      <p>Inactive: ${statusCount.Inactive}</p>
      <p>Hold: ${statusCount.Hold}</p>
      <p>In-Progress: ${statusCount.InProgress}</p>
      <p>Pending: ${statusCount.Pending}</p>
      <p>Closed: ${statusCount.Closed}</p>
      <p>Total Tasks: ${statusCount.total}</p>`;
    document.getElementById("taskBreakdown").innerHTML = taskBreakdown;

  } catch (error) {
    console.error("Error fetching project details:", error);
    window.location.href = "project-list.html";
  }

  try {
    remove_loading_shimmer(); // Hide loading shimmer
  } catch (error) {
    console.error("Error removing loading shimmer:", error);
  }
};