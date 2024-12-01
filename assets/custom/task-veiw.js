if (!localStorage.getItem("token")) {
    window.location.href = 'index.html';
}
// =================================================================================
import { loading_shimmer, remove_loading_shimmer } from './globalFunctions1.js';
import {main_hidder_function} from './gloabl_hide.js';
import { formatDate, capitalizeFirstLetter } from './globalFunctions2.js'
// -------------------------------------------------------------------------
import { task_API } from './apis.js';
// =================================================================================
const token = localStorage.getItem('token');
let _id_param = new URLSearchParams(window.location.search).get("id");
// =================================================================================
// =======================================================

taskViewLoad();
async function taskViewLoad() {
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    try{
        const r1 = await fetch(`${task_API}/get/${_id_param}`, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
        });
        if(!r1.ok){
            throw new Error();
        }
        let r2 = await r1.json();   
    
        document.getElementById("taskName").innerText = `${r2?.title || '-'} `;
        document.getElementById("viewDescription").innerText = r2?.taskDescription || '-';
    //   =========================================================================================
        let aa1 = document.getElementById("taskTableId");
        let tbodyone = document.createElement("tbody");
        tbodyone.innerHTML = `
                            <tr>
                                <td>Project : </td>
                                <td class="text-end"><a href='project-view.html?id=${r2?.project?._id}'>${r2?.project?.projectName} (${r2?.project?.projectId})</a> </td>
                            </tr>
                            <tr>
                                <td>Assigned By : </td>
                                <td class="text-end">${r2?.assignedBy?.name} (${r2?.assignedBy?.userId})</td>
                            </tr>
                            <tr>
                                <td>Start Date : </td>
                                <td class="text-end" id="startDate">${formatDate(r2?.startDate)}</td>
                            </tr>
                            <tr>
                                <td>Complate Date : </td>
                                <td class="text-end" id="complateDate">${formatDate(r2?.complateDate)}</td>
                            </tr>
                            <tr>
                                <td>Deadline Date : </td>
                                <td class="text-end" id="deadlineDate">${formatDate(r2?.deadlineDate)}</td>
                            </tr>
                            <tr>
                                <td>Status : </td>
                                <td class="text-end">${r2?.status}</td>
                            </tr>
                            <tr>
                                <td>Units : </td>
                                <td class="text-end">${r2?.unit}</td>
                            </tr>
                            <tr>
                                <td>Quantity : </td>
                                <td class="text-end">${r2?.quantity}</td>
                            </tr>
                            <tr>
                            <td>Work Site Addrress : </td>
                            <td class="text-end">${r2?.siteAddress}</td>
                        </tr>`
        tbodyone.id = 'tbodyone';
        aa1.appendChild(tbodyone);
    //   =========================================================================================
        let aa2 = document.getElementById("assigned-project-list");
        (r2?.assignedTo).map((e)=>{
            let li1 = document.createElement("li");
            li1.innerHTML = `<a href="userProfile.html?id=${e?._id}" style="color:black;" >  ${e?.ContractorName} (${e?.contractorId})</a>`;
            aa2.appendChild(li1);
        });
    
        // =========================================================================================
    
        let rd_doc = r2?.files;
        if(rd_doc.length!=0){
          document.getElementById("file_main_div").classList.remove("d-none");
          let uploaded_files = document.getElementById("uploaded_files");
          uploaded_files.classList.remove("d-none");
      
          let uploaded_files_tbodyone = document.getElementById("uploaded_files_tbodyone");
          rd_doc.map((ee,i)=>{
            let rowNew = document.createElement("tr");
            rowNew.innerHTML = `
                                <td>${i+1}</td>
                                <td>
                                    <input class="form-control" type="name" value="File ${i+1}" disabled id="paymentDate">
                                </td>
                                <td class="text-center">
                                            
                                  <div class="dropdown dropdown-action">
                                      <a href="#" class="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i
                                      class="material-icons">more_vert</i></a>
                                      <div class="dropdown-menu dropdown-menu-right">
                                          <a  href="${ee}" target="_blank" class="dropdown-item" ><i class="fa-regular fa-eye"></i> View</a>
                                      </div>
                                  </div>
                                </td>`;
            uploaded_files_tbodyone.appendChild(rowNew);
          })
      
        }else {
          document.getElementById("file_main_div").classList.add("d-none");
          document.getElementById("uploaded_files").classList.add("d-none");
        }
    } catch(error){
        window.location.href = 'tasks.html';
    }
    // ----------------------------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
    try{
        main_hidder_function();
    } catch (error){console.log(error)}
}




document.getElementById("edit_task_btn").addEventListener("click", function(){
      window.location.href = `edit-tasks.html?id=${_id_param}`;
  })
  

