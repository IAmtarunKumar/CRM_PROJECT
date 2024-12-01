const url = "http://localhost:3000/payments";
const token = localStorage.getItem("token");

// Function to fetch payment records
async function fetchPayments() {
    if (!token) {
        console.error('User authentication token is missing');
        return;
    }

    try {
        const response = await fetch(`${url}/get`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch payment records');
        }

        const data = await response.json();
        console.log("Fetched payment records:", data);

        if (Array.isArray(data) && data.length > 0) {
            populateTable(data);
        } else {
            console.error('No payment records found');
        }

    } catch (error) {
        console.error('Error fetching payment records:', error.message);
    }
}

// Function to populate the table
function populateTable(data) {
    const tableBody = document.getElementById('tableData');
    tableBody.innerHTML = ''; // Clear existing rows

    let rowsHtml = '';
    for (let i = 0; i < data.length; i++) {
        const payment = data[i];
        
        rowsHtml += `
            <tr data-id="${payment._id}">
                <td>${i + 1}</td>
                <td>${payment.client ? payment.client : 'N/A'}</td>
                <td>${payment.paymentType ? payment.paymentType : 'N/A'}</td>
                <td>${payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : 'N/A'}</td>
                <td>${payment.paidAmount ? payment.paidAmount : 'N/A'}</td>
            </tr>
        `;
    }

    tableBody.innerHTML = rowsHtml; // Insert all rows into the table body
}

// Call fetchPayments on page load to display payment records
window.onload = function() {
    fetchPayments();
};
