// If the saved data is from an older version, remove it so everything starts from zero.
const DATA_VERSION = "4";

if (localStorage.getItem("ie_version") !== DATA_VERSION) {
    const oldKeys = Object.keys(localStorage);

    for (let i = 0; i < oldKeys.length; i++) {
        if (oldKeys[i].indexOf("ie_") === 0) {
            localStorage.removeItem(oldKeys[i]);
        }
    }
    localStorage.setItem("ie_version", DATA_VERSION);
}

function loadData(key, fallback) {
    const savedText = localStorage.getItem(key);

    if (savedText == null) {
        return fallback;
    }
    return JSON.parse(savedText);
}

function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function todayText() {
    return new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function formatDate(isoDate) {
    return new Date(isoDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

// Show a success message for 4 seconds.
function showSuccess(id, text) {
    const box = document.getElementById(id);

    box.textContent = text;
    box.classList.add("show");

    setTimeout(function () {
        box.classList.remove("show");
    }, 4000);
}

// Show (or clear) the red error text under an input.
// Returns true when there is no error.
function setError(input, message) {
    const group = input.parentElement;
    const errorBox = group.getElementsByClassName("error-msg")[0];

    errorBox.textContent = message;

    if (message === "") {
        group.classList.remove("invalid");
        return true;
    }

    group.classList.add("invalid");
    return false;
}

// Remove the red error text when the user starts typing again.
function clearErrorOnTyping(inputId) {
    const input = document.getElementById(inputId);

    input.addEventListener("input", function () {
        setError(input, "");
    });
    input.addEventListener("change", function () {
        setError(input, "");
    });
}

// When the Clear (reset) button is used, remove all red error texts of the form.
function clearErrorsOnReset(form) {
    form.addEventListener("reset", function () {
        setTimeout(function () {
            const groups = form.getElementsByClassName("form-group");

            for (let i = 0; i < groups.length; i++) {
                groups[i].classList.remove("invalid");
            }
        }, 0);
    });
}

// Remove the dangerous characters before text is placed inside HTML.
function safeText(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

// Open or close the "details" box of a card.
function toggleDetails(card, button, closedText) {
    const box = card.getElementsByClassName("details-box")[0];

    if (box.classList.contains("open")) {
        box.classList.remove("open");
        button.textContent = closedText;
    } else {
        box.classList.add("open");
        button.textContent = "Hide Details";
    }
}

// Internship information used by the dashboard and the offer letters.
const JOBS = {
    j1: { title: "Web Developer Intern", company: "Ollyo" },
    j2: { title: "Network Support Intern", company: "BrightNet Ltd" },
    j3: { title: "Electrical Maintenance Intern", company: "PowerGrid Solutions" },
    j4: { title: "Production Planning Intern", company: "Apex Manufacturing" },
    j5: { title: "Embedded Systems Intern", company: "CircuitWorks" },
    j6: { title: "Data Analyst Intern", company: "DataNest" }
};

// The two offer letters that are always available.
const OFFERS = {
    j1: {
        avatar: "avatar-one",
        location: "Gulshan, Dhaka",
        mode: "Hybrid",
        duration: "3 Months",
        stipend: "BDT 8,000 / month",
        start: "2026-12-15",
        end: "2027-03-15",
        deadline: "30 Nov 2026"
    },
    j2: {
        avatar: "avatar-two",
        location: "Mirpur, Dhaka",
        mode: "On-site",
        duration: "2 Months",
        stipend: "BDT 6,000 / month",
        start: "2027-01-05",
        end: "2027-03-05",
        deadline: "10 Dec 2026"
    }
};

// 1. HIGHLIGHT THE CURRENT PAGE IN THE LEFT MENU
const leftNav = document.getElementsByClassName("left-nav")[0];

if (leftNav != null) {
    const currentPage = decodeURIComponent(location.pathname.split("/").pop());
    const navLinks = leftNav.getElementsByTagName("a");

    for (let i = 0; i < navLinks.length; i++) {
        if (decodeURIComponent(navLinks[i].getAttribute("href")) === currentPage) {
            navLinks[i].classList.add("active");
        }
    }
}

// 2. FIND INTERNSHIPS: SEARCH, FILTER AND APPLY
const jobGrid = document.getElementById("jobGrid");

if (jobGrid != null) {
    const jobCards = jobGrid.getElementsByClassName("application-card");
    const searchInput = document.getElementById("searchInput");
    const filterDept = document.getElementById("filterDept");
    const filterLocation = document.getElementById("filterLoc");
    const filterDuration = document.getElementById("filterDur");
    const resultCount = document.getElementById("resultCount");
    const emptyMessage = document.getElementById("emptyMsg");
    const appliedJobs = loadData("ie_applied", {});

    // Show only the cards that match the search text and the filters.
    function filterJobs() {
        const searchText = searchInput.value.trim().toLowerCase();
        let shown = 0;

        for (let i = 0; i < jobCards.length; i++) {
            const card = jobCards[i];
            let visible = true;

            if (searchText !== "" && card.textContent.toLowerCase().indexOf(searchText) === -1) {
                visible = false;
            }
            if (filterDept.value !== "default" && card.dataset.dept !== filterDept.value) {
                visible = false;
            }
            if (filterLocation.value !== "default" && card.dataset.location !== filterLocation.value) {
                visible = false;
            }
            if (filterDuration.value !== "default" && card.dataset.duration !== filterDuration.value) {
                visible = false;
            }

            if (visible) {
                card.style.display = "";
                shown = shown + 1;
            } else {
                card.style.display = "none";
            }
        }

        if (shown === 1) {
            resultCount.textContent = "1 internship found";
        } else {
            resultCount.textContent = shown + " internships found";
        }

        if (shown === 0) {
            emptyMessage.style.display = "block";
        } else {
            emptyMessage.style.display = "none";
        }
    }

    // Update the Apply button, date and status of every card.
    function showAppliedStatus() {
        for (let i = 0; i < jobCards.length; i++) {
            const card = jobCards[i];
            const applyButton = card.getElementsByClassName("btn-Apply")[0];
            const statusText = card.getElementsByClassName("status-text")[0];
            const dateText = card.getElementsByClassName("applied-date")[0];
            const appliedDate = appliedJobs[card.dataset.id];

            if (appliedDate != null) {
                applyButton.textContent = "Applied";
                applyButton.disabled = true;
                dateText.textContent = appliedDate;
                statusText.textContent = "Pending";
                statusText.className = "status-text pending-text";
            } else {
                applyButton.textContent = "Apply Now";
                applyButton.disabled = false;
                dateText.textContent = "-";
                statusText.textContent = "Not Applied";
                statusText.className = "status-text pending-text";
            }
        }
    }

    searchInput.addEventListener("input", filterJobs);
    filterDept.addEventListener("change", filterJobs);
    filterLocation.addEventListener("change", filterJobs);
    filterDuration.addEventListener("change", filterJobs);

    // The reset button clears the fields after this event, so wait a moment.
    document.getElementById("filterForm").addEventListener("reset", function () {
        setTimeout(filterJobs, 0);
    });

    // Add the click events to the buttons of every card.
    for (let i = 0; i < jobCards.length; i++) {
        const card = jobCards[i];
        const applyButton = card.getElementsByClassName("btn-Apply")[0];
        const detailsButton = card.getElementsByClassName("btn-details")[0];

        applyButton.addEventListener("click", function () {
            appliedJobs[card.dataset.id] = todayText();
            saveData("ie_applied", appliedJobs);
            showAppliedStatus();
        });

        detailsButton.addEventListener("click", function () {
            toggleDetails(card, detailsButton, "Details");
        });
    }

    showAppliedStatus();
    filterJobs();
}

// 3. OFFER LETTERS (accept, decline and download)
const offerGrid = document.getElementById("offerGrid");

// Make a simple PDF file from a list of text lines (no library is needed).
function makePdf(lines) {
    const commands = ["BT", "/F1 11 Tf", "14 TL", "50 790 Td"];

    for (let i = 0; i < lines.length; i++) {
        const size = lines[i].size || 11;
        let font = "F1";

        if (lines[i].bold) {
            font = "F2";
        }
        if (lines[i].gap) {
            commands.push("0 -" + lines[i].gap + " Td");
        }

        // brackets and slashes must have a slash before them inside a PDF
        const cleanText = String(lines[i].text)
            .replace(/[^\x20-\x7E]/g, "?")
            .replace(/[\\()]/g, function (character) {
                return "\\" + character;
            });

        commands.push("/" + font + " " + size + " Tf");
        commands.push("(" + cleanText + ") Tj");
        commands.push("0 -" + (size + 5) + " Td");
    }
    commands.push("ET");

    const stream = commands.join("\n");

    const objects = [
        "<< /Type /Catalog /Pages 2 0 R >>",
        "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>",
        "<< /Length " + stream.length + " >>\nstream\n" + stream + "\nendstream",
        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"
    ];

    let pdf = "%PDF-1.4\n";
    const positions = [];

    for (let i = 0; i < objects.length; i++) {
        positions.push(pdf.length);
        pdf = pdf + (i + 1) + " 0 obj\n" + objects[i] + "\nendobj\n";
    }

    const tableStart = pdf.length;
    pdf = pdf + "xref\n0 " + (objects.length + 1) + "\n0000000000 65535 f \n";

    for (let i = 0; i < positions.length; i++) {
        pdf = pdf + String(positions[i]).padStart(10, "0") + " 00000 n \n";
    }

    pdf = pdf + "trailer\n<< /Size " + (objects.length + 1) + " /Root 1 0 R >>\n";
    pdf = pdf + "startxref\n" + tableStart + "\n%%EOF";

    return new Blob([pdf], { type: "application/pdf" });
}

// Download the offer letter of one company as a PDF file.
function downloadOfferLetter(jobId) {
    const job = JOBS[jobId];
    const offer = OFFERS[jobId];

    const lines = [
        { text: "InternEase - Internship Offer Letter", size: 18, bold: true },
        { text: "Date: " + todayText(), gap: 14 },
        { text: "Dear Student,", gap: 10 },
        { text: "We are pleased to offer you the position of " + job.title + " at " + job.company + ".", gap: 4 },
        { text: "Offer details", size: 13, bold: true, gap: 14 },
        { text: "Position: " + job.title },
        { text: "Company: " + job.company },
        { text: "Location: " + offer.location + " (" + offer.mode + ")" },
        { text: "Duration: " + offer.duration },
        { text: "Start date: " + formatDate(offer.start) },
        { text: "End date: " + formatDate(offer.end) },
        { text: "Stipend: " + offer.stipend },
        { text: "Please reply before: " + offer.deadline, gap: 10 },
        { text: "Please log in to InternEase and accept this offer before the deadline.", gap: 10 },
        { text: "Sincerely,", gap: 10 },
        { text: job.company + " - Internship Team" }
    ];

    const fileUrl = URL.createObjectURL(makePdf(lines));
    const link = document.createElement("a");

    link.href = fileUrl;
    link.download = "Offer-Letter-" + job.company.replace(/ /g, "-") + ".pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(function () {
        URL.revokeObjectURL(fileUrl);
    }, 1000);
}

if (offerGrid != null) {
    // offerDecisions looks like { j1: "accepted", j2: "declined" }
    const offerDecisions = loadData("ie_offers", {});
    const offerIds = ["j1", "j2"];

    // Make the HTML of one offer card.
    function makeOfferCard(jobId) {
        const job = JOBS[jobId];
        const offer = OFFERS[jobId];

        return '<div class="application-card" data-id="' + jobId + '">' +
            '<div class="card-header">' +
            '<div class="company-avatar ' + offer.avatar + '">' + job.company.charAt(0) + "</div>" +
            "<div>" +
            "<h3>" + safeText(job.title) + "</h3>" +
            "<p>" + safeText(job.company) + " · " + safeText(offer.location) + "</p>" +
            "</div>" +
            "</div>" +
            '<p class="job-description">Congratulations! You have been selected for this internship. Please respond before the deadline.</p>' +
            '<div class="tags"><span>Start: ' + formatDate(offer.start) + "</span><span>" + offer.duration + "</span><span>" + offer.stipend + "</span></div>" +
            '<div class="card-info">' +
            "<div><span>Reply Deadline</span><h4>" + offer.deadline + "</h4></div>" +
            '<div><span>Offer Status</span><h4 class="status-text pending-text">Awaiting Response</h4></div>' +
            "</div>" +
            '<p class="offer-msg error-msg"></p>' +
            '<div class="card-buttons">' +
            '<button type="button" class="btn btn-details">View Details</button>' +
            '<button type="button" class="btn btn-download">Download</button>' +
            '<button type="button" class="btn btn-accept">Accept</button>' +
            '<button type="button" class="btn btn-decline">Decline</button>' +
            '<span class="btn btn-status final-state" style="display:none"></span>' +
            "</div>" +
            '<div class="details-box">' +
            "Position: " + safeText(job.title) + "<br>Company: " + safeText(job.company) + "<br>" +
            "Location: " + safeText(offer.location) + " (" + offer.mode + ")<br>" +
            "Start date: " + formatDate(offer.start) + "<br>End date: " + formatDate(offer.end) + "<br>" +
            "Duration: " + offer.duration + "<br>Stipend: " + offer.stipend +
            "</div>" +
            "</div>";
    }

    // Show the right status and buttons on every offer card.
    function showOfferStatus() {
        const offerCards = offerGrid.getElementsByClassName("application-card");

        for (let i = 0; i < offerCards.length; i++) {
            const card = offerCards[i];
            const decision = offerDecisions[card.dataset.id];
            const statusText = card.getElementsByClassName("status-text")[0];
            const acceptButton = card.getElementsByClassName("btn-accept")[0];
            const declineButton = card.getElementsByClassName("btn-decline")[0];
            const finalState = card.getElementsByClassName("final-state")[0];

            if (decision === "accepted") {
                statusText.textContent = "Accepted";
                statusText.className = "status-text accepted-text";
                finalState.textContent = "Accepted";
                finalState.className = "btn btn-status final-state accepted-btn";
            } else if (decision === "declined") {
                statusText.textContent = "Declined";
                statusText.className = "status-text rejected-text";
                finalState.textContent = "Declined";
                finalState.className = "btn btn-status final-state rejected-btn";
            } else {
                statusText.textContent = "Awaiting Response";
                statusText.className = "status-text pending-text";
            }

            if (decision === undefined) {
                acceptButton.style.display = "";
                declineButton.style.display = "";
                finalState.style.display = "none";
            } else {
                acceptButton.style.display = "none";
                declineButton.style.display = "none";
                finalState.style.display = "";
            }
        }
    }

    // Check if the student already accepted one of the offers.
    function alreadyAccepted() {
        for (let i = 0; i < offerIds.length; i++) {
            if (offerDecisions[offerIds[i]] === "accepted") {
                return true;
            }
        }
        return false;
    }

    // Add the click events to the buttons of one offer card.
    function addOfferEvents(card) {
        const jobId = card.dataset.id;
        const message = card.getElementsByClassName("offer-msg")[0];
        const detailsButton = card.getElementsByClassName("btn-details")[0];
        const downloadButton = card.getElementsByClassName("btn-download")[0];
        const acceptButton = card.getElementsByClassName("btn-accept")[0];
        const declineButton = card.getElementsByClassName("btn-decline")[0];

        detailsButton.addEventListener("click", function () {
            toggleDetails(card, detailsButton, "View Details");
        });

        downloadButton.addEventListener("click", function () {
            downloadOfferLetter(jobId);
        });

        acceptButton.addEventListener("click", function () {
            message.style.display = "none";

            if (alreadyAccepted()) {
                message.textContent = "You have already accepted another offer. Only one internship can be taken.";
                message.style.display = "block";
                return;
            }

            if (confirm("Are you sure you want to accept this offer? This cannot be undone.")) {
                offerDecisions[jobId] = "accepted";
                saveData("ie_offers", offerDecisions);
                showOfferStatus();
            }
        });

        declineButton.addEventListener("click", function () {
            message.style.display = "none";

            if (confirm("Are you sure you want to decline this offer? This cannot be undone.")) {
                offerDecisions[jobId] = "declined";
                saveData("ie_offers", offerDecisions);
                showOfferStatus();
            }
        });
    }

    let allCardsHtml = "";

    for (let i = 0; i < offerIds.length; i++) {
        allCardsHtml = allCardsHtml + makeOfferCard(offerIds[i]);
    }
    offerGrid.innerHTML = allCardsHtml;

    const offerCards = offerGrid.getElementsByClassName("application-card");

    for (let i = 0; i < offerCards.length; i++) {
        addOfferEvents(offerCards[i]);
    }

    showOfferStatus();
}

// 4. DASHBOARD COUNTS AND APPLICATION TABLE
// Only "Pending" grows (one for every application). Accepted and Rejected stay as they are.
const countPending = document.getElementById("countPending");

if (countPending != null) {
    const appliedJobs = loadData("ie_applied", {});
    const jobIds = Object.keys(appliedJobs).sort();
    const tableBody = document.getElementById("recentBody");

    countPending.textContent = jobIds.length;

    if (jobIds.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4">No applications yet. Visit "Find Internships" to apply.</td></tr>';
    } else {
        let rowsHtml = "";

        for (let i = 0; i < jobIds.length; i++) {
            const job = JOBS[jobIds[i]];

            rowsHtml = rowsHtml + "<tr>" +
                "<td>" + safeText(job.title) + "</td>" +
                "<td>" + safeText(job.company) + "</td>" +
                "<td>" + safeText(appliedJobs[jobIds[i]]) + "</td>" +
                '<td class="pending-text">Pending</td>' +
                "</tr>";
        }
        tableBody.innerHTML = rowsHtml;
    }
}

// 5. MY INTERNSHIP (shows the offer the student accepted)
const placementView = document.getElementById("placementView");

if (placementView != null) {
    const offerDecisions = loadData("ie_offers", {});
    const offerKeys = Object.keys(offerDecisions);
    let acceptedId = "";

    for (let i = 0; i < offerKeys.length; i++) {
        if (offerDecisions[offerKeys[i]] === "accepted") {
            acceptedId = offerKeys[i];
        }
    }

    if (acceptedId !== "" && OFFERS[acceptedId] != null) {
        const job = JOBS[acceptedId];
        const offer = OFFERS[acceptedId];

        const startDate = new Date(offer.start);
        const endDate = new Date(offer.end);
        const now = new Date();

        let status = "Ongoing";
        let statusClass = "accepted-text";

        if (now < startDate) {
            status = "Awaiting start";
            statusClass = "pending-text";
        } else if (now > endDate) {
            status = "Completed";
            statusClass = "shortlisted-text";
        }

        document.getElementById("plTitle").textContent = job.title;
        document.getElementById("plCompany").textContent = job.company;
        document.getElementById("plLocation").textContent = offer.location;
        document.getElementById("plMode").textContent = offer.mode;
        document.getElementById("plDuration").textContent = offer.duration;
        document.getElementById("plStipend").textContent = offer.stipend;
        document.getElementById("plStart").textContent = formatDate(offer.start);
        document.getElementById("plEnd").textContent = formatDate(offer.end);
        document.getElementById("plStatus").textContent = status;
        document.getElementById("plStatus").className = statusClass;

        placementView.style.display = "";
        document.getElementById("noPlacement").style.display = "none";
    }
}

// 6. SUBMIT DOCUMENTS
const docForm = document.getElementById("docForm");

if (docForm != null) {
    docForm.noValidate = true;

    const docType = document.getElementById("docType");
    const docFile = document.getElementById("docFile");
    const docTable = document.getElementById("docBody");
    const submittedDocs = loadData("ie_docs", []);

    // Show all submitted documents in the table.
    function showDocs() {
        if (submittedDocs.length === 0) {
            docTable.innerHTML = '<tr><td colspan="5">No documents submitted yet.</td></tr>';
            return;
        }

        let rowsHtml = "";

        for (let i = 0; i < submittedDocs.length; i++) {
            rowsHtml = rowsHtml + "<tr>" +
                "<td>" + safeText(submittedDocs[i].type) + "</td>" +
                "<td>" + safeText(submittedDocs[i].name) + "</td>" +
                "<td>" + safeText(submittedDocs[i].size) + "</td>" +
                "<td>" + safeText(submittedDocs[i].date) + "</td>" +
                '<td class="pending-text">Submitted</td>' +
                "</tr>";
        }
        docTable.innerHTML = rowsHtml;
    }

    clearErrorOnTyping("docType");
    clearErrorOnTyping("docFile");
    clearErrorsOnReset(docForm);

    docForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let typeMessage = "";
        let fileMessage = "";

        if (docType.value === "") {
            typeMessage = "Please select a document type.";
        }

        if (docFile.files.length === 0) {
            fileMessage = "Please choose a file to upload.";
        } else {
            const file = docFile.files[0];

            if (file.name.toLowerCase().indexOf(".pdf") === -1) {
                fileMessage = "Only PDF files are allowed.";
            } else if (file.size > 2 * 1024 * 1024) {
                fileMessage = "File must be smaller than 2 MB.";
            }
        }

        const typeOk = setError(docType, typeMessage);
        const fileOk = setError(docFile, fileMessage);

        if (typeOk === false || fileOk === false) {
            return;
        }

        const chosenFile = docFile.files[0];

        submittedDocs.push({
            type: docType.value,
            name: chosenFile.name,
            size: Math.round(chosenFile.size / 1024) + " KB",
            date: todayText()
        });
        saveData("ie_docs", submittedDocs);

        showDocs();
        docForm.reset();
        showSuccess("docSuccess", "Document submitted successfully.");
    });

    showDocs();
}

// 7. PROGRESS REPORTS
const reportForm = document.getElementById("reportForm");

if (reportForm != null) {
    reportForm.noValidate = true;

    const repWeek = document.getElementById("repWeek");
    const repHours = document.getElementById("repHours");
    const repSummary = document.getElementById("repSummary");
    const reportTable = document.getElementById("reportBody");
    const submittedReports = loadData("ie_reports", []);

    // Show all submitted reports in the table.
    function showReports() {
        if (submittedReports.length === 0) {
            reportTable.innerHTML = '<tr><td colspan="5">No reports submitted yet.</td></tr>';
            return;
        }

        let rowsHtml = "";

        for (let i = 0; i < submittedReports.length; i++) {
            rowsHtml = rowsHtml + "<tr>" +
                "<td>Week " + safeText(submittedReports[i].week) + "</td>" +
                "<td>" + safeText(submittedReports[i].hours) + "</td>" +
                "<td>" + safeText(submittedReports[i].summary) + "</td>" +
                "<td>" + safeText(submittedReports[i].date) + "</td>" +
                '<td class="pending-text">Awaiting Review</td>' +
                "</tr>";
        }
        reportTable.innerHTML = rowsHtml;
    }

    clearErrorOnTyping("repWeek");
    clearErrorOnTyping("repHours");
    clearErrorOnTyping("repSummary");
    clearErrorsOnReset(reportForm);

    reportForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const week = Number(repWeek.value);
        const hours = Number(repHours.value);
        const summary = repSummary.value.trim();

        let weekMessage = "";
        let hoursMessage = "";
        let summaryMessage = "";

        if (repWeek.value === "" || week < 1 || week > 24) {
            weekMessage = "Enter a week number between 1 and 24.";
        } else {
            for (let i = 0; i < submittedReports.length; i++) {
                if (Number(submittedReports[i].week) === week) {
                    weekMessage = "A report for this week was already submitted.";
                }
            }
        }

        if (repHours.value === "" || hours < 1 || hours > 60) {
            hoursMessage = "Enter the hours worked (1 to 60).";
        }

        if (summary.length < 30) {
            summaryMessage = "Please write at least 30 characters.";
        }

        const weekOk = setError(repWeek, weekMessage);
        const hoursOk = setError(repHours, hoursMessage);
        const summaryOk = setError(repSummary, summaryMessage);

        if (weekOk === false || hoursOk === false || summaryOk === false) {
            return;
        }

        submittedReports.push({
            week: week,
            hours: hours,
            summary: summary,
            date: todayText()
        });
        saveData("ie_reports", submittedReports);

        showReports();
        reportForm.reset();
        showSuccess("reportSuccess", "Progress report submitted.");
    });

    showReports();
}

// 8. MY PROFILE (only checks the details, nothing is saved)
const profileForm = document.getElementById("profileForm");

if (profileForm != null) {
    profileForm.noValidate = true;

    const pName = document.getElementById("pName");
    const pId = document.getElementById("pId");
    const pEmail = document.getElementById("pEmail");
    const pPhone = document.getElementById("pPhone");
    const pDept = document.getElementById("pDept");
    const pCgpa = document.getElementById("pCgpa");
    const pSkills = document.getElementById("pSkills");

    clearErrorOnTyping("pName");
    clearErrorOnTyping("pId");
    clearErrorOnTyping("pEmail");
    clearErrorOnTyping("pPhone");
    clearErrorOnTyping("pDept");
    clearErrorOnTyping("pCgpa");
    clearErrorOnTyping("pSkills");
    clearErrorsOnReset(profileForm);

    profileForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = pName.value.trim();
        const studentId = pId.value.trim();
        const email = pEmail.value.trim();
        const phone = pPhone.value.trim();
        const cgpa = Number(pCgpa.value);

        let nameMessage = "";
        let idMessage = "";
        let emailMessage = "";
        let phoneMessage = "";
        let deptMessage = "";
        let cgpaMessage = "";
        let skillsMessage = "";

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

        if (pDept.value === "") {
            deptMessage = "Please select your department.";
        }

        if (pCgpa.value === "" || cgpa < 0 || cgpa > 4) {
            cgpaMessage = "Enter your CGPA (0.00 - 4.00).";
        }

        if (pSkills.value.trim() === "") {
            skillsMessage = "List at least one skill.";
        }

        const results = [
            setError(pName, nameMessage),
            setError(pId, idMessage),
            setError(pEmail, emailMessage),
            setError(pPhone, phoneMessage),
            setError(pDept, deptMessage),
            setError(pCgpa, cgpaMessage),
            setError(pSkills, skillsMessage)
        ];

        if (results.indexOf(false) !== -1) {
            return;
        }

        // show the first letter of the name in the round profile pictures
        const firstLetter = name.charAt(0).toUpperCase();
        document.getElementById("profileAvatar").textContent = firstLetter;

        const topIcon = document.getElementsByClassName("profile-icon")[0];

        if (topIcon != null) {
            topIcon.textContent = firstLetter;
        }

        showSuccess("profileSuccess", "All details are valid. (Not saved yet - database coming soon.)");
    });
}
