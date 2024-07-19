// get the registration and login forms

const registrationForm = document.getElementById('Registration');
const loginForm = document.getElementById('Login');
const existingUserMessage = document.getElementById('existingUserMessage');
const loginButton = document.getElementById("loginButton");

registrationForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    await registerUser();
});

loginButton.addEventListener('click', async (event) => {
    //event.preventDefault();
    await loginUser();
});


async function registerUser() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;

    // Validate the form data
    if (!username || !email || !phone || !password) {
        alert('Please fill in all the fields');
        return;
    }

    // Send the registration data to the server
    const response = await fetch('/Register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, phone, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                existingUserMessage.style.display = 'block';
            } else {
                window.location.href = data.redirect;
            }
        });
    // });
} //catch (error) {
//     //console.error('Error registering user:', error);
//     //alert('An error occurred during registration. Please try again later.');
// }

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
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    // Display the error message to the user
                    alert(data.error);
                } else if (data.redirect) {
                    // Redirect the user to the dashboard
                    renderDashboard(data);
                    window.location.href = data.redirect;
                }
            })
    } catch (error) {
        console.error('Error logging in:', error);
    };
}

function renderDashboard(userData) {
    // Render the user data on the dashboard
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