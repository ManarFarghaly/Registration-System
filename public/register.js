window.onload = function () {
    const registrationForm = document.getElementById('Registration');
    const existingUserMessage = document.getElementById('existingUserMessage');
    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        await registerUser();
        console.log('r form submitted!');
    });
}
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
                window.location.href = data.redirect;
            } else {
                window.location.href = data.redirect;
            }
        });

}