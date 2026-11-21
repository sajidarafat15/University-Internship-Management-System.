// COMPANY PROFILE ELEMENTS

let formInputs = document.querySelectorAll(".form-group input, .form-group select, .form-group textarea");
let fileInputs = document.querySelectorAll(".document-item input[type='file']");
let resetButton = document.querySelector(".reset-button");
let saveButton = document.querySelector(".save-button");
let submitButton = document.querySelector(".submit-button");
let checklistItems = document.querySelectorAll(".check-empty");

let initialValues = [];
for (let i = 0; i < formInputs.length; i++) {
    if (formInputs[i].tagName == "SELECT") {
        initialValues[i] = formInputs[i].selectedIndex;
    } else {
        initialValues[i] = formInputs[i].value;
    }
}


// CHECK COMPANY INFORMATION

function checkCompanyInformation() {
    let basicComplete = true;
    let contactComplete = true;

    // BASIC COMPANY INFORMATION
    let requiredBasic = [0, 1, 2, 5];

    for (let i = 0; i < requiredBasic.length; i++) {
        if (formInputs[requiredBasic[i]].value.trim() == "") {
            basicComplete = false;
        }
    }

    // CONTACT INFORMATION
    let requiredContact = [6, 7, 10];

    for (let i = 0; i < requiredContact.length; i++) {
        if (formInputs[requiredContact[i]].value.trim() == "") {
            contactComplete = false;
        }
    }

    return [basicComplete, contactComplete];
}


// UPDATE PROFILE CHECKLIST

function updateChecklist() {
    let information = checkCompanyInformation();

    // BASIC INFORMATION
    if (information[0]) {
        checklistItems[0].textContent = "✓";
        checklistItems[0].style.background = "#2DD4BF";
    } else {
        checklistItems[0].textContent = "";
        checklistItems[0].style.background = "transparent";
    }

    // CONTACT INFORMATION
    if (information[1]) {
        checklistItems[1].textContent = "✓";
        checklistItems[1].style.background = "#2DD4BF";
    } else {
        checklistItems[1].textContent = "";
        checklistItems[1].style.background = "transparent";
    }

    // REGISTRATION CERTIFICATE
    if (fileInputs[0].files.length > 0) {
        checklistItems[2].textContent = "✓";
        checklistItems[2].style.background = "#2DD4BF";
    } else {
        checklistItems[2].textContent = "";
        checklistItems[2].style.background = "transparent";
    }

    // TRADE LICENSE
    if (fileInputs[1].files.length > 0) {
        checklistItems[3].textContent = "✓";
        checklistItems[3].style.background = "#2DD4BF";
    } else {
        checklistItems[3].textContent = "";
        checklistItems[3].style.background = "transparent";
    }
}


// VALIDATE DOCUMENT UPLOADS

function validateDocument(input) {
    let file = input.files[0];

    if (file) {
        let fileName = file.name.toLowerCase();
        let validType = fileName.endsWith(".pdf") ||
                        fileName.endsWith(".jpg") ||
                        fileName.endsWith(".jpeg") ||
                        fileName.endsWith(".png");

        if (!validType) {
            alert("Please upload a PDF, JPG or PNG file.");
            input.value = "";
        } else if (file.size > 5 * 1024 * 1024) {
            alert("File size must not exceed 5 MB.");
            input.value = "";
        }
    }

    updateChecklist();
}


// VALIDATE COMPANY PROFILE

function validateProfile() {
    let requiredFields = [0, 1, 2, 5, 6, 7, 10];

    for (let i = 0; i < requiredFields.length; i++) {
        let field = formInputs[requiredFields[i]];

        if (field.value.trim() == "") {
            alert("Please complete all required company information.");
            field.focus();
            return false;
        }
    }

    return true;
}


// SAVE COMPANY PROFILE

function saveProfile() {
    if (validateProfile()) {
        alert("Company profile saved successfully!");
    }
}


// SUBMIT PROFILE FOR VERIFICATION

function submitProfile() {
    if (validateProfile()) {
        if (fileInputs[0].files.length == 0 || fileInputs[1].files.length == 0) {
            alert("Please upload both required verification documents.");
        } else {
            alert("Your company profile is ready for verification!");
        }
    }
}


// RESET COMPANY PROFILE

function resetProfile() {
    let confirmReset = confirm("Are you sure you want to reset the company profile?");

    if (confirmReset) {
        for (let i = 0; i < formInputs.length; i++) {
            if (formInputs[i].tagName == "SELECT") {
                formInputs[i].selectedIndex = initialValues[i];
            } else {
                formInputs[i].value = initialValues[i];
            }
        }

        for (let i = 0; i < fileInputs.length; i++) {
            fileInputs[i].value = "";
        }

        updateChecklist();
        alert("Company profile has been reset.");
    }
}


// EVENT LISTENERS

for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener("input", updateChecklist);
    formInputs[i].addEventListener("change", updateChecklist);
}

for (let i = 0; i < fileInputs.length; i++) {
    fileInputs[i].addEventListener("change", function() {
        validateDocument(fileInputs[i]);
    });
}

saveButton.addEventListener("click", saveProfile);
submitButton.addEventListener("click", submitProfile);
resetButton.addEventListener("click", resetProfile);


// INITIAL PAGE SETUP

updateChecklist();