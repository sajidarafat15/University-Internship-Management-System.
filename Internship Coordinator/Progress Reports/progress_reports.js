
var reportStorageKey = "internEaseProgressReportDecisions";
var settingsStorageKey = "internEaseCoordinatorSettings";
var currentDetailsReportId = "";

var progressReports = {
    "PR-026": {
        id: "PR-026",
        student: "S.M Tajwar Tahmid",
        studentId: "23-54828-3",
        company: "Kaz Software",
        position: "Software Engineer Intern",
        week: "Week 04",
        weekValue: "week-04",
        submitted: "29 Oct 2026",
        status: "Pending Review",
        detailsAvailable: true
    },
    "PR-025": {
        id: "PR-025",
        student: "Farhan Sadik Fahim",
        studentId: "23-53663-3",
        company: "Therap (BD) Ltd.",
        position: "QA Engineer Intern",
        week: "Week 03",
        weekValue: "week-03",
        submitted: "28 Oct 2026",
        status: "Pending Review",
        detailsAvailable: false
    },
    "PR-024": {
        id: "PR-024",
        student: "MD. Sajid Arafat",
        studentId: "23-53526-3",
        company: "Cefalo Bangladesh",
        position: "Front-End Developer Intern",
        week: "Week 02",
        weekValue: "week-02",
        submitted: "27 Oct 2026",
        status: "Needs Revision",
        detailsAvailable: false
    }
};

var originalReportStatuses = {
    "PR-026": "Pending Review",
    "PR-025": "Pending Review",
    "PR-024": "Needs Revision"
};

function getSavedReports() {
    var savedReports = localStorage.getItem(reportStorageKey);

    if (savedReports) {
        try {
            return JSON.parse(savedReports);
        } catch (error) {
            return {};
        }
    }

    return {};
}

function saveReports(savedReports) {
    try {
        localStorage.setItem(reportStorageKey, JSON.stringify(savedReports));
        return true;
    } catch (error) {
        alert("The report decision could not be saved in this browser.");
        return false;
    }
}

function getReportStatus(reportId) {
    var savedReports = getSavedReports();

    if (savedReports[reportId] && savedReports[reportId].status) {
        return savedReports[reportId].status;
    }

    return progressReports[reportId].status;
}

function getStatusClass(status) {
    if (status === "Reviewed") {
        return "status-review";
    }

    if (status === "Needs Revision") {
        return "status-revision";
    }

    return "status-pending";
}

function updateStatusElement(element, status) {
    if (!element) {
        return;
    }

    element.textContent = status;
    element.classList.remove("status-pending", "status-review", "status-revision", "status-active");
    element.classList.add(getStatusClass(status));
}

function updateReportTable() {
    var tableRows = document.querySelectorAll(".report-list-panel tbody tr");

    tableRows.forEach(function (row) {
        var reportId = row.querySelector(".report-id").textContent.trim();
        var report = progressReports[reportId];

        if (report) {
            var statusElement = row.querySelector(".status");
            updateStatusElement(statusElement, getReportStatus(reportId));
        }
    });
}

function getReportCounts() {
    var counts = {
        total: 36,
        pending: 27,
        reviewed: 7,
        revision: 2
    };

    Object.keys(progressReports).forEach(function (reportId) {
        var oldStatus = originalReportStatuses[reportId];
        var newStatus = getReportStatus(reportId);

        if (oldStatus !== newStatus) {
            if (oldStatus === "Pending Review") {
                counts.pending = counts.pending - 1;
            } else if (oldStatus === "Reviewed") {
                counts.reviewed = counts.reviewed - 1;
            } else if (oldStatus === "Needs Revision") {
                counts.revision = counts.revision - 1;
            }

            if (newStatus === "Pending Review") {
                counts.pending = counts.pending + 1;
            } else if (newStatus === "Reviewed") {
                counts.reviewed = counts.reviewed + 1;
            } else if (newStatus === "Needs Revision") {
                counts.revision = counts.revision + 1;
            }
        }
    });

    return counts;
}

function updateReportCounts() {
    var counts = getReportCounts();
    var summaryValues = document.querySelectorAll(".summary-card .summary-info h2");

    if (summaryValues.length >= 4) {
        summaryValues[0].textContent = counts.total;
        summaryValues[1].textContent = counts.pending;
        summaryValues[2].textContent = counts.reviewed;
        summaryValues[3].textContent = counts.revision;
    }

    var sideItems = document.querySelectorAll(".report-status-item");

    sideItems.forEach(function (item) {
        var label = item.querySelector("strong").textContent.trim();
        var count = item.querySelector(".report-status-count");

        if (label === "Reviewed") {
            count.textContent = counts.reviewed;
        } else if (label === "Pending Review") {
            count.textContent = counts.pending;
        } else if (label === "Needs Revision") {
            count.textContent = counts.revision;
        }
    });
}

function filterReports() {
    var searchInput = document.getElementById("report-search");
    var topSearchInput = document.querySelector(".topbar-search input");
    var statusFilter = document.getElementById("report-status");
    var weekFilter = document.getElementById("report-week");
    var rows = document.querySelectorAll(".report-list-panel tbody tr");

    var searchText = "";
    var topSearchText = "";
    var selectedStatus = "";
    var selectedWeek = "";

    if (searchInput) {
        searchText = searchInput.value.toLowerCase().trim();
    }

    if (topSearchInput) {
        topSearchText = topSearchInput.value.toLowerCase().trim();
    }

    if (statusFilter) {
        selectedStatus = statusFilter.value;
    }

    if (weekFilter) {
        selectedWeek = weekFilter.value;
    }

    rows.forEach(function (row) {
        var reportId = row.querySelector(".report-id").textContent.trim();
        var report = progressReports[reportId];
        var rowText = row.textContent.toLowerCase();
        var reportStatus = getReportStatus(reportId);
        var statusValue = "pending";

        if (reportStatus === "Reviewed") {
            statusValue = "reviewed";
        } else if (reportStatus === "Needs Revision") {
            statusValue = "revision";
        }

        var matchesSearch = (!searchText || rowText.indexOf(searchText) !== -1);
        var matchesTopSearch = (!topSearchText || rowText.indexOf(topSearchText) !== -1);
        var matchesStatus = (!selectedStatus || statusValue === selectedStatus);
        var matchesWeek = (!selectedWeek || report.weekValue === selectedWeek);

        if (matchesSearch && matchesTopSearch && matchesStatus && matchesWeek) {
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

function setSideInformation(labelText, value) {
    var items = document.querySelectorAll(".report-status-panel .side-information");

    items.forEach(function (item) {
        var label = item.querySelector("span");

        if (label && label.textContent.trim() === labelText) {
            item.querySelector("strong").textContent = value;
        }
    });
}

function showUnavailableReportMessage() {
    var detailPanels = document.querySelectorAll(
        ".work-completed-panel, .skills-learned-panel, .challenges-panel, .next-week-panel"
    );

    detailPanels.forEach(function (panel) {
        panel.style.display = "none";
    });

    var overviewMain = document.querySelector(".details-grid .overview-main");

    if (overviewMain && !document.querySelector(".report-content-unavailable")) {
        var messagePanel = document.createElement("article");
        messagePanel.className = "panel report-content-unavailable";

        var messageHeading = document.createElement("h2");
        messageHeading.textContent = "Report Content";

        var messageText = document.createElement("p");
        messageText.textContent = "Detailed weekly report content was not included in the available sample data for this report.";

        messagePanel.appendChild(messageHeading);
        messagePanel.appendChild(messageText);
        overviewMain.appendChild(messagePanel);
    }
}

function updateReportDetails() {
    var query = new URLSearchParams(window.location.search);
    var reportId = query.get("report_id") || "PR-026";
    var report = progressReports[reportId];
    currentDetailsReportId = reportId;

    if (!report) {
        alert("This progress report was not found.");
        window.location.href = "index.html";
        return;
    }

    var savedReports = getSavedReports();
    var savedReport = savedReports[reportId] || {};
    var currentStatus = getReportStatus(reportId);
    var overview = document.querySelector(".report-overview");
    var overviewLabel = document.querySelector(".report-overview .small-label");
    var overviewName = document.querySelector(".report-overview h2");
    var overviewStudentId = document.querySelector(".report-overview-left p");
    var overviewStatus = overview.querySelector(".status");

    overviewLabel.textContent = "REPORT ID: " + report.id;
    overviewName.textContent = report.student;
    overviewStudentId.textContent = report.studentId;
    updateStatusElement(overviewStatus, currentStatus);

    var reportPanel = document.querySelector(".report-information-panel");
    setInformationValue(reportPanel, "Report ID", report.id);
    setInformationValue(reportPanel, "Reporting Period", report.week);
    setInformationValue(reportPanel, "Submitted On", report.submitted);
    setInformationValue(reportPanel, "Report Status", currentStatus);

    var reportStatusValue = getInformationValue(reportPanel, "Report Status");
    if (reportStatusValue) {
        reportStatusValue.className = currentStatus === "Pending Review" ? "pending-text" : "";
    }

    var studentPanel = document.querySelector(".student-information-panel");
    setInformationValue(studentPanel, "Student Name", report.student);
    setInformationValue(studentPanel, "Student ID", report.studentId);
    setInformationValue(studentPanel, "Company", report.company);
    setInformationValue(studentPanel, "Internship Position", report.position);

    var studentLink = document.querySelector(".student-information-panel .profile-link");
    if (studentLink) {
        studentLink.href = "../Students/student_details.html?student_id=" + encodeURIComponent(report.studentId);
    }

    var detailStatus = document.querySelector(".report-detail-status");
    detailStatus.querySelector("strong").textContent = currentStatus;
    detailStatus.querySelector("span:last-child").textContent = report.id;

    var statusIcon = detailStatus.querySelector(".report-status-icon");
    statusIcon.classList.remove("report-green", "report-yellow", "report-red");

    if (currentStatus === "Reviewed") {
        statusIcon.classList.add("report-green");
        statusIcon.textContent = "✓";
        detailStatus.querySelector("strong").style.color = "#078653";
    } else if (currentStatus === "Needs Revision") {
        statusIcon.classList.add("report-red");
        statusIcon.textContent = "↻";
        detailStatus.querySelector("strong").style.color = "#b42318";
    } else {
        statusIcon.classList.add("report-yellow");
        statusIcon.textContent = "◷";
        detailStatus.querySelector("strong").style.color = "#a66500";
    }

    setSideInformation("Student Name", report.student);
    setSideInformation("Student ID", report.studentId);
    setSideInformation("Company", report.company);
    setSideInformation("Reporting Period", report.week);
    setSideInformation("Submitted On", report.submitted);

    var feedbackInput = document.getElementById("coordinator-feedback");
    if (feedbackInput) {
        feedbackInput.value = savedReport.feedback || "";
    }

    if (!report.detailsAvailable) {
        showUnavailableReportMessage();
    }
}

function setupReportReviewButtons() {
    var approveButton = document.querySelector(".report-review-form .button-approve");
    var returnButton = document.querySelector(".report-review-form .button-return");

    if (approveButton) {
        approveButton.addEventListener("click", function () {
            changeReportStatus(currentDetailsReportId, "Reviewed");
        });
    }

    if (returnButton) {
        returnButton.addEventListener("click", function () {
            changeReportStatus(currentDetailsReportId, "Needs Revision");
        });
    }
}

function changeReportStatus(reportId, newStatus) {
    var feedbackInput = document.getElementById("coordinator-feedback");
    var feedback = "";

    if (feedbackInput) {
        feedback = feedbackInput.value.trim();
    }

    if (newStatus === "Needs Revision" && feedback === "") {
        alert("Please write coordinator feedback before returning this report for revision.");
        return;
    }

    var actionText = newStatus === "Reviewed" ? "mark this report as reviewed" : "return this report for revision";

    if (!confirm("Are you sure you want to " + actionText + "?")) {
        return;
    }

    var savedReports = getSavedReports();
    savedReports[reportId] = {
        status: newStatus,
        feedback: feedback
    };

    if (saveReports(savedReports)) {
        alert("Progress report status updated successfully.");
        updateReportDetails();
    }
}

function setupProfileAndDropdowns() {
    var savedSettings = localStorage.getItem(settingsStorageKey);

    if (savedSettings) {
        try {
            var settings = JSON.parse(savedSettings);
            var savedName = settings.fullName || settings.full_name || settings.name;
            var profileName = document.querySelector(".profile-info strong");
            var profileAvatar = document.querySelector(".profile-avatar");

            if (savedName && profileName) {
                profileName.textContent = savedName;
            }

            var savedImage = settings.profileImage || settings.profile_image || settings.profilePicture || settings.profile_picture;

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

    var dropdowns = document.querySelectorAll(".notification-dropdown, .profile-dropdown");

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

function setupReportFilters() {
    var reportSearch = document.getElementById("report-search");
    var topSearch = document.querySelector(".topbar-search input");
    var statusFilter = document.getElementById("report-status");
    var weekFilter = document.getElementById("report-week");

    if (reportSearch) {
        reportSearch.addEventListener("input", filterReports);
    }

    if (topSearch) {
        topSearch.addEventListener("input", filterReports);
    }

    if (statusFilter) {
        statusFilter.addEventListener("change", filterReports);
    }

    if (weekFilter) {
        weekFilter.addEventListener("change", filterReports);
    }
}

function setupProgressReports() {
    setupProfileAndDropdowns();

    if (document.querySelector(".report-list-panel")) {
        updateReportTable();
        updateReportCounts();
        setupReportFilters();
        filterReports();
    }

    if (document.querySelector(".report-review-form")) {
        updateReportDetails();
        setupReportReviewButtons();
    }
}

window.addEventListener("storage", function (event) {
    if (event.key === reportStorageKey && document.querySelector(".report-list-panel")) {
        updateReportTable();
        updateReportCounts();
        filterReports();
    }

    if (event.key === reportStorageKey && document.querySelector(".report-review-form")) {
        updateReportDetails();
    }
});

document.addEventListener("DOMContentLoaded", setupProgressReports);
