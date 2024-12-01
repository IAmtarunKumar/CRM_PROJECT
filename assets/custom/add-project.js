if(!localStorage.getItem("token")) {
  window.location.href = 'index.html';
}

import { status_popup, loading_shimmer, remove_loading_shimmer } from './globalFunctions1.js';
import {user_API,project_API} from './apis.js';

const token = localStorage.getItem('token');

// =======================================================
// =======================================================
// =======================================================


global_price_calculate();

// Fetch clients and employees on page load
try {
  const response = await fetch(`${user_API}/data/get`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  
  const res = await response.json();

  const client_select_option = document.getElementById("client_select_option");
  const emp_select_option = document.getElementById("emp_select_option");

  // Populate clients dropdown
  res.users.clients.forEach((client) => {
    const option = document.createElement("option");
    option.value = client._id;
    option.text = `${client?.name} (${client?.userId})`;
    client_select_option.appendChild(option);
  });

  // Populate employees dropdown
  res.users.employees.forEach((employee) => {
    const option = document.createElement("option");
    option.value = employee._id;
    option.text = `${employee?.name} (${employee?.userId})`;
    emp_select_option.appendChild(option);
  });
} catch (error) {
  console.error('Error fetching data:', error);
  alert('Failed to load client and employee data.');
}
// =============================================================================================
// =============================================================================================
// =============================================================================================

// Form submission for adding a new project
document.getElementById("add_project_form").addEventListener("submit", async function (event) {
  event.preventDefault();
 
  if (!validateProjectForm() || !validateInstallmentAmounts()) {
    return; // Stop form submission if validation fails
  }
  try{
      loading_shimmer();
  } catch(error){console.log(error)}
  try {
    const formData = new FormData();

    // Append project files
    const files = document.getElementById("project-file").files;
    for (const file of files) {
      formData.append("file", file);
    }

    // Append form fields
    formData.append("projectName", document.getElementById("projectName").value);
    formData.append("clientName", document.getElementById("client_select_option").value);
    formData.append("startDate", document.getElementById("startDate").value);
    formData.append("deadline", document.getElementById("deadline").value);
    formData.append("price", document.getElementById("price").value);
    formData.append("status", document.getElementById("statuss").value);
    formData.append("assignedTo", document.getElementById("emp_select_option").value);
    formData.append("description", document.getElementById("description").value);
    formData.append("tax", document.getElementById("tax").value);
    formData.append("tax_rs", document.getElementById("tax_rs").value);
    formData.append("taxType", document.getElementById("taxType").value);
    formData.append("discountPercentage", document.getElementById("discount_p").value);
    formData.append("discountRupee", document.getElementById("discount_rs").value);
    formData.append("totalPrice", document.getElementById("totalPrice").value);

    // Collect installment details
    const rows = document.querySelectorAll(".tbodyone tr");
    rows.forEach((row, index) => {
      const cells = row.querySelectorAll("td");
      formData.append(`installmentDetails[${index}][paymentDate]`, cells[1]?.querySelector("input")?.value || "undefined");
      formData.append(`installmentDetails[${index}][paymentAmount]`, cells[2]?.querySelector("input")?.value || "undefined");
      formData.append(`installmentDetails[${index}][paymentStatus]`, cells[3]?.querySelector("select")?.value || "undefined");
      formData.append(`installmentDetails[${index}][paidDate]`, cells[4]?.querySelector("input")?.value || "undefined");
    });

    // Collect Payment section

    let a = document.querySelectorAll('.agreementTbody tr')
   a.forEach((rows,i)=>{
   const cells = rows.querySelectorAll('td');
   formData.append(`paymentDetails[${i}][select]`, cells[1]?.querySelector("select")?.value || "undefined");
    formData.append(`paymentDetails[${i}][remarks]`, cells[2]?.querySelector("input")?.value || "undefined");
    formData.append(`paymentDetails[${i}][amount]`, cells[3]?.querySelector("input")?.value || "undefined");
})

    console.log("Form Data:", formData);

    // Send form data to server
    const response = await fetch(`${project_API}/post`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    
    const c1 = (response.ok);
    let _idd = (await response.json())?.project?._id;
    try{
        status_popup( ((c1) ? "Data Added <br> Successfully" : "Please try <br> again later"), (c1) );
        setTimeout(function(){
            window.location.href = `project-view.html?id=${_idd}`;
        },(Number(document.getElementById("b1b1").innerText)*1000));
    } catch (error){
      status_popup( ("Please try <br> again later"), (false) );
    }
  } catch (error) {
    status_popup( ("Please try <br> again later"), (false) );
  }
  // ----------------------------------------------------------------------------------------------------
  try{
      remove_loading_shimmer();
  } catch(error){console.log(error)}
});

// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================



window.removeInvoiceTableRow = function removeInvoiceTableRow(i, tag_id) {
  console.log("this is made by me, REMOVE INVOICE TABLE ROW");
  document.getElementById(tag_id).children[1].children[i - 1].remove();
  Array.from(document.getElementById(tag_id).children[1].children).map(
    (e, i) => {
      var dummyNo1 = i + 1;
      if (dummyNo1 != 1) {
        e.cells[0].innerText = dummyNo1;
        e.cells[
          e.cells.length - 1
        ].innerHTML = `<a href="javascript:void(0)" class="text-danger font-18 remove" onClick="removeInvoiceTableRow(${dummyNo1}, '${tag_id}')" title="Remove"><i class="fa-regular fa-trash-can"></i></a>`;
      }
    }
  );
}
// Add Table Row function globally declared for reuse
window.addInvoiceTableRow = function addInvoiceTableRow(tag_id) {
  console.log("this is made by me, ADD INVOICE TABLE ROW",tag_id);
  const varTableConst = document.getElementById(tag_id).children[1].children;
  console.log('varTableConst: ',varTableConst)
  const i =
    Number(varTableConst[varTableConst.length - 1].cells[0].innerText) + 1;
  var tableBody = document.createElement("tr");
  tableBody.innerHTML = `
                          <td>${i}</td>
                        <td>
                           <input class="form-control paymentDate" type="date" id="paymentDate">
                        </td>
                        <td>
                          <input class="form-control paymentAmount" type="number"  placeholder="Enter Installment Amount" id="paymentAmount" min="0" onkeypress="return event.charCode >= 48 && event.charCode <= 57">
                        </td>
                        <td>
                          <select class="form-control paymentStatus" id="paymentStatus">
                            <option value="" disabled="" selected="">Select Status</option>
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending</option>
                          </select>
                        </td>
                        <td>
                          <input class="form-control paidDate" type="date" id="paidDate">
                        </td>
                        <td class="text-center"><a href="javascript:void(0)" class="text-danger font-18 addProduct" onclick="removeInvoiceTableRow(${i}, '${tag_id}')" title="Remove"><i class="fa-regular fa-trash-can"></i></a>
                        </td>
                      `;
  tableBody.classList.add("installmentData");
  document.querySelector(".tbodyone").appendChild(tableBody);
  // a = Array.from(document.getElementsByClassName("addProduct"));
}

// ===========================================================================
// ===========================================================================
// ===========================================================================
// ===========================================================================

function global_price_calculate() {
  const discount_p = document.getElementById("discount_p");
  const discount_rs = document.getElementById("discount_rs");
  const price = document.getElementById("price");
  const tax_rs = document.getElementById("tax_rs");
  const totalPrice = document.getElementById("totalPrice");
  const tax = document.getElementById("tax");
  price.addEventListener("input", f1);
  tax.addEventListener("input", my_calc_1);
  discount_p.addEventListener("input", function () {
    if (Number(discount_p.value) > 0) {
      discount_rs.setAttribute("disabled", "disabled");
    } else {
      discount_rs.removeAttribute("disabled", "disabled");
    }
    f2();
  });
  discount_rs.addEventListener("input", function () {
    if (Number(discount_rs.value) > 0) {
      discount_p.setAttribute("disabled", "disabled");
    } else {
      discount_p.removeAttribute("disabled", "disabled");
    }
    f3();
  });
  function f1() {
    if (discount_p.getAttribute("disabled")) {
      f3();
    }
    if (
      discount_rs.getAttribute("disabled") ||
      Number(discount_rs.value) == 0
    ) {
      f2();
    }
  }
  function f2() {
    const p_price_12 = Number(price.value);
    const ps_discount_p = Number(discount_p.value);
    try {
      const mm_1 = formatValue_of_2((p_price_12 * ps_discount_p) / 100);
      discount_rs.value = mm_1;
    } catch {}
    my_calc_1();
  }
  function f3() {
    const p_price_12 = Number(price.value);
    const ps_discount_rs = Number(discount_rs.value);
    try {
      const mm_1 = formatValue_of_2(
        (Number(ps_discount_rs) / Number(p_price_12)) * 100
      );
      discount_p.value = mm_1;
    } catch {}
    my_calc_1();
  }
  function my_calc_1() {
    const my_aa1 = Number(tax.value);
    const my_aa2 = Number(discount_rs.value);
    const my_aa3 = Number(price.value);
    const rs_to_my_1 = formatValue_of_2(((my_aa3 - my_aa2) * my_aa1) / 100);
    tax_rs.value = rs_to_my_1;
    total_price_value_calc();
  }
  function total_price_value_calc() {
    const ma1 = Number(
      Number(price.value) - Number(discount_rs.value) + Number(tax_rs.value)
    );
    totalPrice.value = Math.floor(ma1);
  }
  function formatValue_of_2(value) {
    // Convert the value to a number
    const num = parseFloat(value);
    // Check if the number is an integer
    if (Number.isInteger(num)) {
      return num.toString(); // Return as a string without decimals
    }
    // Convert to string and split by the decimal point
    const parts = num.toString().split(".");
    // If there are more than 2 decimal places, truncate to 2
    if (parts[1] && parts[1].length > 2) {
      return num.toFixed(2);
    }
    // Otherwise, return the original number
    return num.toString();
  }
}
// ==========================================================================================
// ==========================================================================================
// ==========================================================================================
// ==========================================================================================

// Validation function for add project form
function validateProjectForm() {
  clearErrors(); // Clear previous error messages

  let isValid = true;

  // Get field elements
  const projectName = document.getElementById("projectName");
  const clientName = document.getElementById("client_select_option");
  const startDate = document.getElementById("startDate");
  const deadline = document.getElementById("deadline");
  const status = document.getElementById("statuss");
  const assignedTo = document.getElementById("emp_select_option");
  const description = document.getElementById("description");

  // Project Name Validation
  if (!projectName.value.trim()) {
    showError(projectName, "Please enter a valid project name");
    isValid = false;
  }

  // Client Name Validation
  if (!clientName.value.trim()) {
    showError(clientName, "Please select a client");
    isValid = false;
  }

  // Start Date Validation
  if (!startDate.value.trim()) {
    showError(startDate, "Please select a start date");
    isValid = false;
  }

  // Deadline Validation
  if (!deadline.value.trim()) {
    showError(deadline, "Please select a deadline");
    isValid = false;
  } else if (new Date(deadline.value) < new Date(startDate.value)) {
    showError(deadline, "Deadline cannot be before start date");
    isValid = false;
  }

  // Status Validation
  if (!status.value.trim()) {
    showError(status, "Please select a status");
    isValid = false;
  }

  // Assigned To Validation
  if (!assignedTo.value.trim()) {
    showError(assignedTo, "Please assign the project to an employee");
    isValid = false;
  }

  // Description Validation
  if (!description.value.trim()) {
    showError(description, "Please provide a description");
    isValid = false;
  }

  return isValid;
}
// ----------------------------------------------------------------------------------

// Validation for Installment Section
function validateInstallmentAmounts() {
  clearErrors(); // Clear previous errors for installments

  const totalCalculatedAmount = parseFloat(document.getElementById("totalPrice").value) || 0;
  let totalInstallmentAmount = 0;

  const installmentAmounts = document.querySelectorAll(".paymentAmount");

  installmentAmounts.forEach((input) => {
    totalInstallmentAmount += parseFloat(input.value) || 0;
  });

  if (totalInstallmentAmount !== totalCalculatedAmount) {
    showError(
      document.querySelector(".table-responsive"),
      `Total installment amount (${totalInstallmentAmount}) must equal the total calculated amount (${totalCalculatedAmount})`
    );
    return false;
  }

  return true;
}

// ----------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------

// Function to show error messages next to labels
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

// Function to clear all error messages
function clearErrors() {
  const errorMessages = document.querySelectorAll('.text-danger.text-size.mohit_error_js_dynamic_validation');
  errorMessages.forEach((msg) => msg.remove());
}


// Adding table for Agreement 
window.addAgreementTable = function addAgreementTable(){
  let agreementTable = document.getElementById('agreementTable').children[1].children
  const i = Number(agreementTable[agreementTable.length - 1].cells[0].innerText) + 1;
  var createTableRow = document.createElement('tr')
  createTableRow.innerHTML = `<td>${i}</td>
            <td>
                <select class="form-control select">
                  <option value="" selected>Select Reason</option>
                  <option value="incomeTax">Income Tax</option>
                  <option value="gst">GST</option>
                  <option value="royalty">Royalty</option>
                  <option value="lateDeduction">Late Deduction</option>
                  <option value="securityDeposit">Security Deposit</option>
                  <option value="anyOtherDeduction">Any Other Deduction</option>
                </select>
            </td>
            <td>
              <input class="form-control" type="text">
            </td>
            <td>
              <input class="form-control" type="text">
            </td>
            <td class="text-center lm"><a href="javascript:void(0)" class="text-danger font-18 addProduct" 
            onclick="removeAgreementTable('${i}')" title="Remove">
            <i class="fa-regular fa-trash-can"></i></a>
            </td>`
      createTableRow.setAttribute('id',`tableId${i}`);
      createTableRow.classList.add('agreementData')
      document.querySelector('.agreementTbody').appendChild(createTableRow)
}

window.removeAgreementTable = function removeAgreementTable(i){
  let agreementDataId = document.getElementById(`tableId${i}`)
  agreementDataId.remove()
  let data = document.querySelector('.agreementTbody').children
  for(let val=1; val<data.length; val++){
    data[val].cells[0].innerText = val+1;
    }
}

// document.querySelector('.tbodyone').addEventListener('input', function(e) {
//   if (e.target && e.target.classList.contains('paymentAmount')) {
//     // Find the related paymentStatus dropdown in the same row
//     let paymentStatus = e.target.closest('tr').querySelector('.paymentStatus');
    
//     // Add an event listener for the change event on paymentStatus (only once)
//     paymentStatus.removeEventListener('change', handleStatusChange); 
//     paymentStatus.addEventListener('change', handleStatusChange);

//     // Define the event handler for when the paymentStatus is changed
//     function handleStatusChange() {
//       if (paymentStatus.value == 'Paid') {
//         console.log('Amount:', e.target.value); // Process the amount if status is 'Paid'
//       } else {
//         console.log('Amount not added because payment status is not Paid');
//       }
//     }
//   }
// });
let netAmount = document.getElementById('net-amount')
let f=0;
// let paymentAmount = document.getElementsByClassName('paymentAmount')
let PStatus = document.getElementsByClassName('paymentStatus')
// let agreementTableRow = document.getElementsByClassName('installmentData')

document.querySelector('.tbodyone').addEventListener('change', function(e) {
  if (e.target && (e.target.classList.contains('paymentAmount') || e.target.classList.contains('paymentStatus'))) {
    let paymentStatus = e.target.closest('tr').querySelector('.paymentStatus');
    let paymentAmount = e.target.closest('tr').querySelector('.paymentAmount');
    let amount = Number(paymentAmount.value);
    // paymentStatus.setAttribute('disable',true)

    if (paymentStatus.value==='Pending' || paymentStatus.value==='Paid') {
      paymentStatus.setAttribute('disabled',true);
      paymentAmount.setAttribute('disabled', true); 
    }
    // else if(paymentStatus.value === 'Paid' || paymentStatus.value === 'Pending'){
    //   paymentStatus.setAttribute('disabled', true);
    // }

    if (paymentStatus.value === 'Paid') {
      f+=amount
    } 
    
    else if(paymentStatus.value === 'Pending') {
      amount=0
      f+=amount
    }
    netAmount.value = f
  }
});


// for(let i=0; i<paymentStatus.length; i++){
//     paymentStatus[i].addEventListener('change',()=>{
//       let paymentSectionAmount = Number(paymentAmount[i].value)
//       if(paymentStatus[i].value === 'Paid'){
//         f+=paymentSectionAmount;
//       }
//          else if(paymentStatus[i].value === undefined || paymentStatus[i].value === null || paymentStatus[i].value === 'Pending'){
//           paymentSectionAmount = 0;
//           paymentSectionAmount+=f
//         }
//         else if(!agreementTableRow){
//           paymentSectionAmount = 0;
//           paymentSectionAmount+=f
//         }
//         netAmount.value=f
//     })
// }
