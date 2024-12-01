//  const user_API = 'http://localhost:3000/user';
 const token = localStorage.getItem('token');
 import {user_API} from './apis.js';
 import { status_popup, loading_shimmer, remove_loading_shimmer } from './globalFunctions1.js';

 if (window.location.pathname.toLowerCase().includes('register')) {
  const registerForm = document.getElementById('postForm');
  
  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get input values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const mobile = document.getElementById('mobile').value;
    const password = document.getElementById('password').value;
    const roles = document.getElementById('role').value;

    try {
      // Send data to the backend
      const response = await fetch(`${user_API}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, mobile, password, roles }),
      });

      const result = await response.json();

      if (response.ok) {
        document.getElementById('response').innerText = result.message;
        window.location.href = 'index.html';
      } else {
        document.getElementById('response').innerText = result.message || 'Registration failed.';
      }
    } catch (error) {
      document.getElementById('response').innerText = 'Error connecting to the server.';
      console.error('Error:', error);
    }
  });
}

 
// Handle Login
if (window.location.pathname.toLowerCase().includes(('index').toLowerCase())) {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
          const response = await fetch(`${user_API}/login`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
          });

          const result = await response.json();
          if (response.ok) {
              const roles = result.user.roles;
              const userId = result.user.id;
              const name  = result.user.name;
              document.getElementById('response').innerText = result.message;

              // Store token and user details in localStorage
              localStorage.setItem("token", result.token);
              localStorage.setItem("User_id", userId);  // Store the user ID
              localStorage.setItem("User_role", roles);  // Store the user role
              localStorage.setItem("User_name",name);

              // Redirect based on roles
              // if (roles === "Admin") {
              //     window.location.href = 'admin-dashboard.html';
              // } else if (roles === "Employee") {
              //     window.location.href = 'employee-dashboard.html';
              //   } else if (roles === "Supervisor") {
              //     window.location.href = 'supervisor-dashboard.html';
              
              // } else if (roles === "Client") {
              //     window.location.href = 'clients-list.html';
              // } else {
              //     document.getElementById("response").innerText = "Role not recognized.";
              // }
          } else {
              document.getElementById("response").innerText = result.message || "Login failed.";
          }
      } catch (error) {
          document.getElementById("response").innerText = "Error connecting to the server.";
          console.error("Error:", error);
      }
  });
}
 

 // show on roles details
 if (window.location.pathname.toLowerCase().includes('profile')) {
  async function all_data_load_dashboard() {
    const userId = localStorage.getItem('User_id');
    const roles = localStorage.getItem('User_role');
    
    try {
      const response = await fetch(`${user_API}/roles/get`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const res = await response.json();
      const user = res.role.find(users => users._id === userId);

      if (user) {
        // Display the user's existing data in the profile
        document.getElementById('file-display').textContent = user.document;
        document.getElementById('name').textContent = user.name;
        document.getElementById('email').textContent = user.email;
        document.getElementById('mobile').textContent = user.mobile;
        document.getElementById('role').textContent = user.roles;
        document.getElementById('DOB').textContent = user.DOB;
        document.getElementById('address').textContent = user.address;
        document.getElementById('gender').textContent = user.gender;

        // Populate the form with existing values
        document.getElementById('update-name').value = user.name || '';
        document.getElementById('update-mobile').value = user.mobile || '';
        document.getElementById('update-DOB').value = user.DOB || '';
        document.getElementById('update-address').value = user.address || '';

        // Handle gender population correctly
        if (user.gender === 'Male') {
          document.querySelector('input[name="gender"][value="Male"]').checked = true;
        } else if (user.gender === 'Female') {
          document.querySelector('input[name="gender"][value="Female"]').checked = true;
        }
      } else {
        console.log('User not found for the logged-in ID');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    }
      // roles-update-form API start
      const rolesUpdateForm = document.getElementById('profile-update-form');
      rolesUpdateForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!userId) {
          alert('User ID not found');
          return;
        }
        try{
          loading_shimmer();
      } catch(error){console.log(error)}

        // Create a FormData object to send the data including the file
        const formData = new FormData();
        formData.append('_id', userId);
        formData.append('name', document.getElementById('update-name').value);
        formData.append('mobile', document.getElementById('update-mobile').value);
        formData.append('DOB', document.getElementById('update-DOB').value);
        formData.append('gender', document.querySelector('input[name="gender"]:checked').value);
        formData.append('address', document.getElementById('update-address').value);

        // Get the uploaded file (use a separate input ID for file)
        const fileInput = document.getElementById('file'); // Changed from 'file'
        if (fileInput && fileInput.files.length > 0) {
          const file = fileInput.files[0]; // Only get the file if it's present
          formData.append('document', file); // Append the file to the formData
        } else {
          console.log('No file selected or file input not found');
        }

        try {
          const response = await fetch(`${user_API}/update`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData // Send the form data (including file)
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();

          const success = response.ok;
        status_popup(success ? "Data Updated <br> Successfully" : "Please try <br> again later", success);
        if (success){
            all_data_load_dashboard();
        }
    } catch (error) {
        status_popup("Please try <br> again later", false);
    }
      });
    try{
      remove_loading_shimmer();
      all_data_load_dashboard()
  } catch(error){console.log(error)}
}




// forget password
if (window.location.pathname.toLowerCase().includes('forgot-password')) {
const forgetPassword = document.getElementById("forgetPassword");
forgetPassword.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  
   try {
    const response = await fetch(
      `${user_API}/sendResetOtp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email}),
      }
    );
    const result = await response.json();

    if (response.ok) {
      window.location.href='otp.html'
      document.getElementById("response").innerText= result.error || "Failed to send OTP.";
     
    }  
  } catch (error) {
    document.getElementById("response").innerText =
      "Error connecting to the server.";
    console.error("Error:", error);
  }
}); 
}

// window.onload = all_data_load_dashboard();







