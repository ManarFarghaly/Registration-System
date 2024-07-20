// get the registration and login forms
console.log('hi');



window.onload = function () {
    const loginForm = document.getElementById('Login');
    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission
        await loginUser();
        console.log('Login form submitted!');
    });
}


//const loginForm = document.getElementById('Login');
// loginForm.addEventListener('submit', async (event) => {
//     event.preventDefault();
//     await loginUser();
// });



async function loginUser() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;


    // Validate the form data
    if (!email || !password) {
        alert('Please enter your email and password');
        return;
    }

    try {
        // Send the login data to the server
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            // Handle error responses from the server
            const errorData = await response.json();
            alert(errorData.error);
            return;
        }

        // Handle successful response from the server
        const data = await response.json();
        window.location.href = '/dashBoard';
        renderDashboard(data);
        // Redirect the user to the /dashBoard route

    } catch (error) {
        console.error('Error logging in:', error);
    }
}


function renderDashboard(userData) {
    // Render the user data on the dashboard
    console.log('hi2');
    const userTableBody = document.getElementById('user-table-body');
    userTableBody.innerHTML = `
    <tr>
      <td>${userData.username}</td>
      <td>${userData.email}</td>
      <td>${userData.phone}</td>
    </tr>
  `;
    // Show the dashboard
    document.querySelector('.dashBoard-container').style.display = 'block';
}
