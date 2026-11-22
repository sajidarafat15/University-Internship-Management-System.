document.addEventListener("DOMContentLoaded", function () {

    const decisionKey = "internEasePlacementApprovalDecisions";
    const settingsKey = "internEaseCoordinatorSettings";

    const placements = {
        "PLA-026": {
            name: "S.M Tajwar Tahmid",
            studentId: "23-54828-3",
            company: "Kaz Software",
            position: "Software Engineer Intern",
            date: "29 Oct 2026",
            duration: "3 Months",
            postingId: "INT-026",
            supervisor: "Tanvir Ahmed",
            supervisorId: "2601-2632-2",
            hasExtraDetails: true
        },
        "PLA-025": {
            name: "Farhan Sadik Fahim",
            studentId: "23-53663-3",
            company: "Therap (BD) Ltd.",
            position: "QA Engineer Intern",
            date: "28 Oct 2026",
            duration: "",
            postingId: "",
            hasExtraDetails: false
        },
        "PLA-024": {
            name: "MD. Sajid Arafat",
            studentId: "23-53526-3",
            company: "Cefalo Bangladesh",
            position: "Front-End Developer Intern",
            date: "27 Oct 2026",
            duration: "",
            postingId: "",
            hasExtraDetails: false
        }
    };

    let decisions = {};

    try {
        decisions = JSON.parse(localStorage.getItem(decisionKey)) || {};
    } catch (error) {
        decisions = {};
    }

    function saveDecisions() {
        try {
            localStorage.setItem(decisionKey, JSON.stringify(decisions));
            return true;
        } catch (error) {
            alert("Could not save the placement decision in this browser.");
            return false;
        }
    }

    function getStatus(placementId) {
        if (decisions[placementId]) {
            return decisions[placementId].status;
        }

        if (placementId === "PLA-024") {
            return "Needs Correction";
        }

        return "Pending Review";
    }

    function setStatus(element, status) {
        if (!element) return;

        element.textContent = status;
        element.className = "status";

        if (status === "Pending Review") {
            element.classList.add("status-pending");
        } else if (status === "Approved") {
            element.classList.add("status-active");
        } else {
            element.classList.add("status-revision");
        }
    }

    function updateSummary() {
        let total = 0;
        let approved = 0;
        let pending = 0;
        let correction = 0;

        Object.keys(placements).forEach(function (placementId) {
            total++;

            const status = getStatus(placementId);

            if (status === "Approved") {
                approved++;
            } else if (status === "Pending Review") {
                pending++;
            } else if (status === "Needs Correction") {
                correction++;
            }
        });

        const totalCard = document.querySelector(
            ".summary-card.pending-companies .summary-info h2"
        );

        const approvedCard = document.querySelector(
            ".summary-card.verified-companies .summary-info h2"
        );

        const pendingCard = document.querySelector(
            ".summary-card.pending-placements .summary-info h2"
        );

        const correctionCard = document.querySelector(
            ".summary-card.pending-reports .summary-info h2"
        );

        if (totalCard) totalCard.textContent = total;
        if (approvedCard) approvedCard.textContent = approved;
        if (pendingCard) pendingCard.textContent = pending;
        if (correctionCard) correctionCard.textContent = correction;

        const statusItems = document.querySelectorAll(
            ".placement-status-item"
        );

        statusItems.forEach(function (item) {
            const label = item.querySelector("strong");
            const count = item.querySelector(".placement-status-count");

            if (!label || !count) return;

            const name = label.textContent.trim();

            if (name === "Approved") {
                count.textContent = approved;
            } else if (name === "Pending Review") {
                count.textContent = pending;
            } else if (name === "Needs Correction") {
                count.textContent = correction;
            }
        });
    }

    function setupPlacementList() {
        const table = document.querySelector(".placement-panel table");

        if (!table) return;

        const rows = table.querySelectorAll("tbody tr");
        const tableBody = table.querySelector("tbody");

        const searchInput = document.getElementById("placement-search");
        const topSearch = document.querySelector(".topbar-search input");

        const statusFilter = document.getElementById("placement-status");
        const companyFilter = document.getElementById("company-filter");

        rows.forEach(function (row) {
            const placementId = row.cells[0].textContent.trim();

            row.dataset.placementId = placementId;

            setStatus(
                row.cells[6].querySelector(".status"),
                getStatus(placementId)
            );
        });

        const noResultRow = document.createElement("tr");

        noResultRow.innerHTML =
            '<td colspan="8" style="text-align:center;padding:20px;color:#8794a6">No matching placement requests found.</td>';

        noResultRow.style.display = "none";

        tableBody.appendChild(noResultRow);

        function filterPlacements() {
            const query = (
                (searchInput && searchInput.value) ||
                (topSearch && topSearch.value) ||
                ""
            ).trim().toLowerCase();

            const selectedStatus = statusFilter
                ? statusFilter.value
                : "";

            const selectedCompany = companyFilter
                ? companyFilter.value
                : "";

            let visibleCount = 0;

            rows.forEach(function (row) {
                const placementId = row.dataset.placementId;
                const status = getStatus(placementId);
                const company = row.cells[3].textContent.trim();

                const matchesSearch =
                    row.textContent.toLowerCase().includes(query);

                let matchesStatus = true;

                if (selectedStatus === "pending") {
                    matchesStatus = status === "Pending Review";
                } else if (selectedStatus === "approved") {
                    matchesStatus = status === "Approved";
                } else if (selectedStatus === "correction") {
                    matchesStatus = status === "Needs Correction";
                }

                let matchesCompany = true;

                if (selectedCompany === "kaz") {
                    matchesCompany = company === "Kaz Software";
                } else if (selectedCompany === "therap") {
                    matchesCompany = company === "Therap (BD) Ltd.";
                } else if (selectedCompany === "cefalo") {
                    matchesCompany = company === "Cefalo Bangladesh";
                }

                const showRow =
                    matchesSearch && matchesStatus && matchesCompany;

                row.style.display = showRow ? "" : "none";

                if (showRow) visibleCount++;
            });

            noResultRow.style.display =
                visibleCount === 0 ? "" : "none";
        }

        if (searchInput) {
            searchInput.addEventListener("input", function () {
                if (topSearch) topSearch.value = "";
                filterPlacements();
            });
        }

        if (topSearch) {
            topSearch.addEventListener("input", function () {
                if (searchInput) searchInput.value = "";
                filterPlacements();
            });
        }

        if (statusFilter) {
            statusFilter.addEventListener("change", filterPlacements);
        }

        if (companyFilter) {
            companyFilter.addEventListener("change", filterPlacements);
        }

        filterPlacements();
        updateSummary();

        window.addEventListener("pageshow", function () {
            rows.forEach(function (row) {
                const placementId = row.dataset.placementId;

                setStatus(
                    row.cells[6].querySelector(".status"),
                    getStatus(placementId)
                );
            });

            updateSummary();
            filterPlacements();
        });
    }

    function setInformationValue(panel, labelText, value, className) {
        if (!panel) return;

        const items = panel.querySelectorAll(
            ".information-item, .side-information"
        );

        items.forEach(function (item) {
            const label = item.querySelector("span");
            const valueElement = item.querySelector("strong");

            if (
                label &&
                valueElement &&
                label.textContent.trim() === labelText
            ) {
                valueElement.textContent = value;
                valueElement.className = className || "";
            }
        });
    }

    function updatePlacementDetails() {
        const overview = document.querySelector(".placement-overview");

        if (!overview) return;

        const placementId =
            new URLSearchParams(window.location.search).get("placement_id") ||
            "PLA-026";

        const placement = placements[placementId];

        if (!placement) {
            overview.style.display = "none";

            const detailsGrid = document.querySelector(".details-grid");
            const decisionPanel = document.querySelector(".decision-panel");

            if (detailsGrid) detailsGrid.style.display = "none";
            if (decisionPanel) decisionPanel.style.display = "none";

            const message = document.createElement("p");

            message.textContent =
                "This placement ID is not available in the current sample records.";

            message.style.padding = "14px";
            message.style.backgroundColor = "#fff0c7";
            message.style.color = "#a66500";

            document.querySelector(".main-content").appendChild(message);

            return;
        }

        const status = getStatus(placementId);

        const smallLabel = overview.querySelector(".small-label");
        const studentName = overview.querySelector("h2");
        const studentId = overview.querySelector("p");

        if (smallLabel) {
            smallLabel.textContent = "PLACEMENT ID: " + placementId;
        }

        if (studentName) {
            studentName.textContent = placement.name;
        }

        if (studentId) {
            studentId.textContent = placement.studentId;
        }

        setStatus(overview.querySelector(".status"), status);

        const studentPanel = document.querySelector(
            ".student-information-panel"
        );

        const internshipPanel = document.querySelector(
            ".internship-information-panel"
        );

        const summaryPanel = document.querySelector(
            ".placement-summary-panel"
        );

        setInformationValue(
            studentPanel,
            "Student Name",
            placement.name
        );

        setInformationValue(
            studentPanel,
            "Student ID",
            placement.studentId
        );

        setInformationValue(
            studentPanel,
            "Placement ID",
            placementId
        );

        setInformationValue(
            studentPanel,
            "Submission Date",
            placement.date
        );

        setInformationValue(
            internshipPanel,
            "Company Name",
            placement.company
        );

        setInformationValue(
            internshipPanel,
            "Internship Position",
            placement.position
        );

        setInformationValue(
            internshipPanel,
            "Internship Duration",
            placement.duration || "Not provided in the current sample record"
        );

        setInformationValue(
            internshipPanel,
            "Placement Status",
            status,
            status === "Approved" ? "active-text" : "pending-text"
        );

        setInformationValue(
            internshipPanel,
            "Posting ID",
            placement.postingId || "Not provided in the current sample record"
        );

        if (summaryPanel) {
            const summaryName = summaryPanel.querySelector(
                ".placement-summary-title h3"
            );

            const summaryStudentId = summaryPanel.querySelector(
                ".placement-summary-title p"
            );

            if (summaryName) summaryName.textContent = placement.name;

            if (summaryStudentId) {
                summaryStudentId.textContent = placement.studentId;
            }
        }

        setInformationValue(
            summaryPanel,
            "Placement ID",
            placementId
        );

        setInformationValue(
            summaryPanel,
            "Company",
            placement.company
        );

        setInformationValue(
            summaryPanel,
            "Position",
            placement.position
        );

        setInformationValue(
            summaryPanel,
            "Submission Date",
            placement.date
        );

        setInformationValue(
            summaryPanel,
            "Current Status",
            status,
            status === "Approved" ? "active-text" : "pending-text"
        );

        const studentLink = studentPanel
            ? studentPanel.querySelector(".profile-link")
            : null;

        if (studentLink) {
            studentLink.href =
                "../Students/student_details.html?student_id=" +
                encodeURIComponent(placement.studentId);
        }

        const postingLink = internshipPanel
            ? internshipPanel.querySelector(".profile-link")
            : null;

        if (postingLink) {
            if (placement.postingId) {
                postingLink.href =
                    "../Internship%20Postings/posting_details.html?posting_id=" +
                    encodeURIComponent(placement.postingId);

                postingLink.style.display = "";
            } else {
                postingLink.style.display = "none";
            }
        }

        const documentsPanel = document.querySelector(".documents-panel");
        const supervisorPanel = document.querySelector(
            ".supervisor-information-panel"
        );

        if (documentsPanel) {
            documentsPanel.style.display =
                placement.hasExtraDetails ? "" : "none";
        }

        if (supervisorPanel) {
            supervisorPanel.style.display =
                placement.hasExtraDetails ? "" : "none";
        }

        if (placement.hasExtraDetails) {
            const supervisorName = supervisorPanel.querySelector(
                ".supervisor-profile strong"
            );

            const supervisorId = supervisorPanel.querySelector(
                ".supervisor-profile span"
            );

            if (supervisorName) {
                supervisorName.textContent = placement.supervisor;
            }

            if (supervisorId) {
                supervisorId.textContent =
                    "Supervisor ID: " + placement.supervisorId;
            }

            setInformationValue(
                supervisorPanel,
                "Supervisor Name",
                placement.supervisor
            );

            setInformationValue(
                supervisorPanel,
                "Supervisor ID",
                placement.supervisorId
            );
        }

        const savedDecision = decisions[placementId];
        const remarks = document.getElementById("coordinator-remarks");

        if (savedDecision && remarks) {
            remarks.value = savedDecision.remarks || "";
        }

        if (savedDecision) {
            showDecisionMessage(
                "Saved browser decision: " + status +
                ". This decision is stored only in this browser."
            );
        }

        setupDecisionButtons(placementId);
        setupDetailsSearch();
    }

    function showDecisionMessage(message) {
        const form = document.querySelector(".placement-review-form");

        if (!form) return;

        let messageBox = form.querySelector(".js-placement-message");

        if (!messageBox) {
            messageBox = document.createElement("p");
            messageBox.className = "js-placement-message";

            messageBox.style.margin = "12px 0 0";
            messageBox.style.padding = "10px 12px";
            messageBox.style.backgroundColor = "#e8f3ff";
            messageBox.style.color = "#1268bd";
            messageBox.style.borderRadius = "5px";
            messageBox.style.fontSize = "12px";

            form.appendChild(messageBox);
        }

        messageBox.textContent = message;
    }

    function setupDecisionButtons(placementId) {
        const form = document.querySelector(".placement-review-form");

        if (!form) return;

        const remarks = document.getElementById("coordinator-remarks");

        const approveButton = form.querySelector(".button-approve");
        const returnButton = form.querySelector(".button-return");

        function saveDecision(newStatus) {
            const remarkText = remarks ? remarks.value.trim() : "";

            if (newStatus === "Needs Correction" && remarkText === "") {
                alert(
                    "Please write Coordinator Remarks before returning this placement."
                );

                if (remarks) remarks.focus();

                return;
            }

            const confirmed = confirm(
                "Are you sure you want to set this placement status to " +
                newStatus +
                "?"
            );

            if (!confirmed) return;

            decisions[placementId] = {
                status: newStatus,
                remarks: remarkText
            };

            if (!saveDecisions()) return;

            const overview = document.querySelector(".placement-overview");

            setStatus(
                overview ? overview.querySelector(".status") : null,
                newStatus
            );

            setInformationValue(
                document.querySelector(".internship-information-panel"),
                "Placement Status",
                newStatus,
                newStatus === "Approved" ? "active-text" : "pending-text"
            );

            setInformationValue(
                document.querySelector(".placement-summary-panel"),
                "Current Status",
                newStatus,
                newStatus === "Approved" ? "active-text" : "pending-text"
            );

            updateSummary();

            showDecisionMessage(
                "Placement status updated to " + newStatus +
                ". It is saved only in this browser and has not been sent to a server or database."
            );

            alert(
                "Placement status updated to " + newStatus +
                ". The decision is saved only in this browser."
            );
        }

        if (approveButton) {
            approveButton.addEventListener("click", function () {
                saveDecision("Approved");
            });
        }

        if (returnButton) {
            returnButton.addEventListener("click", function () {
                saveDecision("Needs Correction");
            });
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();
        });
    }

    function setupDetailsSearch() {
        const search = document.querySelector(".topbar-search input");

        if (!search) return;

        const items = document.querySelectorAll(
            ".information-item, .side-information"
        );

        search.setAttribute(
            "aria-label",
            "Search placement details"
        );

        search.addEventListener("input", function () {
            const query = search.value.trim().toLowerCase();

            items.forEach(function (item) {
                const matches =
                    item.textContent.toLowerCase().includes(query);

                item.style.display = matches ? "" : "none";
            });
        });
    }

    function setupDropdowns() {
        const dropdowns = document.querySelectorAll(
            ".notification-dropdown, .profile-dropdown"
        );

        dropdowns.forEach(function (dropdown) {
            dropdown.addEventListener("toggle", function () {
                if (dropdown.open) {
                    dropdowns.forEach(function (otherDropdown) {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.open = false;
                        }
                    });
                }
            });
        });

        document.addEventListener("click", function (event) {
            if (
                !event.target.closest(
                    ".notification-dropdown, .profile-dropdown"
                )
            ) {
                dropdowns.forEach(function (dropdown) {
                    dropdown.open = false;
                });
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                dropdowns.forEach(function (dropdown) {
                    dropdown.open = false;
                });
            }
        });
    }

    function setupProfileAndNotifications() {
        let settings = {};

        try {
            settings =
                JSON.parse(localStorage.getItem(settingsKey)) || {};
        } catch (error) {
            settings = {};
        }

        const name =
            settings.fullName || "Mohammad Tahmedul Haque Rafid";

        const picture = settings.profilePicture || "";

        document.querySelectorAll(".profile-info strong").forEach(
            function (element) {
                element.textContent = name;
            }
        );

        document.querySelectorAll(".profile-avatar").forEach(
            function (avatar) {
                avatar.textContent = "";

                if (picture) {
                    const image = document.createElement("img");

                    image.src = picture;
                    image.alt = "Profile Picture";
                    image.style.width = "100%";
                    image.style.height = "100%";
                    image.style.objectFit = "cover";
                    image.style.borderRadius = "50%";

                    avatar.appendChild(image);
                } else {
                    const words = name.trim().split(/\s+/);
                    let initials = "";

                    for (
                        let i = 0;
                        i < words.length && i < 4;
                        i++
                    ) {
                        initials += words[i].charAt(0).toUpperCase();
                    }

                    avatar.textContent = initials;
                }
            }
        );

        const preferences = settings.notifications || {};

        const items = document.querySelectorAll(".notification-item");

        let visibleCount = 0;

        items.forEach(function (item) {
            const icon = item.querySelector(
                ".notification-item-icon"
            );

            let type = "";

            if (
                icon &&
                icon.classList.contains("notification-blue")
            ) {
                type = "company";
            }

            if (
                icon &&
                icon.classList.contains("notification-green")
            ) {
                type = "placement";
            }

            if (
                icon &&
                icon.classList.contains("notification-purple")
            ) {
                type = "report";
            }

            const showItem =
                !type || preferences[type] !== false;

            item.style.display = showItem ? "" : "none";

            if (showItem) visibleCount++;
        });

        document.querySelectorAll(".notification-count").forEach(
            function (badge) {
                badge.textContent = visibleCount;
                badge.style.display =
                    visibleCount > 0 ? "" : "none";
            }
        );
    }

    setupProfileAndNotifications();
    setupDropdowns();
    setupPlacementList();
    updatePlacementDetails();

});