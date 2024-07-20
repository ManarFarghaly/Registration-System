// dashboard.js
window.addEventListener('DOMContentLoaded', () => {
    // Get the user data from session storage
    const userData = JSON.parse(sessionStorage.getItem('userData'));

    // Render the dashboard using the user data
    renderDashboard(userData);
});

function renderDashboard(userData) {
    // Access the table or other DOM elements to fill in the data
    const tableBody = document.getElementById('user-table-body');
    // Populate the table with the user data
    tableBody.innerHTML = `
        <tr>
            <td>${userData.username}</td>
            <td>${userData.email}</td>
            <td>${userData.phone || 'N/A'}</td>
        </tr>
    `;
}




