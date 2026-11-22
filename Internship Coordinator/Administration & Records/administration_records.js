
var settingsKey = "internEaseCoordinatorSettings";

var companyKey = "internEaseCompanyVerificationDecisions";
var postingKey = "internEaseInternshipPostingDecisions";
var placementKey = "internEasePlacementApprovalDecisions";
var reportKey = "internEaseProgressReportDecisions";
var evaluationKey = "internEaseFinalEvaluationDecisions";

var originalPendingReviews = 17;

function getSavedData(storageKey) {
    var savedData = localStorage.getItem(storageKey);

    if (savedData) {
        try {
            return JSON.parse(savedData);
        } catch (error) {
            return {};
        }
    }

    return {};
}

function getSavedStatus(storageKey, recordId, defaultStatus) {
    var savedData = getSavedData(storageKey);

    if (savedData[recordId] && savedData[recordId].status) {
        return savedData[recordId].status;
    }

    return defaultStatus;
}

function getRecordStatus(recordId) {
    if (recordId.indexOf("CMP-") === 0) {
        return getSavedStatus(companyKey, recordId, "Pending");
    }

    if (recordId.indexOf("INT-") === 0) {
        return getSavedStatus(postingKey, recordId, "Published");
    }

    if (recordId.indexOf("PLA-") === 0) {
        return getSavedStatus(placementKey, recordId, "Pending Review");
    }

    if (recordId.indexOf("PR-") === 0) {
        return getSavedStatus(reportKey, recordId, "Pending Review");
    }

    if (recordId.indexOf("FE-") === 0) {
        return getSavedStatus(evaluationKey, recordId, "Pending Evaluation");
    }

    return "Unknown";
}

function getStatusClass(status) {
    if (
        status === "Approved" ||
        status === "Published" ||
        status === "Completed" ||
        status === "Reviewed" ||
        status === "Active"
    ) {
        return "status-active";
    }

    if (
        status === "Under Review" ||
        status === "Pending Review" ||
        status === "Returned for Review"
    ) {
        return "status-review";
    }

    return "status-pending";
}

function updateStatusElement(element, status) {
    if (!element) {
        return;
    }

    element.textContent = status;

    element.classList.remove(
        "status-active",
        "status-pending",
        "status-review"
    );

    element.classList.add(getStatusClass(status));
}

function updateSystemRecords() {
    var rows = document.querySelectorAll(".records-panel tbody tr");

    rows.forEach(function (row) {
        var idElement = row.querySelector(".record-id");

        if (!idElement) {
            return;
        }

        var recordId = idElement.textContent.trim();
        var statusElement = row.querySelector(".status");

        var currentStatus = getRecordStatus(recordId);

        updateStatusElement(statusElement, currentStatus);
    });
}

function isPendingReview(recordId) {
    var status = getRecordStatus(recordId);

    if (
        status === "Pending" ||
        status === "Pending Review" ||
        status === "Pending Evaluation" ||
        status === "Under Review"
    ) {
        return true;
    }

    return false;
}

function updatePendingReviewCount() {
    var pendingCount = originalPendingReviews;

    var records = [
        {
            id: "CMP-026",
            wasPending: true
        },
        {
            id: "PLA-026",
            wasPending: true
        },
        {
            id: "PR-026",
            wasPending: true
        },
        {
            id: "FE-026",
            wasPending: true
        }
    ];

    records.forEach(function (record) {
        var currentPending = isPendingReview(record.id);

        if (record.wasPending && !currentPending) {
            pendingCount--;
        } else if (!record.wasPending && currentPending) {
            pendingCount++;
        }
    });

    var summaryCards = document.querySelectorAll(
        ".summary-card .summary-info h2"
    );

    if (summaryCards.length >= 4) {
        summaryCards[3].textContent = pendingCount;
    }
}

function updateAccountCounts() {
    var accountRows = document.querySelectorAll(
        ".account-panel tbody tr"
    );

    var totalAccounts = accountRows.length;
    var studentAccounts = 0;

    accountRows.forEach(function (row) {
        var accountType = row.children[1].textContent.trim();

        if (accountType === "Student") {
            studentAccounts++;
        }
    });

    var summaryCards = document.querySelectorAll(
        ".summary-card .summary-info h2"
    );

    if (summaryCards.length >= 3) {
        summaryCards[0].textContent = totalAccounts;
        summaryCards[1].textContent = studentAccounts;
    }

    // Company Records count is an aggregate sample value.
    if (summaryCards.length >= 3) {
        summaryCards[2].textContent = "8";
    }
}

function searchRecords() {
    var searchInput = document.querySelector(".topbar-search input");

    if (!searchInput) {
        return;
    }

    var searchText = searchInput.value.toLowerCase().trim();

    var accountRows = document.querySelectorAll(
        ".account-panel tbody tr"
    );

    var recordRows = document.querySelectorAll(
        ".records-panel tbody tr"
    );

    accountRows.forEach(function (row) {
        var rowText = row.textContent.toLowerCase();

        if (rowText.indexOf(searchText) !== -1) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });

    recordRows.forEach(function (row) {
        var rowText = row.textContent.toLowerCase();

        if (rowText.indexOf(searchText) !== -1) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

function setupSearch() {
    var searchInput = document.querySelector(".topbar-search input");

    if (searchInput) {
        searchInput.addEventListener("input", searchRecords);
    }
}

function updateCoordinatorProfile() {
    var savedSettings = getSavedData(settingsKey);

    var savedName =
        savedSettings.fullName ||
        savedSettings.full_name ||
        savedSettings.name;

    var savedImage =
        savedSettings.profileImage ||
        savedSettings.profile_image ||
        savedSettings.profilePicture ||
        savedSettings.profile_picture;

    if (savedName) {
        var profileName = document.querySelector(".profile-info strong");
        var accessName = document.querySelector(".access-profile strong");

        if (profileName) {
            profileName.textContent = savedName;
        }

        if (accessName) {
            accessName.textContent = savedName;
        }

        var initials = savedName.split(" ").map(function (part) {
            return part.charAt(0);
        }).join("").substring(0, 4).toUpperCase();

        var profileAvatar = document.querySelector(".profile-avatar");
        var accessAvatar = document.querySelector(".access-avatar");

        if (profileAvatar && !savedImage) {
            profileAvatar.textContent = initials;
        }

        if (accessAvatar && !savedImage) {
            accessAvatar.textContent = initials;
        }
    }

    if (savedImage) {
        var avatars = document.querySelectorAll(
            ".profile-avatar, .access-avatar"
        );

        avatars.forEach(function (avatar) {
            avatar.textContent = "";
            avatar.style.backgroundImage = "url('" + savedImage + "')";
            avatar.style.backgroundSize = "cover";
            avatar.style.backgroundPosition = "center";
        });
    }
}

function setupDropdowns() {
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

function setupAdministrationRecords() {
    updateCoordinatorProfile();

    updateSystemRecords();

    updateAccountCounts();

    updatePendingReviewCount();

    setupSearch();

    setupDropdowns();
}

window.addEventListener("storage", function (event) {
    var decisionKeys = [
        companyKey,
        postingKey,
        placementKey,
        reportKey,
        evaluationKey,
        settingsKey
    ];

    if (decisionKeys.indexOf(event.key) !== -1) {
        updateSystemRecords();
        updatePendingReviewCount();
        updateCoordinatorProfile();
    }
});

document.addEventListener(
    "DOMContentLoaded",
    setupAdministrationRecords
);
