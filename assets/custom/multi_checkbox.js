// selected checkbox, '_id' return in array return type
export function r_arr1(){
    let arr1 = [];
    Array.from(document.querySelectorAll(".checkbox_child")).map((e)=>{
        if(e.checked){
            arr1.push(e.value);
        }
    });
    return arr1; 
}
  
//function to uncheck the all checkbox....
export function u_arr1(){
    document.querySelector(".checkbox_all").checked = false;
    Array.from(document.querySelectorAll(".checkbox_child")).map((e)=>{
        e.checked = false;
    });
}

// checkbox functionality :- (1. click on SELECT ALL CHECKBOX) (2. SELECTED ALL CHECKBOX) :- (on SELECT ALL CHECKBOX)
export function checkbox_function(){
    try{
        document.querySelector(".checkbox_all").addEventListener('change', function(){
            if(this.checked){
                Array.from(document.querySelectorAll(".checkbox_child")).map(e=>e.checked=true);
                enableBtns();
            } else {
                Array.from(document.querySelectorAll(".checkbox_child")).map(e=>e.checked=false);
                disableBtns();
            }
        });
    } catch(error){console.log(error)}
    try{
        Array.from(document.querySelectorAll(".checkbox_child")).map((e)=>{
            e.addEventListener('change',function(){
                let a = true, b = false;
                Array.from(document.querySelectorAll(".checkbox_child")).map((e2)=>{
                    (!e2.checked) ? (a=false) : (b=true);
                });
                (a) ? (document.querySelector(".checkbox_all").checked = true ) : (document.querySelector(".checkbox_all").checked = false);
                (b) ? (enableBtns()) : (disableBtns());
            });
        });
    } catch (error){console.log(error)}
};

// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
export function enableBtns(){
    ["delete_btn_multiple_file", "download_excel_multiple_file"].map(e => 
        document.getElementById(e).classList.remove("disabled")
    );
}
export function disableBtns(){
    ["delete_btn_multiple_file", "download_excel_multiple_file"].map(e => 
        document.getElementById(e).classList.add("disabled")
    );
}