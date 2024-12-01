async function f(i) {

    let clientName = "673acd5bfa1b23bcd7f6839c";
    let projectName =  `name - ${i}` ;
    let assignedTo = "67383a525644f2ff84a515e8";




    try {
        const response = await fetch(`http://localhost:3000/project/post`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjcyYTdlZWRiMDkwYjA3NmNmNmUyN2M3Iiwicm9sZXMiOiJBZG1pbiJ9LCJpYXQiOjE3MzE5MDQ3NTIsImV4cCI6MTczMTkzNzE1Mn0.4cMC8kiqbbRcYWHb9Zv78tnagbBd7yBvKdKIjQyDzh8`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({clientName, projectName, assignedTo}),
        });

        console.log(response.ok);
    } catch (error) {
        console.error('Error adding employee:', error);
    }
}
let k = 501;
for(let i = 1; i<=k; i++){
    f(k-i);
}