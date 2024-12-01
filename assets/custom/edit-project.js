if(!localStorage.getItem("token")) {
  window.location.href = 'index.html';
}

import { status_popup, loading_shimmer, remove_loading_shimmer } from './globalFunctions1.js';
import {user_API,project_API} from './apis.js';

const token = localStorage.getItem('token');

// =======================================================
// =======================================================
let id_param = new URLSearchParams(window.location.search).get("id");
global_price_calculate();
// =======================================================

async function editDateLoad() {
  try{
    loading_shimmer();
  } catch(error){console.log(error)}
  var responseData;
  const projectName = document.getElementById("projectName");
  const startDate = document.getElementById("startDate");
  const price = document.getElementById("price");
  const deadline = document.getElementById("deadline");
  const client = document.getElementById("client_select_option");
  const assignedTo = document.getElementById("emp_select_option");
  const status = document.getElementById("statuss");
  const description = document.getElementById("description");
  const tax = document.getElementById("tax");
  const tax_rs = document.getElementById("tax_rs");
  const taxType = document.getElementById("taxType");
  const totalPrice = document.getElementById("totalPrice");
  const discountPercentage = document.getElementById("discount_p");
  discountPercentage.setAttribute("disabled", "disabled");
  const discountRupee = document.getElementById("discount_rs");  
  
  try {
    const response = await fetch(`${project_API}/get/${id_param}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if(!response.ok){
      throw new Error();
    }
    
    responseData = await response.json();
    
    let c;
    let callAgreementTable;
    try{
      document.getElementById("id_hidden").value = responseData?._id;;
      projectName.value = responseData?.projectDetails.projectName;
      price.value = responseData?.projectDetails.price;
      status.value = responseData?.projectDetails.status;
      description.value = responseData?.projectDetails.description;
      assignedTo.value = responseData?.projectDetails.assignedTo._id;
      client.value = responseData?.projectDetails.clientName._id;
      startDate.value = responseData?.projectDetails.startDate;
      deadline.value = responseData?.projectDetails.deadline;
      tax.value = responseData?.projectDetails.tax;
      tax_rs.value = responseData?.projectDetails.tax_rs;
      taxType.value = responseData?.projectDetails.taxType;
      totalPrice.value = responseData?.projectDetails.totalPrice;
      discountPercentage.value = responseData?.projectDetails.discountPercentage;
      discountRupee.value = responseData?.projectDetails.discountRupee;
      c = responseData?.projectDetails.installmentDetails;
      callAgreementTable = responseData.projectDetails.paymentDetails
    } catch(error){console.log(error)}

    try{
      let rd_doc = responseData?.document;
      if(rd_doc.length!=0){
        let uploaded_files = document.getElementById("uploaded_files");
        uploaded_files.classList.remove("d-none");
  
        let uploaded_files_tbodyone = document.getElementById("uploaded_files_tbodyone");
        rd_doc.map((ee,i)=>{
          // console.log("aldsjfas :0 ",ee)
          let rowNew = document.createElement("tr");
          rowNew.innerHTML = `
                              <td>${i+1}</td>
                              <td>
                                  <input class="form-control" type="name" value="File ${i+1}" disabled id="paymentDate">
                              </td>
                              <td class="text-center">
                                <a href="${ee}" target="_blank" class="text-success font-18 "><i class="fa-solid fa-eye"></i></a>
                              </td>`;
          uploaded_files_tbodyone.appendChild(rowNew);
        })
  
      }else {
        document.getElementById("uploaded_files").classList.add("d-none");
      }  
    } catch(error){console.log(error)}
    try{
      for (let i = 0; i < c.length; i++) {
        if (c.length - 1 != i) {
          addInvoiceTableRow("addTable");
        }
        const rows = document.querySelectorAll(".tbodyone tr");
        const data = [];
        rows.forEach((row, rowIndex) => {
          const cells = row.querySelectorAll("td");
          const installmentDetails = {
            paymentDate: cells[1]?.querySelector("input"),
            paymentAmount: cells[2]?.querySelector("input"),
            paymentStatus: cells[3]?.querySelector("select"),
            paidDate: cells[4]?.querySelector("input"),
            _id: cells[5]?.querySelector("input"),
          };
          responseData.installmentDetails.forEach((e, i) => {
            if (i === rowIndex) {
              installmentDetails.paymentDate.value = e?.paymentDate;
              installmentDetails.paymentAmount.value = e?.paymentAmount;
              installmentDetails.paymentStatus.value = e?.paymentStatus;
              installmentDetails.paidDate.value = e?.paidDate;
            }
          });
          data.push(installmentDetails);
        });
      }

      for (let i = 0; i < callAgreementTable.length; i++) {
        if (callAgreementTable.length - 1 != i) {
          addAgreementTable();
        }
        let paymentArr = [];
        const paymentRow = document.querySelectorAll(".agreementTbody tr");
        paymentRow.forEach((rows, Index) => {
            const cells = rows.querySelectorAll("td");
            const paymentDetails = {
              select: cells[1]?.querySelector("select"),
              remarks: cells[2]?.querySelector("input"),
              amount: cells[3]?.querySelector("input"),
            }
            responseData.paymentDetails.map((e,i)=>{
              if(Index===i){
                if (paymentDetails.select) paymentDetails.select.value = e.select;
                if (paymentDetails.remarks) paymentDetails.remarks.value = e.remarks;
                if (paymentDetails.amount) paymentDetails.amount.value = e.amount;
              }
            })
            paymentArr.push(paymentDetails)
          })
      }
    } catch(error){console.log(error);}
  } catch(error) {
    console.log("brasldf;klasjdfla sdf; : ",error);
    window.location.href = 'project-list.html'; 
  }
  // ----------------------------------------------------------------------------------------------------
  try{
      remove_loading_shimmer();
  } catch(error){console.log(error)}
}

// ========================================================================================================
// window.onload = async () => {

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
      option.value = client?._id;
      option.text = client?.name;
      client_select_option.appendChild(option);
    });
  
    // Populate employees dropdown
    res.users.employees.forEach((employee) => {
      const option = document.createElement("option");
      option.value = employee?._id;
      option.text = employee?.name;
      emp_select_option.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    alert('Failed to load client and employee data.');
  }
  
  editDateLoad();
// };
  // ========================================================================================================
  // ========================================================================================================
  // ========================================================================================================
  // ========================================================================================================
  // ========================================================================================================


  const updateProjectForm = document.getElementById("update_project_form");
  updateProjectForm.addEventListener("submit", async(event) => {
    event.preventDefault();
    
    if (!validateProjectForm() || !validateInstallmentAmounts()) {
      return; // Stop form submission if validation fails
    }
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    
    try {
      const formData = new FormData();
      
      const files = document.getElementById("project-file").files;
      for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
        // console.log("My file DATA", files[i]);
      }
      
      const _id = document.getElementById("id_hidden").value;
      const projectName = document.getElementById("projectName").value;
      const client = document.getElementById("client_select_option").value;
      const startDate = document.getElementById("startDate").value;
      const deadline = document.getElementById("deadline").value;
      const price = document.getElementById("price").value;
      const status = document.getElementById("statuss").value;
      const assignedTo = document.getElementById("emp_select_option").value
      const description = document.getElementById("description").value;
      const tax = document.getElementById("tax").value;
      const tax_rs = document.getElementById("tax_rs").value;
      const taxType = document.getElementById("taxType").value;
      const discountPercentage = document.getElementById("discount_p").value;
      const discountRupee = document.getElementById("discount_rs").value;
      const totalPrice = document.getElementById("totalPrice").value;

      const rows = document.querySelectorAll(".tbodyone tr");
      const data = [];
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        // console.log("brooo :- ", cells);
        const installmentDetails = {
          paymentDate: cells[1]?.querySelector("input")?.value || "undefined",
          paymentAmount: cells[2]?.querySelector("input")?.value || "undefined",
          paymentStatus: cells[3]?.querySelector("select")?.value || "undefined",
          paidDate: cells[4]?.querySelector("input")?.value || "undefined",
          _id: cells[5]?.querySelector("input")?.value || "undefined",
        };
        data.push(installmentDetails);
      });

      let a = document.querySelectorAll('.agreementTbody tr')
      let paymentArr=[];
      a.forEach((rows, i) => {
        const cells = rows.querySelectorAll("td");
        const paymentDetails = {
            select: cells[1]?.querySelector("select")?.value || "undefined",
            remarks: cells[2]?.querySelector("input")?.value || "undefined",
            amount: cells[3]?.querySelector("input")?.value || "undefined"
        };
        paymentArr.push(paymentDetails)
    });
      
      formData.append("tax_rs",tax_rs);
      formData.append("projectName", projectName);
      formData.append("clientName", client);
      formData.append("startDate", startDate);
      formData.append("deadline", deadline);
      formData.append("price", price);
      formData.append("status", status);
      formData.append("assignedTo", assignedTo);
      formData.append("description", description);
      formData.append("tax", tax);
      formData.append("taxType", taxType);
      formData.append("discountPercentage", discountPercentage);
      formData.append("discountRupee", discountRupee);
      formData.append("totalPrice", totalPrice);
      formData.append("_id", _id);
      
      
      data.forEach((item, index) => {
        formData.append(
          `installmentDetails[${index}][paymentDate]`,
          item.paidDate
        );
        formData.append(
          `installmentDetails[${index}][paymentAmount]`,
          item.paymentAmount
        );
        formData.append(
          `installmentDetails[${index}][paidDate]`,
          item.paymentDate
        );
        formData.append(
          `installmentDetails[${index}][paymentStatus]`,
          item.paymentStatus
        );
      });

      paymentArr.map((e,i)=>{
        formData.append(
          `paymentDetails[${i}][select]`,
          e.select
        );
        formData.append(
          `paymentDetails[${i}][remarks]`,
          e.remarks
        )
        formData.append(
          `paymentDetails[${i}][amount]`,
          e.amount
        )
      })
      // console.log("My Form Data is ", formData);
      const response = await fetch(`${project_API}/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'application/json'
        },
        body: formData,
      });
      
      const c1 = (response.ok);
      status_popup( ((c1) ? "Data Updated <br> Successfully" : "Please try <br> again later"), (c1));

      let z1 = Number(document.getElementById("b1b1").innerText);
      setTimeout(function(){
        window.location.href = `project-list.html?id=${id_param}`;
      }, (z1*1000));

      
    } catch (error) {
      status_popup( ("Please try <br> again later"), (false));
      console.log(error)
    }
    // ----------------------------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
  });
// }


// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================



window.removeInvoiceTableRow = function removeInvoiceTableRow(i, tag_id) {
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
  // console.log("this is made by me, ADD INVOICE TABLE ROW");
  const varTableConst = document.getElementById(tag_id).children[1].children;
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
                            <option value="Active">Paid</option>
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
