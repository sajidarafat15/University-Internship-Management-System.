// This JavaScript file is connected to the Login and Register pages.
// Each section runs only when the related HTML element exists.
// Demo only: nothing is saved. Login works with one fixed account.
// When the database is ready, replace the checks below with a call to the server.

const STUDENT_ID = "1131888";
const PASSWORD = "123456";

// 0. SMALL HELPER FUNCTIONS

// Show a green (success) or red (error) message above the form.
function showAlert(type, message) {
    const box = document.getElementById("formAlert");

    box.className = "form-alert " + type;
    box.textContent = message;
}

// Show (or clear) the red error text under an input.
// Returns true when there is no error.
function setError(input, message) {
    const field = input.closest(".field");
    const errorBox = field.getElementsByClassName("field-msg")[0];

    errorBox.textContent = message;

    if (message === "") {
        field.classList.remove("invalid");
        return true;
    }

    field.classList.add("invalid");
    return false;
}

// Remove the red error text when the user starts typing again.
function clearErrorOnTyping(inputId) {
    const input = document.getElementById(inputId);

    input.addEventListener("input", function () {
        setError(input, "");
        document.getElementById("formAlert").className = "form-alert";
    });
    input.addEventListener("change", function () {
        setError(input, "");
    });
}

// 1. SHOW / HIDE PASSWORD
const passwordButtons = document.getElementsByClassName("pw-toggle");

for (let i = 0; i < passwordButtons.length; i++) {
    passwordButtons[i].addEventListener("click", function () {
        const input = document.getElementById(passwordButtons[i].dataset.target);

        if (input.type === "password") {
            input.type = "text";
            passwordButtons[i].textContent = "Hide";
        } else {
            input.type = "password";
            passwordButtons[i].textContent = "Show";
        }
    });
}

// 2. REGISTER (only checks the form, nothing is saved)
const registerForm = document.getElementById("registerForm");

if (registerForm != null) {
    registerForm.noValidate = true;

    const regName = document.getElementById("regName");
    const regId = document.getElementById("regId");
    const regEmail = document.getElementById("regEmail");
    const regPhone = document.getElementById("regPhone");
    const regDept = document.getElementById("regDept");
    const regPass = document.getElementById("regPass");
    const regPass2 = document.getElementById("regPass2");
    const regTerms = document.getElementById("regTerms");

    clearErrorOnTyping("regName");
    clearErrorOnTyping("regId");
    clearErrorOnTyping("regEmail");
    clearErrorOnTyping("regPhone");
    clearErrorOnTyping("regDept");
    clearErrorOnTyping("regPass");
    clearErrorOnTyping("regPass2");
    clearErrorOnTyping("regTerms");

    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = regName.value.trim();
        const studentId = regId.value.trim();
        const email = regEmail.value.trim();
        const phone = regPhone.value.trim();

        let nameMessage = "";
        let idMessage = "";
        let emailMessage = "";
        let phoneMessage = "";
        let deptMessage = "";
        let passMessage = "";
        let pass2Message = "";
        let termsMessage = "";

        if (name.length < 3) {
            nameMessage = "Please enter your full name.";
        }

        if (studentId.length < 7 || studentId.length > 10 || isNaN(studentId)) {
            idMessage = "Student ID must be 7-10 digits.";
        }

        if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
            emailMessage = "Enter a valid email address.";
        }

        if (phone.length !== 11 || isNaN(phone) || phone.indexOf("01") !== 0) {
            phoneMessage = "Enter an 11 digit mobile number starting with 01.";
        }

        if (regDept.value === "") {
            deptMessage = "Please select your department.";
        }

        if (regPass.value.length < 6) {
            passMessage = "Password must be at least 6 characters.";
        }

        if (regPass2.value !== regPass.value) {
            pass2Message = "Passwords do not match.";
        }

        if (regTerms.checked === false) {
            termsMessage = "Please accept the terms to continue.";
        }

        const results = [
            setError(regName, nameMessage),
            setError(regId, idMessage),
            setError(regEmail, emailMessage),
            setError(regPhone, phoneMessage),
            setError(regDept, deptMessage),
            setError(regPass, passMessage),
            setError(regPass2, pass2Message),
            setError(regTerms, termsMessage)
        ];

        if (results.indexOf(false) !== -1) {
            return;
        }

        showAlert("success", "Form is valid. Registration will be saved once the database is connected. Please use the demo login for now.");

        setTimeout(function () {
            window.location.href = "Login.html";
        }, 2200);
    });
}

// 3. LOGIN (one fixed demo account)
const loginForm = document.getElementById("loginForm");

if (loginForm != null) {
    loginForm.noValidate = true;

    const loginId = document.getElementById("loginId");
    const loginPass = document.getElementById("loginPass");

    clearErrorOnTyping("loginId");
    clearErrorOnTyping("loginPass");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let idMessage = "";
        let passMessage = "";

        if (loginId.value.trim() === "") {
            idMessage = "Enter your student ID.";
        }

        if (loginPass.value === "") {
            passMessage = "Enter your password.";
        }

        const idOk = setError(loginId, idMessage);
        const passOk = setError(loginPass, passMessage);

        if (idOk === false || passOk === false) {
            return;
        }

        if (loginId.value.trim() !== STUDENT_ID || loginPass.value !== PASSWORD) {
            showAlert("error", "Incorrect student ID or password.");
            return;
        }

        showAlert("success", "Login successful! Opening your dashboard...");

        setTimeout(function () {
            window.location.href = "Student-Dashboard.html";
        }, 500);
    });
}
