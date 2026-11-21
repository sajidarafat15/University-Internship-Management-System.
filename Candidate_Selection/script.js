// CANDIDATE ELEMENTS
let candidateCards = document.querySelectorAll(".candidate-card");
let searchInput = document.querySelector(".search-box input");
let internshipFilter = document.querySelectorAll(".filter-bar select")[0];
let statusFilter = document.querySelectorAll(".filter-bar select")[1];
let selectedCandidate = candidateCards[0];

// PROFILE DROPDOWN
let profileButton = document.getElementById("profileButton");
let profileDropdown = document.getElementById("profileDropdown");

if (profileButton != null && profileDropdown != null) {

    profileButton.addEventListener("click", function(event) {
        event.stopPropagation();
        profileDropdown.classList.toggle("show");
    });

    document.addEventListener("click", function(event) {
        if (!profileDropdown.contains(event.target) &&
            !profileButton.contains(event.target)) {

            profileDropdown.classList.remove("show");
        }
    });
}

// SHOW CANDIDATE DETAILS
function showDetails(card) {

    selectedCandidate = card;

    let name = card.querySelector(".candidate-info h3").textContent;
    let internship = card.querySelector(".candidate-info p").textContent;
    let department = card.querySelector(".candidate-info > span").textContent;
    let status = card.querySelector(".decision-badge").textContent;
    let avatar = card.querySelector(".candidate-avatar").textContent;
    let metrics = card.querySelectorAll(".candidate-metrics strong");
    let skills = card.querySelectorAll(".candidate-skills span");
    let details = document.querySelectorAll(".detail-grid .detail-item strong");

    document.querySelector(".profile-heading h2").textContent = name;
    document.querySelector(".profile-heading p").textContent = internship;
    document.querySelector(".profile-avatar").textContent = avatar;
    document.querySelector(".details-panel .decision-badge").textContent = status;
    document.querySelector(".details-panel .decision-badge").className =
        card.querySelector(".decision-badge").className;

    details[1].textContent = department;
    details[2].textContent = metrics[1].textContent;
    details[3].textContent = metrics[0].textContent;
    details[4].textContent = internship;
    details[5].textContent = status;

    let skillList = "";
    for (let i = 0; i < skills.length; i++) {
        skillList += "<span>" + skills[i].textContent + "</span>";
    }
    document.querySelector(".skill-tags").innerHTML = skillList;
    for (let i = 0; i < candidateCards.length; i++) {
        candidateCards[i].classList.remove("selected-candidate");
    }
    card.classList.add("selected-candidate");

}

// SEARCH AND FILTER CANDIDATES
function filterCandidates() {

    let search = searchInput.value.toLowerCase();
    let internship = internshipFilter.value;
    let status = statusFilter.value;
    let count = 0;

    for (let i = 0; i < candidateCards.length; i++) {
        let cardText = candidateCards[i].textContent.toLowerCase();
        let cardInternship = candidateCards[i].getAttribute("data-internship");
        let cardStatus = candidateCards[i].getAttribute("data-status");

        if (cardText.includes(search) &&
            (internship == "All" || internship == cardInternship) &&
            (status == "All" || status == cardStatus)) {
            candidateCards[i].style.display = "";
            count++;
        } else {
            candidateCards[i].style.display = "none";
        }
    }
    document.querySelector(".pagination > span").textContent =
        "Showing " + count + " candidates";

}

// UPDATE CANDIDATE DECISION
function changeDecision() {

    let currentStatus = selectedCandidate.getAttribute("data-status");
    let decision = this.textContent.trim();
    if (decision == "Shortlist") {
        currentStatus = "Shortlisted";
    }
    else if (decision == "Accept") {
        currentStatus = "Accepted";
    }
    else if (decision == "Reject") {
        currentStatus = "Rejected";
    }

    selectedCandidate.setAttribute("data-status", currentStatus);
    let badge = selectedCandidate.querySelector(".decision-badge");
    badge.textContent = currentStatus;
    badge.className = "decision-badge";
    if (currentStatus == "Shortlisted") {
        badge.classList.add("shortlisted");
    }
    else if (currentStatus == "Accepted") {
        badge.classList.add("accepted");
    }
    else if (currentStatus == "Rejected") {
        badge.classList.add("rejected");
    }
    else {
        badge.classList.add("awaiting");
    }
    showDetails(selectedCandidate);
    filterCandidates();
    updateStatistics();

    alert("Candidate decision updated successfully!");

}

// DECISION ACTION BUTTONS
let decisionButtons = document.querySelectorAll(".decision-button");

for (let i = 0; i < decisionButtons.length; i++) {

    decisionButtons[i].addEventListener("click", function(event) {

        event.preventDefault();

        changeDecision.call(this);

    });
}

// UPDATE STATISTICS
function updateStatistics() {

    let total = 30;
    let shortlisted = 12;
    let accepted = 8;
    let rejected = 10;
    for (let i = 0; i < candidateCards.length; i++) {
        let oldStatus = candidateCards[i].getAttribute("data-original-status");
        let currentStatus = candidateCards[i].getAttribute("data-status");
        if (oldStatus == "Shortlisted") {
            shortlisted--;
        }
        else if (oldStatus == "Accepted") {
            accepted--;
        }
        else if (oldStatus == "Rejected") {
            rejected--;
        }

        if (currentStatus == "Shortlisted") {
            shortlisted++;
        }
        else if (currentStatus == "Accepted") {
            accepted++;
        }
        else if (currentStatus == "Rejected") {
            rejected++;
        }
    }

    let overview = document.querySelectorAll(".overview-card h2");
    overview[0].textContent = total;
    overview[1].textContent = shortlisted;
    overview[2].textContent = accepted;
    overview[3].textContent = rejected;

    let summary = document.querySelectorAll(".summary-stats strong");
    summary[0].textContent = shortlisted;
    summary[1].textContent = accepted;
    summary[2].textContent = rejected;

    document.querySelector(".accepted-number").textContent = accepted;

    let percentage = Math.round((accepted / shortlisted) * 100);

    document.querySelector(".summary-circle strong").textContent =
        percentage + "%";

}
// EVENT LISTENERS
searchInput.addEventListener("keyup", filterCandidates);
internshipFilter.addEventListener("change", filterCandidates);
statusFilter.addEventListener("change", filterCandidates);
// SELECT CANDIDATE
for (let i = 0; i < candidateCards.length; i++) {
    let detailsLink = candidateCards[i].querySelector(".details-link");
    detailsLink.addEventListener("click", function(event) {
        event.preventDefault();
        showDetails(candidateCards[i]);
    });
}
// INITIAL PAGE SETUP
for (let i = 0; i < candidateCards.length; i++) {
    candidateCards[i].setAttribute(
        "data-original-status",
        candidateCards[i].getAttribute("data-status")
    );

}
showDetails(selectedCandidate);
filterCandidates();
updateStatistics();