if (!localStorage.getItem("token")) {
    localStorage();
    window.location.href = 'index.html';
}
// =================================================================================
import { checkbox_function } from './multi_checkbox.js';
import { status_popup, loading_shimmer, remove_loading_shimmer } from './globalFunctions1.js';
import { formatDate, capitalizeFirstLetter } from './globalFunctions2.js'
import { user_API, departments_API, desginations_API, global_search_API } from './apis.js';
// -------------------------------------------------------------------------
import {individual_delete, objects_data_handler_function} from './globalFunctionsDelete.js';
window.individual_delete = individual_delete;
// -------------------------------------------------------------------------
import {} from "./globalFunctionsExport.js";
import {rtnPaginationParameters, setTotalDataCount} from './globalFunctionPagination.js';
// =================================================================================
const token = localStorage.getItem('token');
// =================================================================================
// Function to handle search and update the same table

// Get cached designation name by ID
function getCachedDesignation(designationObj) {
    if (!designationObj || !designationObj._id) return '';
    const designation = cachedDesignations.find(d => d._id === designationObj._id);
    return designation ? designation.designations : '';
}
async function handleSearch() {
    const searchFields = ["userId", "name"]; // IDs of input fields
    const searchType = "user"; // Type to pass to the backend
    
    const tableData = document.getElementById("tableData");
    let x = ''; // Initialize rows content

    try {
        loading_shimmer(); // Display shimmer loader

        // Construct query parameters for the search
        const queryParams = new URLSearchParams({ type: searchType });
        searchFields.forEach((field) => {
            const value = document.getElementById(field)?.value?.trim();
            if (value) queryParams.append(field, value);
        });

        // Send search request
       
        const response = await fetch(`${global_search_API}?${queryParams.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const res = await response.json();

        if (response.ok && res.data?.length > 0) {
            // Generate table rows dynamically
            const rows = res.data.map((user) => {
                const designation = getCachedDesignation(user?.designations ? user.designations.designations : '-');
                return `
                <tr data-id="${user?._id || '-'}">
                    <td><input type="checkbox" class="checkbox_child" value="${user?._id || '-'}"></td>
                    <td>${capitalizeFirstLetter(user?.name) || '-'}</td>
                    <td>${user?.userId || '-'}</td>
                    <td>${user?.mobile || '-'}</td>
                    <td>${capitalizeFirstLetter(designation) || '-'}</td>
                    <td>${capitalizeFirstLetter(user?.status) || '-'}</td>
                    <td>${formatDate(user?.joiningDate) || '-'}</td>
                    <td>${formatDate(user?.DOB) || '-'}</td>
                    <td class="">
                        <div class="dropdown dropdown-action">
                            <a href="#" class="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="material-icons">more_vert</i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-right">
                                <a class="dropdown-item" href="userProfile.html?id=${user?._id}">
                                    <i class="fa-regular fa-eye"></i> View
                                </a>
                                <a class="dropdown-item" onclick="handleClickOnEditEmployee('${user?._id || '-'}')" data-bs-toggle="modal" data-bs-target="#edit_data">
                                    <i class="fa-solid fa-pencil m-r-5"></i> Edit
                                </a>
                                <a class="dropdown-item" onclick="individual_delete('${user?._id || '-'}')" data-bs-toggle="modal" data-bs-target="#delete_data">
                                    <i class="fa-regular fa-trash-can m-r-5"></i> Delete
                                </a>
                            </div>
                        </div>
                    </td>
                </tr>`;
            });

            tableData.innerHTML = rows.join(''); // Insert rows into the table
        } else {
            x = `<tr><td colspan="9" class="text-center">No results found</td></tr>`;
        }
    } catch (error) {
        console.error("Error during search:", error);
        x = `<tr><td colspan="9" class="text-center">An error occurred during search</td></tr>`;
    } finally {
        if (x) tableData.innerHTML = x; // If no data, show message
        checkbox_function(); // Reinitialize checkboxes
        remove_loading_shimmer(); // Remove shimmer loader
    }
}

// Attach the search function to the search button
document.getElementById("searchButton").addEventListener("click", (e) => {
    e.preventDefault();
    handleSearch(); // Trigger search
});



let cachedDesignations = [];
let cachedDepartments = [];
// Fetch and cache designations and departments once
async function fetchDesignationsAndDepartments() {
    if (cachedDesignations.length === 0) {
        try {
            const designationResponse = await fetch(`${desginations_API}/get`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            let r = await designationResponse.json();
            cachedDesignations = r?.data;
        } catch (error) {
            console.error('Error fetching designations:', error);
        }
    }

    if (cachedDepartments.length === 0) {
        try {
            const departmentResponse = await fetch(`${departments_API}/get`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            let r = await departmentResponse.json();
            cachedDepartments = r?.data;
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    }
}

// Populate select dropdowns with cached data
function populateSelectOptions(elementId, options) {
    try{
        const select = document.getElementById(elementId);
        select.innerHTML = '';
        select.innerHTML = `<option value="" disabled selected>Select ${capitalizeFirstLetter(elementId)}</option>`;
        select.innerHTML += options.map(option =>{            
            return (
                `<option value="${option._id}">${option?.designations || option?.departments}</option>`
            )
        }).join('');
    } catch (error){console.error(error)}
}
// -------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------
// Load all employee data for the dashboard table



async function all_data_load_dashboard() {
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    await fetchDesignationsAndDepartments();

    let tableData = document.getElementById('tableData');
    tableData.innerHTML = '';
    let rows;

    try {
        const response = await fetch(`${user_API}/data/get${rtnPaginationParameters()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const res = await response.json();
        setTotalDataCount(res?.totalEmployees);
        const users = res?.users?.employees;

        if (users && users.length>0) {
            // Generate table rows asynchronously
            rows = users.map((user) => {
                const designation = getCachedDesignation(user?.designations);
                return `
                <tr data-id="${user?._id || '-'}">
                    <td><input type="checkbox" class="checkbox_child" value="${user?._id || '-'}"></td>
                    <td>${capitalizeFirstLetter(user?.name) || '-'}</td>
                    <td>${user?.userId || '-'}</td>
                    <td>${user?.mobile || '-'}</td>
                    <td>${capitalizeFirstLetter(designation) || '-'}</td>
                    <td>${capitalizeFirstLetter(user?.status) || '-'}</td>
                    <td>${formatDate(user?.joiningDate) || '-'}</td>
                    <td>${formatDate(user?.DOB) || '-'}</td>
                    <td class="">
                        <div class="dropdown dropdown-action">
                            <a href="#" class="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="material-icons">more_vert</i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-right">
                            <a class="dropdown-item"  href="userProfile.html?id=${user?._id}">
                                <i class="fa-regular fa-eye"></i> View
                            </a>
                            <a class="dropdown-item" onclick="handleClickOnEditEmployee('${user?._id || '-'}')" data-bs-toggle="modal" data-bs-target="#edit_data">
                                <i class="fa-solid fa-pencil m-r-5"></i> Edit
                            </a>
                            <a class="dropdown-item" onclick="individual_delete('${user?._id || '-'}')" data-bs-toggle="modal" data-bs-target="#delete_data">
                                <i class="fa-regular fa-trash-can m-r-5"></i> Delete
                            </a>
                            </div>
                        </div>
                    </td>
                </tr>`;
            });

            tableData.innerHTML = rows.join('');
            checkbox_function();
        } else {
            rows = `
                <tr>
                    <td  colspan="9" class='text-center'><i class="fa-solid fa-times"></i> Data is not available, please insert the data</td>
                </tr>`;

            tableData.innerHTML = rows;
        }
    } catch (error) {
        rows = `
            <tr>
                <td  colspan="9" class='text-center'><i class="fa-solid fa-times"></i> Data is not available, please insert the data</td>
            </tr>`;

        tableData.innerHTML = rows;
        
        console.error('Error loading employee data:', error);
    }
    // ----------------------------------------------------------------------------------------------------
    try{
        document.dispatchEvent(new Event('removeDataFromEmployee'))
        remove_loading_shimmer();
    } catch(error){console.log(error)}

    // Populate the select options only once using cached data
    populateSelectOptions('departments', cachedDepartments);
    populateSelectOptions('designations', cachedDesignations);
}



// ==========================================================================================
// Logic to check both email fields on blur for equality
document.getElementById('email').addEventListener('blur', function() {
    const email = document.getElementById('email').value;
    const personalEmail = document.getElementById('personalEmail').value;
    if (email === personalEmail) {
        showError(document.getElementById('personalEmail'), 'Personal Email cannot be the same as official email');
    }
});

document.getElementById('personalEmail').addEventListener('blur', function() {
    const email = document.getElementById('email').value;
    const personalEmail = document.getElementById('personalEmail').value;
    if (email === personalEmail) {
        showError(document.getElementById('personalEmail'), 'Personal Email cannot be the same as official email');
    }
});
// -------------------------------------------------------------------------------------------------------

// Handle form submission
document.getElementById('add_employee_form').addEventListener('submit', async function(event) {
    event.preventDefault();

    if (!validatorNewEmployee()) {
        return;
    }
    try{
        Array.from(document.querySelectorAll(".btn-close")).map(e=> e.click());
    } catch(error){console.log(error)}
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // ----------------------------------------------------------------------------------------------------
    const employeeData = {
        name: document.getElementById('employee_name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        status: document.getElementById('status').value,
        mobile: document.getElementById('mobile').value,
        DOB: document.getElementById('DOB').value,
        joiningDate: document.getElementById('joiningDate').value,
        roles: document.getElementById('roles').value,
        departments: document.getElementById('departments').value,
        designations: document.getElementById('designations').value,
    };

    // Clear the form fields after submission
    document.getElementById('add_employee_form').reset();

    try {
        const response = await fetch(`${user_API}/post`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employeeData),
        });


        const success = response.ok;
        status_popup(success ? "Data Updated <br> Successfully" : "Please try again later", success);
        if (success){
            all_data_load_dashboard();
        }
    } catch (error) {
        console.error('Error adding employee:', error);
        status_popup("Please try <br> again later", false);
    }
    // ----------------------------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
});

// ===========================================================================================================
// Load employee details for editing
window.handleClickOnEditEmployee = async function (employeeId) {
    await fetchDesignationsAndDepartments(); // Ensure designations and departments are loaded before editing

    // Populate department and designation dropdowns
    populateSelectOptions("update-department", cachedDepartments);
    populateSelectOptions("update-designation", cachedDesignations);

    try {
        const response = await fetch(`${user_API}/get/${employeeId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const employee = await response.json();
        console.log(employee);

        // Populate the form fields
        document.getElementById("update-name").value = employee.name || '';
        document.getElementById("update-id").value = employee._id || '';
        document.getElementById("update-mobile").value = employee.mobile || '';
        document.getElementById("update-joiningDate").value = employee.joiningDate || '';
        document.getElementById("update-status").value = employee.status || '';
        document.getElementById("update-DOB").value = employee.DOB || '';
        document.getElementById("update-email").value = employee.email || '';

        // Set department and designation dropdowns by their _id
        document.getElementById("update-department").value = employee.departments?._id || ''; // Ensure you use the `_id`
        document.getElementById("update-designation").value = employee.designations?._id || ''; // Ensure you use the `_id`

    } catch (error) {
        console.error('Error loading employee details:', error);
    }
};

// ----------------------------------------------------------------------------
// Update employee details
document.getElementById('employee-update-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    if (!validatorEditEmployee()) {
        return;
    }
    try{
        Array.from(document.querySelectorAll(".btn-close")).map(e=> e.click());
    } catch(error){console.log(error)}
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // ----------------------------------------------------------------------------------------------------
    const updatedData = {
        _id: document.getElementById("update-id").value,
        name: document.getElementById("update-name").value,
        mobile: document.getElementById("update-mobile").value,
        joiningDate: document.getElementById("update-joiningDate").value,
        status: document.getElementById("update-status").value,
        designations: document.getElementById("update-designation").value,
        departments: document.getElementById("update-department").value,
        DOB: document.getElementById("update-DOB").value,
    };

    try {
        const response = await fetch(`${user_API}/update`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        const success = response.ok;
        status_popup(success ? "Data Updated <br> Successfully" : "Please try <br> again later", success);
        if (success){
            all_data_load_dashboard();
        }
    } catch (error) {
        status_popup("Please try <br> again later", false);
    }
    // ----------------------------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
});

// =======================================================================================
// =======================================================================================

// On page load, load employee data for the dashboard
all_data_load_dashboard();
objects_data_handler_function(all_data_load_dashboard);

// ==================================================================================================
// ==================================================================================================
// ==================================================================================================
// ====================================----VALIDATION---=============================================
// ====================================----VALIDATION---=============================================
// ====================================----VALIDATION---=============================================
// ====================================----VALIDATION---=============================================
// ====================================----VALIDATION---=============================================
// ====================================----VALIDATION---=============================================
// ==================================================================================================
// ==================================================================================================
// ADD FORM VALIDATION
function validatorNewEmployee() {
    // Clear previous errors
    clearErrors();

    let isValid = true;

    // Get all field elements
    const name = document.getElementById('employee_name');
    const email = document.getElementById('email');
    const personalEmail = document.getElementById('personalEmail');
    const password = document.getElementById('password');
    const roles = document.getElementById('roles');
    const joiningDate = document.getElementById('joiningDate');
    const mobile = document.getElementById('mobile');
    const DOB = document.getElementById('DOB');
    const status = document.getElementById('status');
    const departments = document.getElementById('departments');
    const designations = document.getElementById('designations');

    // Validation logic
    if (!employee_name.value.trim() || /\d/.test(employee_name.value)) {
        showError(name, 'Enter a valid name');
        isValid = false;
    }

    if (!email.value.trim()) {
        showError(email, 'Email is required');
        isValid = false;
    }

    if (!personalEmail.value.trim()) {
        showError(personalEmail, 'Personal Email is required');
        isValid = false;
    }

    if (email.value === personalEmail.value) {
        showError(personalEmail, 'Personal Email cannot be the same as official email');
        isValid = false;
    }

    if (!password.value.trim()) {
        showError(password, 'Password is required');
        isValid = false;
    }

    if (!roles.value.trim()) {
        showError(roles, 'Please select a role');
        isValid = false;
    }

    if (!joiningDate.value.trim()) {
        showError(joiningDate, 'Joining date is required');
        isValid = false;
    }

    const mobileValue = mobile.value.trim();
    if (!mobileValue || mobileValue.length < 10 || mobileValue.length > 13 || !/^\d+$/.test(mobileValue)) {
        showError(mobile, 'Enter a valid phone number');
        isValid = false;
    }

    if (!DOB.value.trim()) {
        showError(DOB, 'Date of Birth is required');
        isValid = false;
    }

    if (!status.value.trim()) {
        showError(status, 'Please select a status');
        isValid = false;
    }

    if (!departments.value.trim()) {
        showError(departments, 'Please select a department');
        isValid = false;
    }

    if (!designations.value.trim()) {
        showError(designations, 'Please select a designation');
        isValid = false;
    }

    return isValid;
}
// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------
// EDIT FORM VALIDATION
function validatorEditEmployee() {
    clearErrors();

    let isValid = true;

    // Get all field elements
    const name = document.getElementById('update-name');
    const mobile = document.getElementById('update-mobile');
    const joiningDate = document.getElementById('update-joiningDate');
    const status = document.getElementById('update-status');
    const department = document.getElementById('update-department');
    const designation = document.getElementById('update-designation');
    const DOB = document.getElementById('update-DOB');

    // Validation logic
    if (!name.value.trim() || /\d/.test(name.value)) {
        showError(name, 'Enter a valid name without numbers');
        isValid = false;
    }

    const mobileValue = mobile.value.trim();
    if (!mobileValue || mobileValue.length < 10 || mobileValue.length > 13 || !/^\d+$/.test(mobileValue)) {
        showError(mobile, 'Enter a valid phone number (10-13 digits, numbers only)');
        isValid = false;
    }

    if (!joiningDate.value.trim()) {
        showError(joiningDate, 'Joining date is required');
        isValid = false;
    }

    if (!DOB.value.trim()) {
        showError(DOB, 'Date of Birth is required');
        isValid = false;
    }

    if (!status.value.trim()) {
        showError(status, 'Please select a status');
        isValid = false;
    }

    if (!department.value.trim()) {
        showError(department, 'Please select a department');
        isValid = false;
    }

    if (!designation.value.trim()) {
        showError(designation, 'Please select a designation');
        isValid = false;
    }

    return isValid;
}
// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------
// Function to show error messages inside the correct div next to labels
// --------------------------------------------------------------------------------------------------
function showError(element, message) {
    const errorContainer = element.previousElementSibling; // Access the div with label
    let errorElement = errorContainer.querySelector('.text-danger.text-size');
    
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'text-danger text-size mohit_error_js_dynamic_validation';
        errorElement.style.fontSize = '10px';
        errorElement.innerHTML = `<i class="fa-solid fa-times"></i> ${message}`;
        errorContainer.appendChild(errorElement);
    } else {
        errorElement.innerHTML = `<i class="fa-solid fa-times"></i> ${message}`;
    }
}
// --------------------------------------------------------------------------------------------------
// Function to clear all error messages
// --------------------------------------------------------------------------------------------------
function clearErrors() {
    const errorMessages = document.querySelectorAll('.text-danger.text-size.mohit_error_js_dynamic_validation');
    errorMessages.forEach((msg) => msg.remove());
}

// Remove data from employee list 
document.addEventListener('removeDataFromEmployee',()=>{
    let User_role = localStorage.getItem("User_role");

    let addEmployeeButton = document.getElementById('add-employee-btn')
    let employeeAction = document.getElementById('employee-action');
    let employeeTable = document.getElementById('tableData').children
    let downloadExcelFile = document.getElementById('download_excel_multiple_file');
    let deleteButton = document.getElementById('delete_btn_multiple_file')
    if(User_role == "Manager"){
        addEmployeeButton.remove();
        employeeAction.remove();
        downloadExcelFile.remove();
        deleteButton.remove();
        for(let i=0; i<employeeTable.length; i++){
            if (employeeTable[i] && employeeTable[i].cells && employeeTable[i].cells[7]) {
                employeeTable[i].cells[8].remove();
            } 
        }
    }
})