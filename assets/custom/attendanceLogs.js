import {attendance_API} from './apis.js'

const token = localStorage.getItem('token');
async function all_data_load_dashboard(){
    const attendanceTableBody = document.getElementById('attendanceTableBody');
    try{
        const response = await fetch(`${attendance_API}/today?page=${1}&limit=${10}`,{
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type':'application/json'
            }
        });
        
        let res = await response.json();
        console.log(res);
        let thData = document.getElementById('dateData').cells
        res.attendanceStatus.map((e,index)=>{
            let date = e.date.split('-')[2];
            let row = `<tr><td>${e.name}</td>`
            for(var i=1; i<thData.length; i++){
                if(thData[i].innerText == date){
                    if(e.status === "Absent"){
                        row+='<td><i class="fa fa-close text-danger"></i></td>'
                    }
                    else{
                  row+=`<td class="text-center"><i class="fa-solid fa-check text-success"></i></td>`
                    }
                }
                else if(Number(thData[i].innerText) > Number(date)){
                    continue
                }
                else{
                    row+='<td><i class="fa fa-close text-danger"></i></td>';
                }
            }
            row+='</tr>'
            attendanceTableBody.innerHTML += row;
        })
    }
    catch(error){
        console.log(error);
    }
}
document.addEventListener("DOMContentLoaded", all_data_load_dashboard);
// document.addEventListener("search-functionality", all_data_load_dashboard);
const searchFunctionality = document.getElementById('search-functionality')

searchFunctionality.addEventListener('click',searchFunctionalityOnMonthYear);

async function searchFunctionalityOnMonthYear(){
    const attendanceTableBody = document.getElementById('attendanceTableBody');
    let month = document.getElementById('search-by-month');
    let year = document.getElementById('search-by-year');
    try{
        const response = await fetch(`${attendance_API}/monthYear/get?month=${month.value}&year=${year.value}`,{
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type':'application/json'
            }
        });
        
        let res = await response.json();
        console.log(res);
        let thData = document.getElementById('dateData').cells
        // res.attendanceRecords.map((e,index)=>{
        //     let date = e.attendance.date.split('-')[2];
        //     let row = `<tr><td>${e.name}</td>`
        //     for(var i=1; i<thData.length; i++){
        //         if(thData[i].innerText == date){
        //             if(e.attendance.status === "Absent"){
        //                 row+='<td><i class="fa fa-close text-danger"></i></td>'
        //             }
        //             else{
        //           row+=`<td class="text-center"><i class="fa-solid fa-check text-success"></i></td>`
        //             }
        //         }
        //         else if(Number(thData[i].innerText) > Number(date)){
        //             continue
        //         }
        //         else{
        //             row+='<td><i class="fa fa-close text-danger"></i></td>';
        //         }
        //     }
        //     row+='</tr>'
        //     attendanceTableBody.innerHTML += row;
        // })
    }
    catch(error){
        console.log(error);
    }
}
// attendanceRecords
