if (!localStorage.getItem("token")) {
    window.location.href = 'index.html';
}
// =================================================================================
import { loading_shimmer, remove_loading_shimmer } from './globalFunctions1.js';
import { formatDate, capitalizeFirstLetter } from './globalFunctions2.js'
import { invoice_API, user_API, project_API } from './apis.js';
// =================================================================================
const token = localStorage.getItem('token');
// =========================================================================================
// =========================================================================================
// =========================================================================================
// =========================================================================================
async function clientsDetails(_id_param) {
    try {
        let r = await fetch(`${user_API}/get/${_id_param}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        
        let r2 = await r.json();

        document.getElementById("clientName").innerText = r2?.name;
        document.getElementById("clientph").innerText = r2?.mobile;
        document.getElementById("clientMail").innerText = r2?.email;
    } catch (error) {
        console.error('Error updating client:', error);
    }
}
async function projDetails(_id_param) {
    const response = await fetch(`${project_API}/get/${_id_param}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
    });

    let r2 = await response.json();

    document.getElementById("proNm").innerHTML = `${r2?.projectName} (${r2?.projectId})`;    
}
// =========================================================================================

// var resp;
async function load_data() {
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    
    let id = new URLSearchParams(window.location.search).get("id");
    const URL = `${invoice_API}/get/${id}`;
    const responseData = await fetch(URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    let resp = await responseData.json();
    const tableData = document.getElementById('tableData')
    var x = '';
    resp?.details.map((e,i)=>{
        x += `<tr>
            <td>${i + 1}</td>
            <td>${e.item}</td>
            <td>${e.description}</td>
            <td>${e.unitCost}</td>
            <td>${e.qty}</td>
            <td>₹ ${e.amount}</td>
            </tr>`;
    })
    tableData.innerHTML = x;

    console.log("brrr :--- ",resp)


    try{
        document.getElementById("estId").innerText = resp?.invoiceId;
        document.getElementById("createDate").innerText = formatDate(resp?.invoiceDate);
        document.getElementById("expiryDate").innerText = formatDate(resp?.dueDate);
        document.getElementById("clientAddr").innerText = resp?.billingAddress;

        document.getElementById("subTotal").innerText = `₹ ${resp?.total}`;
        document.getElementById("taxType").innerText = resp?.taxType;
        document.getElementById("taxAmt").innerText = `${resp?.tax}%`;
        document.getElementById("discountAmt").innerText = `${resp?.discount}%`
        document.getElementById("grandTotal").innerText = `₹ ${resp?.GrandTotal}`;

        document.getElementById("otherInfo").innerText = resp?.otherInfo;

    } catch(error){
        console.log(error);
    }
    try{
        // await clientsDetails(resp?.client);

        document.getElementById("clientName").innerText = resp?.client?.name;
        document.getElementById("clientph").innerText = resp?.client?.mobile;
        document.getElementById("clientMail").innerText = resp?.client?.email;
    } catch(error){
        console.log(error);
    }
    try{
        // await projDetails(resp?.project);

        document.getElementById("proNm").innerHTML = `${resp?.project?.projectName} (${resp?.project?.projectId})`; 
    } catch(error){
        console.log(error);
    }
    // ----------------------------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
}
load_data();

window.handleClickToDownloadPdf = function handleClickToDownloadPdf(){
    const generatePdfFile = document.getElementById('generatePdfFile');
    html2pdf(generatePdfFile);
}