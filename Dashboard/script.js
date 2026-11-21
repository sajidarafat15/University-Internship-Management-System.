// =====================================================
// DASHBOARD ELEMENTS
// =====================================================

let dateBadge = document.querySelector(".date-badge");


// =====================================================
// UPDATE CURRENT DATE
// =====================================================

function updateDate() {

    if (dateBadge != null) {

        let today = new Date();

        let options = {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        };

        let currentDate = today.toLocaleDateString("en-GB", options);

        dateBadge.innerHTML = '<span class="date-dot"></span> ' + currentDate;

    }

}


// =====================================================
// PROFILE DROPDOWN
// =====================================================

let profileButton = document.getElementById("profileButton");
let profileDropdown = document.getElementById("profileDropdown");


// OPEN AND CLOSE PROFILE DROPDOWN

if (profileButton != null && profileDropdown != null) {

    profileButton.addEventListener("click", function(event) {

        event.stopPropagation();

        profileDropdown.classList.toggle("show");

    });


    // CLOSE DROPDOWN WHEN CLICKING OUTSIDE

    document.addEventListener("click", function(event) {

        if (!profileDropdown.contains(event.target) &&
            !profileButton.contains(event.target)) {

            profileDropdown.classList.remove("show");

        }

    });

}


// =====================================================
// NAVIGATION MENU
// =====================================================

let menuButton = document.getElementById("menuButton");
let menuOverlay = document.getElementById("menuOverlay");
let popupMenu = document.getElementById("popupMenu");
let closeMenu = document.getElementById("closeMenu");

let menuToggle = document.getElementById("menu-toggle");


// OPEN NAVIGATION MENU

function openMenu() {

    if (popupMenu != null && menuOverlay != null) {

        popupMenu.style.display = "block";
        menuOverlay.style.display = "block";

    }

}


// CLOSE NAVIGATION MENU

function closeNavigationMenu() {

    if (popupMenu != null && menuOverlay != null) {

        popupMenu.style.display = "none";
        menuOverlay.style.display = "none";

    }

    if (menuToggle != null) {

        menuToggle.checked = false;

    }

}


// MY PROFILE MENU BUTTON

if (menuButton != null) {

    menuButton.addEventListener("click", openMenu);

}


// CLOSE BUTTON

if (closeMenu != null) {

    closeMenu.addEventListener("click", closeNavigationMenu);

}


// MENU OVERLAY

if (menuOverlay != null) {

    menuOverlay.addEventListener("click", closeNavigationMenu);

}


// ACCOUNT SETTINGS CHECKBOX MENU

if (menuToggle != null) {

    menuToggle.addEventListener("change", function() {

        if (menuToggle.checked) {

            openMenu();

        } else {

            closeNavigationMenu();

        }

    });

}


// =====================================================
// ACCOUNT SETTINGS ELEMENTS
// =====================================================

let settingsForm = document.getElementById("settingsForm");

let saveSettings = document.getElementById("saveSettings");

let resetSettings = document.getElementById("resetSettings");

let settingsMessage = document.getElementById("settingsMessage");


// PASSWORD ELEMENTS

let currentPassword = document.getElementById("currentPassword");

let newPassword = document.getElementById("newPassword");

let confirmPassword = document.getElementById("confirmPassword");


// =====================================================
// SAVE ACCOUNT SETTINGS
// =====================================================

function saveAccountSettings() {

    if (settingsForm != null) {

        let companyName = document.getElementById("companyName").value.trim();

        let accountEmail = document.getElementById("accountEmail").value.trim();


        // CHECK REQUIRED INFORMATION

        if (companyName == "" || accountEmail == "") {

            settingsMessage.textContent = "Please complete the required account information.";

            settingsMessage.style.color = "#FB7185";

            return;

        }


        // CHECK EMAIL FORMAT

        let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(accountEmail)) {

            settingsMessage.textContent = "Please enter a valid email address.";

            settingsMessage.style.color = "#FB7185";

            return;

        }


        // CHECK PASSWORD FIELDS

        if (currentPassword.value != "" ||
            newPassword.value != "" ||
            confirmPassword.value != "") {


            if (currentPassword.value == "" ||
                newPassword.value == "" ||
                confirmPassword.value == "") {

                settingsMessage.textContent = "Please complete all password fields.";

                settingsMessage.style.color = "#FB7185";

                return;

            }


            // CHECK PASSWORD LENGTH

            if (newPassword.value.length < 6) {

                settingsMessage.textContent = "New password must contain at least 6 characters.";

                settingsMessage.style.color = "#FB7185";

                return;

            }


            // CHECK PASSWORD MATCH

            if (newPassword.value != confirmPassword.value) {

                settingsMessage.textContent = "New password and confirmation do not match.";

                settingsMessage.style.color = "#FB7185";

                return;

            }

        }


        // SUCCESS MESSAGE

        settingsMessage.textContent = "Settings validated successfully. Backend saving is not connected.";

        settingsMessage.style.color = "#2DD4BF";

    }

}


// =====================================================
// RESET ACCOUNT SETTINGS
// =====================================================

function resetAccountSettings() {

    if (settingsForm != null) {

        settingsForm.reset();

        settingsMessage.textContent = "";

    }

}


// SAVE BUTTON

if (saveSettings != null) {

    saveSettings.addEventListener("click", saveAccountSettings);

}


// RESET BUTTON

if (resetSettings != null) {

    resetSettings.addEventListener("click", resetAccountSettings);

}


// =====================================================
// INITIAL PAGE SETUP
// =====================================================

updateDate();