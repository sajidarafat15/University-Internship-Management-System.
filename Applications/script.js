// APPLICATION ELEMENTS
let applicantCards = document.querySelectorAll(".applicant-card");
let searchInput = document.getElementById("searchInput");
let internshipFilter = document.getElementById("internshipFilter");
let statusFilter = document.getElementById("statusFilter");
let selectedApplicant = applicantCards[0];


// SHOW APPLICANT DETAILS
function showDetails(card) {

    selectedApplicant = card;

    let name = card.querySelector(".applicant-info h3").textContent;
    let internship = card.querySelector(".applicant-info p").textContent;
    let status = card.querySelector(".status").textContent;
    let avatar = card.querySelector(".avatar").textContent;
    let date = card.querySelector(".application-date strong").textContent;

    let skills = card.querySelectorAll(".tags span");

    document.querySelector(".profile-header h2").textContent = name;
    document.querySelector(".profile-header p").textContent = internship;
    document.querySelector(".profile-avatar").textContent = avatar;

    document.querySelector(".profile-header .status").textContent = status;

    document.querySelector(".detail-grid div:last-child strong").textContent = date;

    let skillList = "";

    for (let i = 0; i < skills.length; i++) {
        skillList += "<span>" + skills[i].textContent + "</span>";
    }

    document.querySelector(".skill-tags").innerHTML = skillList;

    for (let i = 0; i < applicantCards.length; i++) {
        applicantCards[i].classList.remove("selected-applicant");
    }

    card.classList.add("selected-applicant");

    updateStatusButton();
}


// SEARCH AND FILTER APPLICATIONS
function filterApplications() {

    let search = searchInput.value.toLowerCase();
    let internship = internshipFilter.value;
    let status = statusFilter.value;
    let count = 0;

    for (let i = 0; i < applicantCards.length; i++) {

        let name = applicantCards[i].querySelector(".applicant-info h3").textContent.toLowerCase();
        let cardInternship = applicantCards[i].getAttribute("data-internship");
        let cardStatus = applicantCards[i].getAttribute("data-status");

        if (name.includes(search) &&
            (internship == "" || internship == cardInternship) &&
            (status == "" || status == cardStatus)) {

            applicantCards[i].style.display = "";
            count++;

        } else {
            applicantCards[i].style.display = "none";
        }
    }

    document.querySelector(".list-note").textContent =
        "Showing " + count + " applications";
}


// UPDATE APPLICATION STATUS
function changeStatus() {

    let currentStatus = selectedApplicant.getAttribute("data-status");

    if (currentStatus == "Pending") {
        currentStatus = "Under Review";
    }
    else if (currentStatus == "Under Review") {
        currentStatus = "Reviewed";
    }
    else {
        currentStatus = "Pending";
    }

    selectedApplicant.setAttribute("data-status", currentStatus);

    let badge = selectedApplicant.querySelector(".status");

    badge.textContent = currentStatus;
    badge.className = "status";

    if (currentStatus == "Pending") {
        badge.classList.add("pending");
    }
    else if (currentStatus == "Under Review") {
        badge.classList.add("review");
    }
    else {
        badge.classList.add("reviewed");
    }

    showDetails(selectedApplicant);
    filterApplications();
    updateStatistics();
}


// STATUS ACTION BUTTON
let actionArea = document.querySelector(".detail-actions");

let statusButton = document.createElement("button");
statusButton.className = "message-button";
statusButton.style.padding = "11px 13px";
statusButton.style.border = "none";
statusButton.style.borderRadius = "7px";
statusButton.style.cursor = "pointer";

actionArea.appendChild(statusButton);

statusButton.addEventListener("click", changeStatus);


function updateStatusButton() {

    let status = selectedApplicant.getAttribute("data-status");

    if (status == "Pending") {
        statusButton.textContent = "Start Review";
    }
    else if (status == "Under Review") {
        statusButton.textContent = "Mark as Reviewed";
    }
    else {
        statusButton.textContent = "Reopen Review";
    }
}


// UPDATE STATISTICS
function updateStatistics() {

    let total = applicantCards.length;
    let pending = 0;
    let review = 0;
    let reviewed = 0;
    let software = 0;
    let design = 0;

    for (let i = 0; i < applicantCards.length; i++) {

        let status = applicantCards[i].getAttribute("data-status");
        let internship = applicantCards[i].getAttribute("data-internship");

        if (status == "Pending") {
            pending++;
        }
        else if (status == "Under Review") {
            review++;
        }
        else {
            reviewed++;
        }

        if (internship == "Software Engineering Intern") {
            software++;
        }
        else if (internship == "UI/UX Design Intern") {
            design++;
        }
    }

    let overview = document.querySelectorAll(".overview-card h2");

    overview[0].textContent = total;
    overview[1].textContent = pending;
    overview[2].textContent = review;
    overview[3].textContent = reviewed;

    let summary = document.querySelectorAll(".summary-stats strong");

    summary[0].textContent = pending;
    summary[1].textContent = review;
    summary[2].textContent = reviewed;

    document.querySelector(".summary-circle strong").textContent = reviewed;

    let internshipStats = document.querySelectorAll(".internship-stat p span");

    internshipStats[0].textContent = software;
    internshipStats[1].textContent = design;
}


// EVENT LISTENERS
searchInput.addEventListener("keyup", filterApplications);

internshipFilter.addEventListener("change", filterApplications);

statusFilter.addEventListener("change", filterApplications);


// SELECT APPLICANT
for (let i = 0; i < applicantCards.length; i++) {

    applicantCards[i].addEventListener("click", function(event) {

        if (event.target.classList.contains("review-link")) {
            event.preventDefault();
        }

        showDetails(applicantCards[i]);
    });
}


// INITIAL PAGE SETUP
showDetails(selectedApplicant);
filterApplications();
updateStatistics();