if (!localStorage.getItem("token")) {
    localStorage();
    window.location.href = 'index.html';
}
// =================================================================================
 import { contractor_API,project_API } from './apis.js';
// -------------------------------------------------------------------------
 // -------------------------------------------------------------------------
//  import {rtnPaginationParameters } from './globalFunctionPagination.js';
// =================================================================================
const token = localStorage.getItem('token');
// =================================================================================
// Function to handle search and update the same table
let task;
window.all_data_load_dashboard = async function getContractorDetailsById(){
    let id = new URLSearchParams(window.location.search).get("id");
    const response = await fetch(`${contractor_API}/get?id=${id}`,{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        }
    })
    const res = await response.json()
    console.log('My Contrater Data is ',res)

    document.getElementById('name').innerText = res.ContractorName;
    document.getElementById('mobile').innerText = res.mobile;
    document.getElementById('email').innerText = res.email;
    // document.getElementById('DOB').innerText = res.ContractorName;
    document.getElementById('address').innerText = res.address;
    document.getElementById('gender').innerText = res.gender;
    // document.getElementById('name').innerText = res.ContractorName;

    // project API 
    const projectResponse = await fetch(`${project_API}/get`,{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        }
    })
    const projectRes = await projectResponse.json();
    let project = projectRes.data;
    let x='';
    let projectDetails = document.getElementById('project-details')
    console.log(project);
    for( let i=0; i<res.projectName.length; i++){
    project.map((e,index)=>{
        if(e._id == res.projectName[i]._id){ 
                task=e.tasks
               x+= `
                                <div class="card">
                                    <div class="card-body">
                                        <div class="dropdown profile-action">
                                            <a aria-expanded="false" data-bs-toggle="dropdown"
                                                class="action-icon dropdown-toggle" href="#"><i
                                                    class="material-icons">more_vert</i></a>
                                            <div class="dropdown-menu dropdown-menu-right">
                                                <a data-bs-target="#Add_block" data-bs-toggle="modal" href="#"
                                                    class="dropdown-item"><i class="fa-solid fa-plus m-r-5"></i>
                                                    Add District</a>
                                                    <a data-bs-target="#edit_block" data-bs-toggle="modal" href="#"
                                                    class="dropdown-item"><i class="fa-solid fa-pencil m-r-5"></i>
                                                    Edit District</a>
                                                <a data-bs-target="#delete_project" data-bs-toggle="modal" href="#"
                                                    class="dropdown-item"><i class="fa-regular fa-trash-can m-r-5"></i>
                                                    Delete Project</a>
                                            </div>
                                        </div>
                                        <h4 class="project-title"><a href="project-view.html">${e.projectName}</a></h4>
                                        <small class="block text-ellipsis m-b-15">
                                            
                                            <span class="text-xs">${e.tasks.length}</span> <span class="text-muted">tasks
                                                completed</span>
                                        </small>
                                        <p class="text-muted">${e.description}
                                        </p>
                                        <div class="pro-deadline m-b-15">
                                            <div class="sub-title">
                                                Deadline:
                                            </div>
                                            <div class="text-muted">
                                                ${e.deadline}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `
            }
    })
}
  projectDetails.innerHTML = x;   
}

window.onload = all_data_load_dashboard();

let showTaskData = document.getElementById('show-task-data');
showTaskData.addEventListener('click',async()=>{
    console.log('my tasks: ',task)
})

