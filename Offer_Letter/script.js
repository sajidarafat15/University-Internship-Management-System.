// FORM ELEMENTS
let offerForm = document.querySelector("form");
let candidateInput = document.getElementById("candidate");
let positionInput = document.getElementById("position");
let durationInput = document.getElementById("duration");
let startDateInput = document.getElementById("start-date");
let deadlineInput = document.getElementById("deadline");
let stipendInput = document.getElementById("stipend");
let fileInput = document.getElementById("offer-file");
let notesInput = document.getElementById("notes");
let offerTable = document.querySelector("tbody");
let draftButton = document.querySelector(".btn-draft");
let resetButton = document.querySelector(".btn-reset");

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

// UPDATE OFFER STATISTICS
function updateStatistics() {
    let rows = offerTable.querySelectorAll("tr");
    let total = rows.length;
    let sent = 0;
    let awaiting = 0;
    let completed = 0;

    for (let i = 0; i < rows.length; i++) {
        let status = rows[i].querySelector(".status").textContent;
        let documents = rows[i].querySelector(".document-status").textContent;
        if (status == "Sent" || status == "Signed" ||
            status == "Completed" || status == "Pending Documents") {
            sent++;
        }
        if (documents == "Pending") {
            awaiting++;
        }
        if (status == "Completed") {
            completed++;
        }
    }
    let stats = document.querySelectorAll(".stats-grid .stat-card h2");
    stats[0].textContent = total;
    stats[1].textContent = sent;
    stats[2].textContent = awaiting;
    stats[3].textContent = completed;

    updateProgress(sent, completed, total);
}

// UPDATE OFFER PROGRESS
function updateProgress(sent, completed, total) {
    let percentage = 0;
    if (total > 0) {
        percentage = Math.round((sent / total) * 100);
    }
    document.querySelector(".progress-number").textContent = percentage + "%";
    document.querySelector(".progress-fill").style.width = percentage + "%";

    let details = document.querySelectorAll(".progress-details strong");
    details[0].textContent = sent + " of " + total;
    details[1].textContent = completed + " of " + total;
}

// CREATE OR UPDATE OFFER
function saveOffer(status) {
    let candidate = candidateInput.options[candidateInput.selectedIndex].text;
    let position = positionInput.value;
    let rows = offerTable.querySelectorAll("tr");
    let selectedRow = null;
    for (let i = 0; i < rows.length; i++) {
        let name = rows[i].querySelector(".candidate-cell strong").textContent;

        if (name == candidate) {
            selectedRow = rows[i];
            break;
        }
    }

    let date = "Not issued";
    let statusClass = "draft";
    let documentText = "Not Started";
    let documentClass = "waiting";
    if (status == "Sent") {
        let today = new Date();
        let options = {
            day: "numeric",
            month: "short",
            year: "numeric"
        };
        date = today.toLocaleDateString("en-GB");
        statusClass = "sent";
        documentText = "Pending";
        documentClass = "pending";
    }

    if (selectedRow == null) {
        let words = candidate.split(" ");
        let initials = "";
        for (let i = 0; i < words.length; i++) {
            if (words[i] != "") {
                initials += words[i][0];
            }
        }

        selectedRow = document.createElement("tr");

        selectedRow.innerHTML =
            '<td><div class="candidate-cell">' +
            '<div class="avatar avatar-blue">' + initials + '</div>' +
            '<div><strong>' + candidate + '</strong></div></div></td>' +
            '<td>' + position + '</td>' +
            '<td>' + date + '</td>' +
            '<td><span class="status ' + statusClass + '">' + status + '</span></td>' +
            '<td><span class="document-status ' + documentClass + '">' +
            documentText + '</span></td>';
        offerTable.appendChild(selectedRow);
    } else {
        let cells = selectedRow.querySelectorAll("td");

        cells[1].textContent = position;
        cells[2].textContent = date;

        let badge = selectedRow.querySelector(".status");
        badge.textContent = status;
        badge.className = "status " + statusClass;

        let documentBadge = selectedRow.querySelector(".document-status");
        documentBadge.textContent = documentText;
        documentBadge.className = "document-status " + documentClass;
    }
    updateStatistics();
    offerForm.reset();
    if (status == "Draft") {
        alert("Offer letter saved as draft!");
    } else {
        alert("Offer letter created successfully!");
    }
}

// SAVE AS DRAFT
function saveDraft() {
    if (candidateInput.value == "" || positionInput.value == "") {
        alert("Please select a candidate and internship position.");
        return;
    }
    saveOffer("Draft");
}

// SEND OFFER LETTER
function sendOffer(event) {
    event.preventDefault();
    if (candidateInput.value == "" ||
        positionInput.value == "" ||
        durationInput.value == "" ||
        startDateInput.value == "" ||
        deadlineInput.value == "" ||
        stipendInput.value == "" ||
        fileInput.value == "") {
        alert("Please complete all required fields.");
        return;
    }
    let file = fileInput.value.toLowerCase();
    if (!file.endsWith(".pdf")) {
        alert("Please upload a PDF file.");
        return;
    }
    let deadline = new Date(deadlineInput.value);
    let joiningDate = new Date(startDateInput.value);

    if (deadline >= joiningDate) {
        alert("Acceptance deadline must be before the joining date.");
        return;
    }
    saveOffer("Sent");
}

// RESET FORM
function resetForm() {
    offerForm.reset();
}

// EVENT LISTENERS
draftButton.addEventListener("click", saveDraft);
offerForm.addEventListener("submit", sendOffer);
resetButton.addEventListener("click", resetForm);

// INITIAL PAGE SETUP
updateStatistics();