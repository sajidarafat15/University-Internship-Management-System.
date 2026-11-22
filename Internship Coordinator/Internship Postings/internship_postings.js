document.addEventListener("DOMContentLoaded", function () {

    const decisionKey = "internEaseInternshipPostingDecisions";
    const settingsKey = "internEaseCoordinatorSettings";

    const postings = {
        "INT-026": {
            title: "Software Engineer Intern",
            company: "Kaz Software",
            vacancies: "3",
            deadline: "15 Nov 2026",
            status: "Published",
            category: "Software Development",
            type: "Full-time Internship",
            duration: "3 Months",
            publishedOn: "26 Oct 2026",
            verification: "Verified",
            hasFullDetails: true
        },
        "INT-025": {
            title: "QA Engineer Intern",
            company: "Therap (BD) Ltd.",
            vacancies: "2",
            deadline: "12 Nov 2026",
            status: "Published",
            hasFullDetails: false
        },
        "INT-024": {
            title: "Front-End Developer Intern",
            company: "Cefalo Bangladesh",
            vacancies: "2",
            deadline: "10 Nov 2026",
            status: "Pending Review",
            hasFullDetails: false
        },
        "INT-023": {
            title: "Software Developer Intern",
            company: "Kaz Software",
            vacancies: "2",
            deadline: "05 Nov 2026",
            status: "Published",
            hasFullDetails: false
        },
        "INT-022": {
            title: "QA Intern",
            company: "Therap (BD) Ltd.",
            vacancies: "2",
            deadline: "01 Nov 2026",
            status: "Closed",
            hasFullDetails: false
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
            alert("Could not save the posting decision in this browser.");
            return false;
        }
    }

    function currentStatus(postingId) {
        if (decisions[postingId]) {
            return decisions[postingId].status;
        }

        return postings[postingId].status;
    }

    function statusGroup(status) {
        if (status === "Published") return "published";

        if (
            status === "Pending Review" ||
            status === "Returned for Correction"
        ) {
            return "pending";
        }

        if (status === "Closed" || status === "Rejected") {
            return "closed";
        }

        return "";
    }

    function setStatus(element, status) {
        if (!element) return;

        element.textContent = status;
        element.className = "status";

        if (status === "Published") {
            element.classList.add("status-active");
        } else if (status === "Pending Review") {
            element.classList.add("status-pending");
        } else if (status === "Closed") {
            element.classList.add("status-closed");
        } else {
            element.classList.add("status-revision");
        }
    }

    function updateSummaryCards() {
        const counts = {
            total: 12,
            published: 8,
            pending: 2,
            closed: 2
        };

        Object.keys(decisions).forEach(function (postingId) {
            if (!postings[postingId]) return;

            const oldGroup = statusGroup(postings[postingId].status);
            const newGroup = statusGroup(decisions[postingId].status);

            if (oldGroup && counts[oldGroup] > 0) {
                counts[oldGroup]--;
            }

            if (newGroup) {
                counts[newGroup]++;
            }
        });

        const total = document.querySelector(
            ".summary-card.pending-companies h2"
        );

        const published = document.querySelector(
            ".summary-card.verified-companies h2"
        );

        const pending = document.querySelector(
            ".summary-card.pending-placements h2"
        );

        const closed = document.querySelector(
            ".summary-card.pending-reports h2"
        );

        if (total) total.textContent = counts.total;
        if (published) published.textContent = counts.published;
        if (pending) pending.textContent = counts.pending;
        if (closed) closed.textContent = counts.closed;

        const statusCounts = document.querySelectorAll(
            ".posting-status-item"
        );

        statusCounts.forEach(function (item) {
            const label = item.querySelector("strong");
            const count = item.querySelector(".posting-status-count");

            if (!label || !count) return;

            const name = label.textContent.trim();

            if (name === "Published") {
                count.textContent = counts.published;
            }

            if (name === "Pending Review") {
                count.textContent = counts.pending;
            }

            if (name === "Closed") {
                count.textContent = counts.closed;
            }
        });
    }

    function addStatusOptions() {
        const statusFilter = document.getElementById("posting-status");

        if (!statusFilter) return;

        const options = [
            {
                value: "returned",
                text: "Returned for Correction"
            },
            {
                value: "rejected",
                text: "Rejected"
            }
        ];

        options.forEach(function (item) {
            const option = document.createElement("option");

            option.value = item.value;
            option.textContent = item.text;

            statusFilter.appendChild(option);
        });
    }

    function setupPostingList() {
        const table = document.querySelector(".posting-panel table");

        if (!table) return;

        const rows = table.querySelectorAll("tbody tr");

        const searchInput = document.getElementById("posting-search");
        const topSearch = document.querySelector(
            ".topbar-search input"
        );

        const statusFilter = document.getElementById("posting-status");
        const companyFilter = document.getElementById("company-filter");

        const tableBody = table.querySelector("tbody");

        addStatusOptions();

        rows.forEach(function (row) {
            const postingId = row.cells[0].textContent.trim();

            row.dataset.postingId = postingId;

            setStatus(
                row.cells[5].querySelector(".status"),
                currentStatus(postingId)
            );
        });

        const noResultRow = document.createElement("tr");

        noResultRow.innerHTML =
            '<td colspan="7" style="text-align:center;padding:20px;color:#8794a6">No matching internship postings found.</td>';

        noResultRow.style.display = "none";

        tableBody.appendChild(noResultRow);

        function filterPostings() {
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

            let visibleRows = 0;

            rows.forEach(function (row) {
                const postingId = row.dataset.postingId;
                const status = currentStatus(postingId);
                const posting = postings[postingId];
                const company = posting.company;

                const rowText = row.textContent.toLowerCase();

                const matchesSearch =
                    query === "" || rowText.includes(query);

                const matchesStatus =
                    selectedStatus === "" ||
                    (selectedStatus === "published" &&
                        status === "Published") ||
                    (selectedStatus === "pending" &&
                        status === "Pending Review") ||
                    (selectedStatus === "closed" &&
                        status === "Closed") ||
                    (selectedStatus === "returned" &&
                        status === "Returned for Correction") ||
                    (selectedStatus === "rejected" &&
                        status === "Rejected");

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

                if (showRow) visibleRows++;
            });

            noResultRow.style.display =
                visibleRows === 0 ? "" : "none";
        }

        if (searchInput) {
            searchInput.addEventListener("input", function () {
                if (topSearch) topSearch.value = "";

                filterPostings();
            });
        }

        if (topSearch) {
            topSearch.addEventListener("input", function () {
                if (searchInput) searchInput.value = "";

                filterPostings();
            });
        }

        if (statusFilter) {
            statusFilter.addEventListener("change", filterPostings);
        }

        if (companyFilter) {
            companyFilter.addEventListener("change", filterPostings);
        }

        filterPostings();
        updateSummaryCards();

        window.addEventListener("pageshow", function () {
            rows.forEach(function (row) {
                const postingId = row.dataset.postingId;

                setStatus(
                    row.cells[5].querySelector(".status"),
                    currentStatus(postingId)
                );
            });

            updateSummaryCards();
            filterPostings();
        });
    }

    function setInformationValue(
        panel,
        labelText,
        value,
        className
    ) {
        if (!panel) return;

        const items = panel.querySelectorAll(
            ".information-item, .side-information, .summary-detail-item"
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

    function showDecisionMessage(message, color) {
        const form = document.querySelector(".posting-review-form");

        if (!form) return;

        let messageBox = form.querySelector(".js-posting-message");

        if (!messageBox) {
            messageBox = document.createElement("p");
            messageBox.className = "js-posting-message";

            messageBox.style.margin = "12px 0 0";
            messageBox.style.padding = "10px 12px";
            messageBox.style.borderRadius = "5px";
            messageBox.style.fontSize = "12px";

            form.appendChild(messageBox);
        }

        messageBox.textContent = message;

        messageBox.style.backgroundColor =
            color === "success" ? "#e5f8ef" : "#fff0c7";

        messageBox.style.color =
            color === "success" ? "#078653" : "#a66500";
    }

    function setupPostingDetails() {
        const overview = document.querySelector(".posting-overview");

        if (!overview) return;

        const postingId =
            new URLSearchParams(window.location.search).get("posting_id") ||
            "INT-026";

        const posting = postings[postingId];

        if (!posting) {
            overview.style.display = "none";

            const grid = document.querySelector(".details-grid");
            const reviewPanel = document.querySelector(
                ".posting-review-panel"
            );

            if (grid) grid.style.display = "none";

            if (reviewPanel) reviewPanel.style.display = "none";

            const message = document.createElement("p");

            message.textContent =
                "This posting ID is not available in the current sample records.";

            message.style.padding = "14px";
            message.style.backgroundColor = "#fff0c7";
            message.style.color = "#a66500";

            document.querySelector(".main-content").appendChild(message);

            return;
        }

        const status = currentStatus(postingId);

        const overviewLeft = overview.querySelector(
            ".posting-overview-left"
        );

        if (overviewLeft) {
            const smallLabel = overviewLeft.querySelector(".small-label");
            const title = overviewLeft.querySelector("h2");
            const companyName = overviewLeft.querySelector("p");

            if (smallLabel) {
                smallLabel.textContent = "POSTING ID: " + postingId;
            }

            if (title) {
                title.textContent = posting.title;
            }

            if (companyName) {
                companyName.textContent = posting.company;
            }
        }

        setStatus(overview.querySelector(".status"), status);

        const informationPanel = document.querySelector(
            ".posting-information-panel"
        );

        const companyPanel = document.querySelector(
            ".company-summary-panel"
        );

        const summaryPanel = document.querySelector(
            ".posting-summary-panel"
        );

        setInformationValue(
            informationPanel,
            "Posting ID",
            postingId
        );

        setInformationValue(
            informationPanel,
            "Position Title",
            posting.title
        );

        setInformationValue(
            informationPanel,
            "Company Name",
            posting.company
        );

        setInformationValue(
            informationPanel,
            "Number of Vacancies",
            posting.vacancies
        );

        setInformationValue(
            informationPanel,
            "Application Deadline",
            posting.deadline
        );

        setInformationValue(
            informationPanel,
            "Posting Status",
            status,
            status === "Published" ? "active-text" : "pending-text"
        );

        setInformationValue(
            companyPanel,
            "Company Name",
            posting.company
        );

        setInformationValue(
            companyPanel,
            "Posting Status",
            status,
            status === "Published" ? "active-text" : "pending-text"
        );

        setInformationValue(
            summaryPanel,
            "Posting ID",
            postingId
        );

        setInformationValue(
            summaryPanel,
            "Vacancies",
            posting.vacancies + " Positions"
        );

        setInformationValue(
            summaryPanel,
            "Deadline",
            posting.deadline
        );

        setInformationValue(
            summaryPanel,
            "Current Status",
            status,
            status === "Published" ? "active-text" : "pending-text"
        );

        if (posting.hasFullDetails) {
            setInformationValue(
                informationPanel,
                "Job Category",
                posting.category
            );

            setInformationValue(
                informationPanel,
                "Internship Type",
                posting.type
            );

            setInformationValue(
                informationPanel,
                "Internship Duration",
                posting.duration
            );

            setInformationValue(
                informationPanel,
                "Published On",
                posting.publishedOn
            );

            setInformationValue(
                companyPanel,
                "Industry",
                posting.category
            );

            setInformationValue(
                companyPanel,
                "Verification Status",
                posting.verification,
                "active-text"
            );

            const companyTitle = companyPanel.querySelector(
                ".company-profile h3"
            );

            const companyIndustry = companyPanel.querySelector(
                ".company-profile p"
            );

            if (companyTitle) {
                companyTitle.textContent = posting.company;
            }

            if (companyIndustry) {
                companyIndustry.textContent = posting.category;
            }

        } else {
            const unavailable =
                "Not provided in the current sample record";

            setInformationValue(
                informationPanel,
                "Job Category",
                unavailable
            );

            setInformationValue(
                informationPanel,
                "Internship Type",
                unavailable
            );

            setInformationValue(
                informationPanel,
                "Internship Duration",
                unavailable
            );

            setInformationValue(
                informationPanel,
                "Published On",
                unavailable
            );

            setInformationValue(
                companyPanel,
                "Industry",
                unavailable
            );

            setInformationValue(
                companyPanel,
                "Verification Status",
                unavailable
            );

            const companyTitle = companyPanel.querySelector(
                ".company-profile h3"
            );

            const companyIndustry = companyPanel.querySelector(
                ".company-profile p"
            );

            if (companyTitle) {
                companyTitle.textContent = posting.company;
            }

            if (companyIndustry) {
                companyIndustry.textContent = unavailable;
            }

            const verificationLink = companyPanel.querySelector(
                ".company-link"
            );

            if (verificationLink) {
                verificationLink.style.display = "none";
            }

            const detailPanels = [
                document.querySelector(".description-panel"),
                document.querySelector(".responsibilities-panel"),
                document.querySelector(".eligibility-panel"),
                document.querySelector(".skills-panel")
            ];

            detailPanels.forEach(function (panel) {
                if (panel) panel.style.display = "none";
            });

            const note = document.createElement("p");

            note.textContent =
                "Detailed description, responsibilities, eligibility and required skills are not included in the current sample record. Only the posting information available in the list is shown.";

            note.style.margin = "14px 0 0";
            note.style.padding = "12px";
            note.style.backgroundColor = "#f0f4f8";
            note.style.color = "#64748b";
            note.style.borderRadius = "5px";
            note.style.fontSize = "12px";

            informationPanel.appendChild(note);
        }

        const savedDecision = decisions[postingId];
        const remarks = document.getElementById("posting-remarks");

        if (savedDecision && remarks) {
            remarks.value = savedDecision.remarks || "";
        }

        setupPostingDecisionButtons(postingId);
        setupPostingDetailsSearch();
    }

    function setupPostingDecisionButtons(postingId) {
        const form = document.querySelector(".posting-review-form");

        if (!form) return;

        const remarks = document.getElementById("posting-remarks");

        const approveButton = form.querySelector(".button-approve");
        const returnButton = form.querySelector(".button-return");
        const rejectButton = form.querySelector(".button-reject");

        const savedDecision = decisions[postingId];

        if (savedDecision) {
            showDecisionMessage(
                "Saved browser decision: " +
                savedDecision.status +
                ". This decision is stored only in this browser.",
                "success"
            );
        }

        function saveDecision(newStatus) {
            const remarkText = remarks ? remarks.value.trim() : "";

            if (newStatus !== "Published" && remarkText === "") {
                alert(
                    "Please write Coordinator Remarks before returning or rejecting this posting."
                );

                if (remarks) remarks.focus();

                return;
            }

            if (
                !confirm(
                    "Are you sure you want to set this posting status to " +
                    newStatus +
                    "?"
                )
            ) {
                return;
            }

            decisions[postingId] = {
                status: newStatus,
                remarks: remarkText
            };

            if (!saveDecisions()) return;

            const overviewStatus = document.querySelector(
                ".posting-overview .status"
            );

            setStatus(overviewStatus, newStatus);

            setInformationValue(
                document.querySelector(".posting-information-panel"),
                "Posting Status",
                newStatus,
                newStatus === "Published" ? "active-text" : "pending-text"
            );

            setInformationValue(
                document.querySelector(".company-summary-panel"),
                "Posting Status",
                newStatus,
                newStatus === "Published" ? "active-text" : "pending-text"
            );

            setInformationValue(
                document.querySelector(".posting-summary-panel"),
                "Current Status",
                newStatus,
                newStatus === "Published" ? "active-text" : "pending-text"
            );

            showDecisionMessage(
                "Posting status updated to " +
                newStatus +
                ". It is saved only in this browser and has not been sent to a server or database.",
                "success"
            );

            alert(
                "Posting status updated to " +
                newStatus +
                ". The decision is saved only in this browser."
            );
        }

        if (approveButton) {
            approveButton.addEventListener("click", function () {
                saveDecision("Published");
            });
        }

        if (returnButton) {
            returnButton.addEventListener("click", function () {
                saveDecision("Returned for Correction");
            });
        }

        if (rejectButton) {
            rejectButton.addEventListener("click", function () {
                saveDecision("Rejected");
            });
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();
        });
    }

    function setupPostingDetailsSearch() {
        const search = document.querySelector(
            ".topbar-search input"
        );

        if (!search) return;

        const searchableItems = document.querySelectorAll(
            ".information-item, .side-information, .summary-detail-item, .details-list li, .skill-list span"
        );

        search.setAttribute(
            "aria-label",
            "Search current posting details"
        );

        search.addEventListener("input", function () {
            const query = search.value.trim().toLowerCase();

            searchableItems.forEach(function (item) {
                item.style.display =
                    item.textContent.toLowerCase().includes(query)
                        ? ""
                        : "none";
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
    setupPostingList();
    setupPostingDetails();

});