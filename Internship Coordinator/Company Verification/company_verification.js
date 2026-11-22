document.addEventListener("DOMContentLoaded", function () {

    const decisionKey = "internEaseCompanyVerificationDecisions";
    const settingsKey = "internEaseCoordinatorSettings";

    const companies = {
        "CMP-026": { name: "Brain Station 23 PLC", industry: "Software Development", date: "28 Oct 2026", status: "Pending" },
        "CMP-025": { name: "BJIT Limited", industry: "IT Services", date: "27 Oct 2026", status: "Pending" },
        "CMP-024": { name: "DataSoft Systems Bangladesh Ltd.", industry: "Enterprise Software", date: "26 Oct 2026", status: "Under Review" },
        "CMP-023": { name: "Enosis Solutions", industry: "Software Development", date: "25 Oct 2026", status: "Pending" },
        "CMP-022": { name: "Southtech Limited", industry: "Technology Solutions", date: "24 Oct 2026", status: "Pending" }
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
            alert("The decision could not be saved in this browser.");
            return false;
        }
    }

    function currentStatus(requestId) {
        if (decisions[requestId]) {
            return decisions[requestId].status;
        }
        return companies[requestId].status;
    }

    function setStatus(element, status) {
        if (!element) return;

        element.textContent = status;
        element.className = "status";
        element.style.backgroundColor = "";
        element.style.color = "";

        if (status === "Pending") {
            element.classList.add("status-pending");
        } else if (status === "Under Review") {
            element.classList.add("status-review");
        } else if (status === "Approved") {
            element.classList.add("status-active");
            element.style.backgroundColor = "#dff7e9";
            element.style.color = "#078653";
        } else if (status === "Rejected" || status === "Returned for Correction") {
            element.classList.add("status-revision");
        }
    }

    function getStatusGroup(status) {
        if (status === "Pending") return "pending";
        if (status === "Under Review" || status === "Returned for Correction") return "review";
        if (status === "Approved") return "approved";
        if (status === "Rejected") return "rejected";
        return "";
    }

    function updateSummaryCards() {
        const counts = { pending: 4, approved: 18, review: 1, rejected: 3 };

        Object.keys(decisions).forEach(function (id) {
            if (!companies[id]) return;

            const oldGroup = getStatusGroup(companies[id].status);
            const newGroup = getStatusGroup(decisions[id].status);

            if (oldGroup && counts[oldGroup] > 0) counts[oldGroup]--;
            if (newGroup) counts[newGroup]++;
        });

        const cards = {
            pending: document.querySelector(".summary-card.pending-companies h2"),
            approved: document.querySelector(".summary-card.verified-companies h2"),
            review: document.querySelector(".summary-card.pending-placements h2"),
            rejected: document.querySelector(".summary-card.pending-reports h2")
        };

        Object.keys(cards).forEach(function (key) {
            if (cards[key]) cards[key].textContent = counts[key];
        });
    }

    function setupCompanyList() {
        const table = document.querySelector(".company-list-panel table");
        if (!table) return;

        const rows = table.querySelectorAll("tbody tr");
        const search = document.getElementById("company-search");
        const topSearch = document.querySelector(".topbar-search input");
        const statusFilter = document.getElementById("company-status");
        const industryFilter = document.getElementById("industry-filter");
        const tableBody = table.querySelector("tbody");

        if (statusFilter) {
            const option = document.createElement("option");
            option.value = "Returned for Correction";
            option.textContent = "Returned for Correction";
            statusFilter.appendChild(option);
        }

        rows.forEach(function (row) {
            const id = row.cells[0].textContent.trim();
            setStatus(row.cells[4].querySelector(".status"), currentStatus(id));
        });

        const noResultRow = document.createElement("tr");
        noResultRow.innerHTML = '<td colspan="6" style="text-align:center;padding:20px;color:#8794a6">No matching company requests found.</td>';
        noResultRow.style.display = "none";
        tableBody.appendChild(noResultRow);

        function filterCompanies() {
            const searchText = (search && search.value.trim()) || (topSearch && topSearch.value.trim()) || "";
            const query = searchText.toLowerCase();
            const selectedStatus = statusFilter ? statusFilter.value : "";
            const selectedIndustry = industryFilter ? industryFilter.value : "";
            let visibleRows = 0;

            rows.forEach(function (row) {
                const id = row.cells[0].textContent.trim();
                const status = currentStatus(id);
                const industry = row.cells[2].textContent.trim();
                const matchesSearch = row.textContent.toLowerCase().includes(query);
                const matchesStatus = selectedStatus === "" || status === selectedStatus;
                const matchesIndustry = selectedIndustry === "" || industry === selectedIndustry;
                const showRow = matchesSearch && matchesStatus && matchesIndustry;

                row.style.display = showRow ? "" : "none";
                if (showRow) visibleRows++;
            });

            noResultRow.style.display = visibleRows === 0 ? "" : "none";
        }

        if (search) {
            search.addEventListener("input", function () {
                if (topSearch) topSearch.value = "";
                filterCompanies();
            });
        }

        if (topSearch) {
            topSearch.addEventListener("input", function () {
                if (search) search.value = "";
                filterCompanies();
            });
        }

        if (statusFilter) statusFilter.addEventListener("change", filterCompanies);
        if (industryFilter) industryFilter.addEventListener("change", filterCompanies);

        filterCompanies();
        updateSummaryCards();
    }

    function changeInformation(labelText, value, className) {
        const items = document.querySelectorAll(".company-information-panel .information-item");

        items.forEach(function (item) {
            const label = item.querySelector("span");
            const valueElement = item.querySelector("strong");

            if (label && valueElement && label.textContent.trim() === labelText) {
                valueElement.textContent = value;
                valueElement.className = className || "";
                valueElement.style.color = className === "active-text" ? "#078653" :
                    (className === "pending-text" ? "#a66500" : "");
            }
        });
    }

    function changeSummary(labelText, value, className) {
        const items = document.querySelectorAll(".request-summary-panel .side-information");

        items.forEach(function (item) {
            const label = item.querySelector("span");
            const valueElement = item.querySelector("strong");

            if (label && valueElement && label.textContent.trim() === labelText) {
                valueElement.textContent = value;
                valueElement.className = className || "";
                valueElement.style.color = className === "active-text" ? "#078653" :
                    (className === "pending-text" ? "#a66500" : "");
            }
        });
    }

    function setupCompanyDetails() {
        const overview = document.querySelector(".company-overview");
        if (!overview) return;

        const requestId = new URLSearchParams(window.location.search).get("request_id") || "CMP-026";
        const company = companies[requestId];

        if (!company) {
            overview.style.display = "none";
            const decisionPanel = document.querySelector(".decision-panel");
            if (decisionPanel) decisionPanel.style.display = "none";

            const message = document.createElement("p");
            message.textContent = "This request ID is not available in the sample records.";
            message.style.padding = "15px";
            message.style.backgroundColor = "#fff0c7";
            message.style.color = "#a66500";
            document.querySelector(".main-content").appendChild(message);
            return;
        }

        const status = currentStatus(requestId);

        overview.querySelector(".small-label").textContent = "REQUEST ID: " + requestId;
        overview.querySelector("h2").textContent = company.name;
        overview.querySelector("p").textContent = company.industry;
        setStatus(overview.querySelector(".status"), status);

        changeInformation("Company Name", company.name);
        changeInformation("Request ID", requestId);
        changeInformation("Industry", company.industry);
        changeInformation("Submitted On", company.date);
        changeInformation("Verification Status", status, status === "Approved" ? "active-text" : "pending-text");

        const summaryTitle = document.querySelector(".request-summary-title h3");
        if (summaryTitle) summaryTitle.textContent = company.name;

        changeSummary("Request ID", requestId);
        changeSummary("Submitted On", company.date);
        changeSummary("Industry", company.industry);
        changeSummary("Current Status", status, status === "Approved" ? "active-text" : "pending-text");

        if (requestId !== "CMP-026") {
            const documentPanel = document.querySelector(".document-panel");
            if (documentPanel) {
                documentPanel.querySelectorAll(".document-item").forEach(function (item) {
                    item.remove();
                });

                const count = documentPanel.querySelector(".section-label");
                if (count) count.style.display = "none";

                const note = document.createElement("p");
                note.textContent = "Document files are not included for this company in the uploaded sample data.";
                note.style.fontSize = "12px";
                note.style.color = "#8794a6";
                documentPanel.appendChild(note);
            }
        }

        const remarks = document.getElementById("coordinator-remarks");
        if (remarks && decisions[requestId]) {
            remarks.value = decisions[requestId].remarks || "";
        }

        if (decisions[requestId]) {
            const oldMessage = document.querySelector(".js-decision-message");
            if (oldMessage) oldMessage.remove();

            const message = document.createElement("p");
            message.className = "js-decision-message";
            message.textContent = "Saved browser decision: " + status;
            message.style.marginTop = "14px";
            message.style.padding = "10px 12px";
            message.style.backgroundColor = "#e8f3ff";
            message.style.color = "#1268bd";
            message.style.borderRadius = "5px";
            message.style.fontSize = "12px";
            document.querySelector(".decision-panel").appendChild(message);
        }

        setupDecisionButtons(requestId);
        setupDetailsSearch();
    }

    function setupDetailsSearch() {
        const search = document.querySelector(".topbar-search input");
        const items = document.querySelectorAll(
            ".information-item, .document-item, .side-information, .verification-check-item"
        );

        if (!search || items.length === 0) return;

        search.setAttribute("aria-label", "Search company details");

        search.addEventListener("input", function () {
            const query = search.value.trim().toLowerCase();

            items.forEach(function (item) {
                const matches = item.textContent.toLowerCase().includes(query);
                item.style.display = matches ? "" : "none";
            });
        });
    }

    function setupDecisionButtons(requestId) {
        const form = document.querySelector(".verification-form");
        if (!form) return;

        const remarks = document.getElementById("coordinator-remarks");
        const approveButton = form.querySelector(".button-approve");
        const rejectButton = form.querySelector(".button-reject");
        const returnButton = form.querySelector(".button-return");

        function saveDecision(newStatus) {
            const remarkText = remarks ? remarks.value.trim() : "";

            if (newStatus !== "Approved" && remarkText === "") {
                alert("Please write Coordinator Remarks before rejecting or returning this request.");
                remarks.focus();
                return;
            }

            if (!confirm("Are you sure you want to set this company status to " + newStatus + "?")) {
                return;
            }

            decisions[requestId] = {
                status: newStatus,
                remarks: remarkText
            };

            if (!saveDecisions()) return;

            const overviewStatus = document.querySelector(".company-overview .status");
            setStatus(overviewStatus, newStatus);
            changeInformation("Verification Status", newStatus, newStatus === "Approved" ? "active-text" : "pending-text");
            changeSummary("Current Status", newStatus, newStatus === "Approved" ? "active-text" : "pending-text");

            const message = document.createElement("p");
            message.textContent = "Decision saved in this browser: " + newStatus + ". It has not been sent to a server or database.";
            message.style.marginTop = "14px";
            message.style.padding = "10px 12px";
            message.style.backgroundColor = "#e8f3ff";
            message.style.color = "#1268bd";
            message.style.borderRadius = "5px";
            message.style.fontSize = "12px";

            const oldMessage = document.querySelector(".js-decision-message");
            if (oldMessage) oldMessage.remove();
            message.className = "js-decision-message";
            form.appendChild(message);

            alert("Company status updated to " + newStatus + ". The decision is saved only in this browser.");
        }

        if (approveButton) {
            approveButton.addEventListener("click", function () {
                saveDecision("Approved");
            });
        }

        if (rejectButton) {
            rejectButton.addEventListener("click", function () {
                saveDecision("Rejected");
            });
        }

        if (returnButton) {
            returnButton.addEventListener("click", function () {
                saveDecision("Returned for Correction");
            });
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();
        });
    }

    function setupDropdowns() {
        const dropdowns = document.querySelectorAll(".notification-dropdown, .profile-dropdown");

        dropdowns.forEach(function (dropdown) {
            dropdown.addEventListener("toggle", function () {
                if (dropdown.open) {
                    dropdowns.forEach(function (otherDropdown) {
                        if (otherDropdown !== dropdown) otherDropdown.open = false;
                    });
                }
            });
        });

        document.addEventListener("click", function (event) {
            if (!event.target.closest(".notification-dropdown, .profile-dropdown")) {
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
            settings = JSON.parse(localStorage.getItem(settingsKey)) || {};
        } catch (error) {
            settings = {};
        }

        const name = settings.fullName || "Mohammad Tahmedul Haque Rafid";
        const picture = settings.profilePicture || "";
        const nameElements = document.querySelectorAll(".profile-info strong");
        const avatars = document.querySelectorAll(".profile-avatar");

        nameElements.forEach(function (element) {
            element.textContent = name;
        });

        avatars.forEach(function (avatar) {
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

                for (let i = 0; i < words.length && i < 4; i++) {
                    initials += words[i].charAt(0).toUpperCase();
                }

                avatar.textContent = initials;
            }
        });

        const preferences = settings.notifications || {};
        const notificationItems = document.querySelectorAll(".notification-item");
        let visibleCount = 0;

        notificationItems.forEach(function (item) {
            const icon = item.querySelector(".notification-item-icon");
            let type = "";

            if (icon && icon.classList.contains("notification-blue")) type = "company";
            if (icon && icon.classList.contains("notification-green")) type = "placement";
            if (icon && icon.classList.contains("notification-purple")) type = "report";

            const showItem = !type || preferences[type] !== false;
            item.style.display = showItem ? "" : "none";
            if (showItem) visibleCount++;
        });

        document.querySelectorAll(".notification-count").forEach(function (badge) {
            badge.textContent = visibleCount;
            badge.style.display = visibleCount > 0 ? "" : "none";
        });
    }

    setupProfileAndNotifications();
    setupDropdowns();
    setupCompanyList();
    setupCompanyDetails();

});