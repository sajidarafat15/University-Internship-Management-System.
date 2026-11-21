// INTERNSHIP ELEMENTS
let searchInput = document.querySelector(".search-box input");
let filterOptions = document.querySelectorAll(".filter-bar select");
let internshipCards = document.querySelectorAll(".internship-card");
let createForm = document.getElementById("create-internship");
let formInputs = createForm.querySelectorAll(".form-group input, .form-group select, .form-group textarea");
let saveButton = document.querySelector(".save-draft");
let resetButton = document.querySelector(".reset-button");

// INITIAL STATISTICS
let overviewCards = document.querySelectorAll(".overview-card h2");
let totalInternships = parseInt(overviewCards[0].textContent);
let activeInternships = parseInt(overviewCards[1].textContent);
let draftInternships = parseInt(overviewCards[2].textContent);
let closedInternships = parseInt(overviewCards[3].textContent);

// SEARCH AND FILTER INTERNSHIPS
function filterInternships() {
    let search = searchInput.value.toLowerCase();
    let status = filterOptions[0].value;
    let department = filterOptions[1].value;
    let count = 0;

    for (let i = 0; i < internshipCards.length; i++) {
        let title = internshipCards[i].querySelector(".job-title h3").textContent.toLowerCase();
        let cardDepartment = internshipCards[i].querySelector(".job-title p").textContent.toLowerCase();
        let cardStatus = internshipCards[i].querySelector(".status").textContent.toLowerCase();

        if (cardDepartment.includes("creative")) {
            cardDepartment = "design department";
        }

        if (title.includes(search) &&
            (status == "" || cardStatus.includes(status.toLowerCase())) &&
            (department == "" || cardDepartment.includes(department.toLowerCase()))) {

            internshipCards[i].style.display = "";
            count++;

        } else {
            internshipCards[i].style.display = "none";
        }
    }

    document.querySelector(".total-tag").textContent = "Showing " + count + " Internships";
}

// UPDATE OVERVIEW STATISTICS
function updateStatistics() {
    overviewCards[0].textContent = totalInternships;
    overviewCards[1].textContent = activeInternships;
    overviewCards[2].textContent = draftInternships;
    overviewCards[3].textContent = closedInternships;
}

// CREATE INTERNSHIP CARD
function createInternship(status) {
    let position = formInputs[0].value;
    let department = formInputs[1].value;
    let employment = formInputs[2].value;
    let location = formInputs[3].value;
    let vacancies = formInputs[4].value;
    let duration = formInputs[5].value;
    let stipend = formInputs[6].value;
    let deadline = formInputs[7].value;
    let skills = formInputs[10].value;

    let icon = "💼";
    let iconClass = "software";

    if (department == "Design") {
        icon = "🎨";
        iconClass = "design";
    } else if (department == "Marketing") {
        icon = "📢";
        iconClass = "marketing";
    }

    let statusClass = "active-status";
    let statusText = "● Active";

    if (status == "Draft") {
        statusClass = "draft-status";
        statusText = "● Draft";
        deadline = "Not Published";
    }

    let skillList = skills.split(",");
    let skillHTML = "";

    for (let i = 0; i < skillList.length; i++) {
        if (skillList[i].trim() != "") {
            skillHTML += "<span>" + skillList[i].trim() + "</span>";
        }
    }

    let card = document.createElement("div");
    card.className = "internship-card";
    card.setAttribute("data-status", status);
    card.setAttribute("data-department", department);

    card.innerHTML = `
        <div class="job-top">
            <div class="job-icon ${iconClass}">${icon}</div>
            <div class="job-title">
                <h3>${position}</h3>
                <p>${department} Department</p>
            </div>
            <span class="status ${statusClass}">${statusText}</span>
        </div>

        <div class="job-details">
            <span>💼 ${employment}</span>
            <span>📍 ${location}</span>
            <span>⏱ ${duration}</span>
            <span>👥 ${vacancies} Vacancies</span>
        </div>

        <div class="job-tags">${skillHTML}</div>

        <div class="job-bottom">
            <div class="job-stats">
                <div>
                    <strong>0</strong>
                    <span>Applications</span>
                </div>
                <div>
                    <strong>${stipend == "" ? "Not Set" : "৳" + stipend}</strong>
                    <span>Monthly Stipend</span>
                </div>
                <div>
                    <strong>${deadline}</strong>
                    <span>Application Deadline</span>
                </div>
            </div>

            <div class="job-actions">
                <a href="#create-internship" class="edit-button">Edit</a>
                <a href="#create-internship" class="manage-button">Manage</a>
            </div>
        </div>
    `;

    document.querySelector(".internship-list").appendChild(card);

    internshipCards = document.querySelectorAll(".internship-card");

    totalInternships++;

    if (status == "Draft") {
        draftInternships++;
    } else {
        activeInternships++;
    }

    updateStatistics();
    filterInternships();
}

// SAVE INTERNSHIP AS DRAFT
function saveInternship() {
    if (formInputs[0].value.trim() == "") {
        alert("Please enter an internship position.");
        formInputs[0].focus();
    } else {
        createInternship("Draft");
        alert("Internship saved as draft successfully!");
        createForm.reset();
    }
}

// PUBLISH INTERNSHIP
function publishInternship() {
    let requiredFields = [0, 1, 2, 3, 4, 5, 7, 9, 10];
    let valid = true;

    for (let i = 0; i < requiredFields.length; i++) {
        let field = formInputs[requiredFields[i]];

        if (field.value.trim() == "") {
            alert("Please complete all required fields.");
            field.focus();
            valid = false;
            break;
        }
    }

    if (valid) {
        createInternship("Active");
        alert("Internship published successfully!");
        createForm.reset();
    }
}

// RESET INTERNSHIP FORM
function resetForm() {
    createForm.reset();
}

// EVENT LISTENERS
searchInput.addEventListener("keyup", filterInternships);
filterOptions[0].addEventListener("change", filterInternships);
filterOptions[1].addEventListener("change", filterInternships);

saveButton.addEventListener("click", saveInternship);
resetButton.addEventListener("click", resetForm);

createForm.addEventListener("submit", function(event) {
    event.preventDefault();
    publishInternship();
});

// INITIAL PAGE SETUP
filterInternships();
updateStatistics();