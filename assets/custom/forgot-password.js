 const url = 'http://localhost:3000/user';
 const token = localStorage.getItem('token');

 
const forgetPassword = document.getElementById("forgetPassword");
forgetPassword.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  
   try {
    const response = await fetch(
      `${url}/sendResetOtp`,
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