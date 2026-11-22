
var evaluationStorageKey = "internEaseFinalEvaluationDecisions";
var settingsStorageKey = "internEaseCoordinatorSettings";
var currentEvaluationId = "";

var evaluations = {
    "FE-026": {
        id: "FE-026",
        student: "S.M Tajwar Tahmid",
        studentId: "23-54828-3",
        placementId: "PLA-026",
        company: "Kaz Software",
        position: "Software Engineer Intern",
        duration: "3 Months",
        postingId: "INT-026",
        supervisorAvailable: true
    },
    "FE-025": {
        id: "FE-025",
        student: "Farhan Sadik Fahim",
        studentId: "23-53663-3",
        placementId: "PLA-025",
        company: "Therap (BD) Ltd.",
        position: "QA Engineer Intern",
        duration: "",
        postingId: "",
        supervisorAvailable: false
    },
    "FE-024": {
        id: "FE-024",
        student: "MD. Sajid Arafat",
        studentId: "23-53526-3",
        placementId: "PLA-024",
        company: "Cefalo Bangladesh",
        position: "Front-End Developer Intern",
        duration: "",
        postingId: "",
        supervisorAvailable: false
    }
};

var originalStatuses = {
    "FE-026": "Pending Evaluation",
    "FE-025": "Pending Evaluation",
    "FE-024": "Pending Evaluation"
};

function getSavedEvaluations() {
    var savedData = localStorage.getItem(evaluationStorageKey);

    if (savedData) {
        try {
            return JSON.parse(savedData);
        } catch (error) {
            return {};
        }
    }

    return {};
}

function saveEvaluations(savedData) {
    try {
        localStorage.setItem(evaluationStorageKey, JSON.stringify(savedData));
        return true;
    } catch (error) {
        alert("Evaluation could not be saved in this browser.");
        return false;
    }
}

function getEvaluationStatus(evaluationId) {
    var savedData = getSavedEvaluations();

    if (savedData[evaluationId] && savedData[evaluationId].status) {
        return savedData[evaluationId].status;
    }

    return originalStatuses[evaluationId];
}

function getStatusClass(status) {
    if (status === "Completed") {
        return "status-active";
    }

    if (status === "Returned for Review") {
        return "status-review";
    }

    return "status-pending";
}

function updateStatusBadge(element, status) {
    if (!element) {
        return;
    }

    element.textContent = status;

    element.classList.remove(
        "status-pending",
        "status-active",
        "status-review",
        "status-revision"
    );

    element.classList.add(getStatusClass(status));
}

function updateEvaluationTable() {
    var rows = document.querySelectorAll(".evaluation-list-panel tbody tr");

    rows.forEach(function (row) {
        var idElement = row.querySelector(".evaluation-id");

        if (!idElement) {
            return;
        }

        var evaluationId = idElement.textContent.trim();
        var statusElement = row.querySelector(".status");

        if (evaluations[evaluationId]) {
            updateStatusBadge(statusElement, getEvaluationStatus(evaluationId));
        }
    });
}

function getEvaluationCounts() {
    var counts = {
        pending: 0,
        completed: 0,
        returned: 0
    };

    Object.keys(evaluations).forEach(function (evaluationId) {
        var status = getEvaluationStatus(evaluationId);

        if (status === "Completed") {
            counts.completed++;
        } else if (status === "Returned for Review") {
            counts.returned++;
        } else {
            counts.pending++;
        }
    });

    return counts;
}

function updateEvaluationCounts() {
    var counts = getEvaluationCounts();

    var countElements = document.querySelectorAll(
        ".evaluation-status-panel .evaluation-status-count"
    );

    if (countElements.length >= 3) {
        countElements[0].textContent = counts.pending;
        countElements[1].textContent = counts.completed;
        countElements[2].textContent = counts.returned;
    }
}

function filterEvaluations() {
    var searchInput = document.getElementById("evaluation-search");
    var topSearchInput = document.querySelector(".topbar-search input");
    var statusFilter = document.getElementById("evaluation-status");
    var companyFilter = document.getElementById("company-filter");

    var searchText = "";
    var topSearchText = "";
    var selectedStatus = "";
    var selectedCompany = "";

    if (searchInput) {
        searchText = searchInput.value.toLowerCase().trim();
    }

    if (topSearchInput) {
        topSearchText = topSearchInput.value.toLowerCase().trim();
    }

    if (statusFilter) {
        selectedStatus = statusFilter.value;
    }

    if (companyFilter) {
        selectedCompany = companyFilter.value;
    }

    var rows = document.querySelectorAll(".evaluation-list-panel tbody tr");

    rows.forEach(function (row) {
        var idElement = row.querySelector(".evaluation-id");

        if (!idElement) {
            return;
        }

        var evaluationId = idElement.textContent.trim();
        var rowText = row.textContent.toLowerCase();
        var status = getEvaluationStatus(evaluationId);

        var statusValue = "pending";

        if (status === "Completed") {
            statusValue = "completed";
        } else if (status === "Returned for Review") {
            statusValue = "returned";
        }

        var matchesSearch = (
            !searchText || rowText.indexOf(searchText) !== -1
        );

        var matchesTopSearch = (
            !topSearchText || rowText.indexOf(topSearchText) !== -1
        );

        var matchesStatus = (
            !selectedStatus || selectedStatus === statusValue
        );

        var matchesCompany = (
            !selectedCompany || rowText.indexOf(selectedCompany) !== -1
        );

        if (
            matchesSearch &&
            matchesTopSearch &&
            matchesStatus &&
            matchesCompany
        ) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

function getInformationValue(panel, labelText) {
    if (!panel) {
        return null;
    }

    var items = panel.querySelectorAll(".information-item");

    for (var i = 0; i < items.length; i++) {
        var label = items[i].querySelector("span");

        if (label && label.textContent.trim() === labelText) {
            return items[i].querySelector("strong");
        }
    }

    return null;
}

function setInformationValue(panel, labelText, value) {
    var element = getInformationValue(panel, labelText);

    if (element) {
        element.textContent = value;
    }
}

function showInformationItem(panel, labelText, show) {
    if (!panel) {
        return;
    }

    var items = panel.querySelectorAll(".information-item");

    items.forEach(function (item) {
        var label = item.querySelector("span");

        if (label && label.textContent.trim() === labelText) {
            item.style.display = show ? "" : "none";
        }
    });
}

function setSideInformation(labelText, value) {
    var items = document.querySelectorAll(
        ".evaluation-status-panel .side-information"
    );

    items.forEach(function (item) {
        var label = item.querySelector("span");

        if (label && label.textContent.trim() === labelText) {
            item.querySelector("strong").textContent = value;
        }
    });
}

function updateEvaluationDetails() {
    var query = new URLSearchParams(window.location.search);
    var evaluationId = query.get("evaluation_id") || "FE-026";

    var evaluation = evaluations[evaluationId];

    if (!evaluation) {
        alert("Evaluation record not found.");
        window.location.href = "index.html";
        return;
    }

    currentEvaluationId = evaluationId;

    var savedData = getSavedEvaluations();
    var savedEvaluation = savedData[evaluationId] || {};
    var currentStatus = getEvaluationStatus(evaluationId);

    var overview = document.querySelector(".evaluation-overview");
    var overviewLabel = overview.querySelector(".small-label");
    var overviewName = overview.querySelector("h2");
    var overviewStudentId = overview.querySelector("p");
    var overviewStatus = overview.querySelector(".status");

    overviewLabel.textContent = "EVALUATION ID: " + evaluation.id;
    overviewName.textContent = evaluation.student;
    overviewStudentId.textContent = evaluation.studentId;

    updateStatusBadge(overviewStatus, currentStatus);

    var studentPanel = document.querySelector(".student-information-panel");

    setInformationValue(studentPanel, "Student Name", evaluation.student);
    setInformationValue(studentPanel, "Student ID", evaluation.studentId);
    setInformationValue(studentPanel, "Evaluation ID", evaluation.id);
    setInformationValue(studentPanel, "Placement ID", evaluation.placementId);

    var studentLink = studentPanel.querySelector(".profile-link");

    if (studentLink) {
        studentLink.href =
            "../Students/student_details.html?student_id=" +
            encodeURIComponent(evaluation.studentId);
    }

    var internshipPanel = document.querySelector(
        ".internship-information-panel"
    );

    setInformationValue(internshipPanel, "Company Name", evaluation.company);
    setInformationValue(internshipPanel, "Internship Position", evaluation.position);

    showInformationItem(
        internshipPanel,
        "Internship Duration",
        evaluation.duration !== ""
    );

    showInformationItem(
        internshipPanel,
        "Posting ID",
        evaluation.postingId !== ""
    );

    if (evaluation.duration !== "") {
        setInformationValue(
            internshipPanel,
            "Internship Duration",
            evaluation.duration
        );
    }

    if (evaluation.postingId !== "") {
        setInformationValue(
            internshipPanel,
            "Posting ID",
            evaluation.postingId
        );
    }

    var postingLink = internshipPanel.querySelector(".profile-link");

    if (postingLink) {
        if (evaluation.postingId) {
            postingLink.style.display = "";
            postingLink.href =
                "../Internship%20Postings/posting_details.html?posting_id=" +
                encodeURIComponent(evaluation.postingId);
        } else {
            postingLink.style.display = "none";
        }
    }

    var supervisorPanel = document.querySelector(
        ".supervisor-assessment-panel"
    );

    var supervisorFinalPanel = document.querySelector(
        ".supervisor-final-panel"
    );

    supervisorPanel.style.display = evaluation.supervisorAvailable ? "" : "none";
    supervisorFinalPanel.style.display = evaluation.supervisorAvailable ? "" : "none";

    var statusPanel = document.querySelector(".evaluation-status-panel");
    var detailStatus = statusPanel.querySelector(".evaluation-detail-status");
    var statusIcon = detailStatus.querySelector(".evaluation-status-icon");
    var statusText = detailStatus.querySelector("strong");
    var evaluationIdText = detailStatus.querySelector("span:last-child");

    statusText.textContent = currentStatus;
    evaluationIdText.textContent = evaluation.id;

    statusIcon.classList.remove(
        "evaluation-yellow",
        "evaluation-green",
        "evaluation-red"
    );

    if (currentStatus === "Completed") {
        statusIcon.classList.add("evaluation-green");
        statusIcon.textContent = "✓";
        statusText.style.color = "#078653";
    } else if (currentStatus === "Returned for Review") {
        statusIcon.classList.add("evaluation-red");
        statusIcon.textContent = "↻";
        statusText.style.color = "#b42318";
    } else {
        statusIcon.classList.add("evaluation-yellow");
        statusIcon.textContent = "◷";
        statusText.style.color = "#a66500";
    }

    setSideInformation("Student Name", evaluation.student);
    setSideInformation("Student ID", evaluation.studentId);
    setSideInformation("Company", evaluation.company);
    setSideInformation("Position", evaluation.position);
    setSideInformation("Placement ID", evaluation.placementId);

    document.getElementById("final-grade").value =
        savedEvaluation.grade || "";

    document.getElementById("final-score").value =
        savedEvaluation.score || "";

    document.getElementById("evaluation-remarks").value =
        savedEvaluation.remarks || "";
}

function setupEvaluationButtons() {
    var finalizeButton = document.querySelector(
        ".evaluation-form .button-approve"
    );

    var returnButton = document.querySelector(
        ".evaluation-form .button-return"
    );

    var backButton = document.querySelector(".bottom-back-button");

    if (finalizeButton) {
        finalizeButton.addEventListener("click", function () {
            finalizeEvaluation();
        });
    }

    if (returnButton) {
        returnButton.addEventListener("click", function () {
            returnEvaluation();
        });
    }

    if (backButton) {
        backButton.addEventListener("click", function () {
            window.location.href = "index.html";
        });
    }
}

function getEvaluationFormData() {
    var grade = document.getElementById("final-grade").value.trim();
    var scoreText = document.getElementById("final-score").value.trim();
    var remarks = document.getElementById("evaluation-remarks").value.trim();

    return {
        grade: grade,
        score: scoreText,
        remarks: remarks
    };
}

function finalizeEvaluation() {
    var formData = getEvaluationFormData();

    if (formData.grade === "" || formData.score === "") {
        alert("Please enter both Final Grade and Final Score.");
        return;
    }

    var score = Number(formData.score);

    if (isNaN(score) || score < 0) {
        alert("Please enter a valid numeric Final Score.");
        return;
    }

    if (!confirm("Are you sure you want to finalize this evaluation?")) {
        return;
    }

    var savedData = getSavedEvaluations();

    savedData[currentEvaluationId] = {
        status: "Completed",
        grade: formData.grade,
        score: formData.score,
        remarks: formData.remarks
    };

    if (saveEvaluations(savedData)) {
        alert("Final evaluation completed successfully.");
        updateEvaluationDetails();
    }
}

function returnEvaluation() {
    var formData = getEvaluationFormData();

    if (formData.remarks === "") {
        alert("Please write Coordinator Remarks before returning this evaluation.");
        return;
    }

    if (!confirm("Are you sure you want to return this evaluation for review?")) {
        return;
    }

    var savedData = getSavedEvaluations();
    var previousData = savedData[currentEvaluationId] || {};

    savedData[currentEvaluationId] = {
        status: "Returned for Review",
        grade: formData.grade || previousData.grade || "",
        score: formData.score || previousData.score || "",
        remarks: formData.remarks
    };

    if (saveEvaluations(savedData)) {
        alert("Evaluation returned for review successfully.");
        updateEvaluationDetails();
    }
}

function setupEvaluationFilters() {
    var searchInput = document.getElementById("evaluation-search");
    var topSearchInput = document.querySelector(".topbar-search input");
    var statusFilter = document.getElementById("evaluation-status");
    var companyFilter = document.getElementById("company-filter");

    if (searchInput) {
        searchInput.addEventListener("input", filterEvaluations);
    }

    if (topSearchInput) {
        topSearchInput.addEventListener("input", filterEvaluations);
    }

    if (statusFilter) {
        statusFilter.addEventListener("change", filterEvaluations);
    }

    if (companyFilter) {
        companyFilter.addEventListener("change", filterEvaluations);
    }
}

function setupProfileDropdown() {
    var savedSettings = localStorage.getItem(settingsStorageKey);

    if (savedSettings) {
        try {
            var settings = JSON.parse(savedSettings);
            var savedName =
                settings.fullName || settings.full_name || settings.name;

            var profileName = document.querySelector(".profile-info strong");
            var profileAvatar = document.querySelector(".profile-avatar");

            if (savedName && profileName) {
                profileName.textContent = savedName;
            }

            var savedImage =
                settings.profileImage ||
                settings.profile_image ||
                settings.profilePicture ||
                settings.profile_picture;

            if (savedName && profileAvatar && !savedImage) {
                profileAvatar.textContent = savedName.split(" ").map(function (part) {
                    return part.charAt(0);
                }).join("").substring(0, 4).toUpperCase();
            }

            if (savedImage && profileAvatar) {
                profileAvatar.textContent = "";
                profileAvatar.style.backgroundImage = "url('" + savedImage + "')";
                profileAvatar.style.backgroundSize = "cover";
                profileAvatar.style.backgroundPosition = "center";
            }
        } catch (error) {
        }
    }

    var dropdowns = document.querySelectorAll(
        ".notification-dropdown, .profile-dropdown"
    );

    dropdowns.forEach(function (dropdown) {
        var summary = dropdown.querySelector("summary");

        if (summary) {
            summary.addEventListener("click", function () {
                dropdowns.forEach(function (otherDropdown) {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.removeAttribute("open");
                    }
                });
            });
        }
    });

    document.addEventListener("click", function (event) {
        dropdowns.forEach(function (dropdown) {
            if (!dropdown.contains(event.target)) {
                dropdown.removeAttribute("open");
            }
        });
    });
}

function setupFinalEvaluation() {
    setupProfileDropdown();

    if (document.querySelector(".evaluation-list-panel")) {
        updateEvaluationTable();
        updateEvaluationCounts();
        setupEvaluationFilters();
        filterEvaluations();
    }

    if (document.querySelector(".evaluation-form")) {
        updateEvaluationDetails();
        setupEvaluationButtons();
    }
}

window.addEventListener("storage", function (event) {
    if (
        event.key === evaluationStorageKey &&
        document.querySelector(".evaluation-list-panel")
    ) {
        updateEvaluationTable();
        updateEvaluationCounts();
        filterEvaluations();
    }

    if (
        event.key === evaluationStorageKey &&
        document.querySelector(".evaluation-form")
    ) {
        updateEvaluationDetails();
    }
});

document.addEventListener("DOMContentLoaded", setupFinalEvaluation);
