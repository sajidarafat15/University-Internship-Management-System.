document.addEventListener("DOMContentLoaded", function () {

    const placementKey = "internEasePlacementApprovalDecisions";
    const settingsKey = "internEaseCoordinatorSettings";

    const students = {
        "23-54828-3": {
            name: "S.M Tajwar Tahmid",
            company: "Kaz Software",
            position: "Software Engineer Intern",
            placementId: "PLA-026",
            submissionDate: "29 Oct 2026",
            semester: "10th Semester",
            completedSemesters: "9",
            cgpa: "3.50",
            eligibility: "Submitted for Review",
            duration: "3 Months",
            postingId: "INT-026",
            supervisor: "Tanvir Ahmed",
            supervisorId: "2601-2632-2",
            designation: "Senior Software Engineer",
            hasAcademicInfo: true,
            hasSupervisorInfo: true
        },

        "23-53663-3": {
            name: "Farhan Sadik Fahim",
            company: "Therap (BD) Ltd.",
            position: "QA Engineer Intern",
            placementId: "PLA-025",
            submissionDate: "Not provided in sample record",
            semester: "",
            completedSemesters: "",
            cgpa: "",
            eligibility: "",
            duration: "",
            postingId: "",
            supervisor: "",
            supervisorId: "",
            designation: "",
            hasAcademicInfo: false,
            hasSupervisorInfo: false
        },

        "23-53526-3": {
            name: "MD. Sajid Arafat",
            company: "Cefalo Bangladesh",
            position: "Front-End Developer Intern",
            placementId: "PLA-024",
            submissionDate: "Not provided in sample record",
            semester: "",
            completedSemesters: "",
            cgpa: "",
            eligibility: "",
            duration: "",
            postingId: "",
            supervisor: "",
            supervisorId: "",
            designation: "",
            hasAcademicInfo: false,
            hasSupervisorInfo: false
        }
    };

    let placementDecisions = {};

    function loadPlacementDecisions() {
        try {
            placementDecisions =
                JSON.parse(localStorage.getItem(placementKey)) || {};
        } catch (error) {
            placementDecisions = {};
        }
    }

    function getPlacementStatus(studentId) {
        const student = students[studentId];

        if (!student) return "Not Available";

        const savedDecision =
            placementDecisions[student.placementId];

        if (savedDecision && savedDecision.status) {
            return savedDecision.status;
        }

        if (studentId === "23-53526-3") {
            return "Needs Correction";
        }

        return "Pending Review";
    }

    function setStatus(element, status) {
        if (!element) return;

        element.textContent = status;
        element.className = "status";

        if (status === "Approved") {
            element.classList.add("status-active");
        } else if (status === "Pending Review") {
            element.classList.add("status-pending");
        } else {
            element.classList.add("status-revision");
        }
    }

    function updateSummary() {
        let totalStudents = 0;
        let totalPlacements = 0;
        let pending = 0;
        let correction = 0;
        let approved = 0;

        Object.keys(students).forEach(function (studentId) {
            totalStudents++;

            const status = getPlacementStatus(studentId);

            if (status === "Approved") {
                approved++;
            } else if (status === "Pending Review") {
                pending++;
            } else if (status === "Needs Correction") {
                correction++;
            } else {
                pending++;
            }
        });

        totalPlacements = totalStudents;

        const totalCard = document.querySelector(
            ".summary-card.pending-companies h2"
        );

        const placementCard = document.querySelector(
            ".summary-card.verified-companies h2"
        );

        const pendingCard = document.querySelector(
            ".summary-card.pending-placements h2"
        );

        const correctionCard = document.querySelector(
            ".summary-card.pending-reports h2"
        );

        if (totalCard) {
            totalCard.textContent = totalStudents;
        }

        if (placementCard) {
            placementCard.textContent = totalPlacements;
        }

        if (pendingCard) {
            pendingCard.textContent = pending;
        }

        if (correctionCard) {
            correctionCard.textContent = correction;
        }

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

    function setupStudentList() {
        const table = document.querySelector(
            ".student-list-panel table"
        );

        if (!table) return;

        const rows = table.querySelectorAll("tbody tr");
        const tableBody = table.querySelector("tbody");

        const searchInput = document.getElementById("student-search");
        const topSearch = document.querySelector(
            ".topbar-search input"
        );

        const statusFilter = document.getElementById("placement-status");
        const companyFilter = document.getElementById("company-filter");

        rows.forEach(function (row) {
            const studentId = row.cells[1].textContent.trim();

            row.dataset.studentId = studentId;

            setStatus(
                row.cells[5].querySelector(".status"),
                getPlacementStatus(studentId)
            );
        });

        const noResultRow = document.createElement("tr");

        noResultRow.innerHTML =
            '<td colspan="7" style="text-align:center;padding:20px;color:#8794a6">No matching student records found.</td>';

        noResultRow.style.display = "none";

        tableBody.appendChild(noResultRow);

        function filterStudents() {
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
                const studentId = row.dataset.studentId;
                const student = students[studentId];

                const status = getPlacementStatus(studentId);

                const rowText = row.textContent.toLowerCase();

                const matchesSearch =
                    rowText.includes(query);

                let matchesStatus = true;

                if (selectedStatus === "pending") {
                    matchesStatus = status === "Pending Review";
                } else if (selectedStatus === "correction") {
                    matchesStatus = status === "Needs Correction";
                } else if (selectedStatus === "approved") {
                    matchesStatus = status === "Approved";
                }

                let matchesCompany = true;

                if (selectedCompany === "kaz") {
                    matchesCompany =
                        student.company === "Kaz Software";
                } else if (selectedCompany === "therap") {
                    matchesCompany =
                        student.company === "Therap (BD) Ltd.";
                } else if (selectedCompany === "cefalo") {
                    matchesCompany =
                        student.company === "Cefalo Bangladesh";
                }

                const showRow =
                    matchesSearch &&
                    matchesStatus &&
                    matchesCompany;

                row.style.display = showRow ? "" : "none";

                if (showRow) visibleCount++;
            });

            noResultRow.style.display =
                visibleCount === 0 ? "" : "none";
        }

        if (searchInput) {
            searchInput.addEventListener("input", function () {
                if (topSearch) topSearch.value = "";
                filterStudents();
            });
        }

        if (topSearch) {
            topSearch.addEventListener("input", function () {
                if (searchInput) searchInput.value = "";
                filterStudents();
            });
        }

        if (statusFilter) {
            statusFilter.addEventListener("change", filterStudents);
        }

        if (companyFilter) {
            companyFilter.addEventListener("change", filterStudents);
        }

        filterStudents();
        updateSummary();

        window.addEventListener("pageshow", function () {
            loadPlacementDecisions();

            rows.forEach(function (row) {
                const studentId = row.dataset.studentId;

                setStatus(
                    row.cells[5].querySelector(".status"),
                    getPlacementStatus(studentId)
                );
            });

            updateSummary();
            filterStudents();
        });
    }

    function setInformationValue(panel, labelText, value, className) {
        if (!panel) return;

        const items = panel.querySelectorAll(".information-item");

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

    function setSideInformation(panel, labelText, value, className) {
        if (!panel) return;

        const items = panel.querySelectorAll(".side-information");

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

    function updateStudentDetails() {
        const detailsGrid = document.querySelector(".details-grid");

        if (!detailsGrid) return;

        const studentId =
            new URLSearchParams(window.location.search).get("student_id") ||
            "23-54828-3";

        const student = students[studentId];

        if (!student) {
            detailsGrid.style.display = "none";

            const message = document.createElement("p");

            message.textContent =
                "This student ID is not available in the current sample records.";

            message.style.padding = "14px";
            message.style.backgroundColor = "#fff0c7";
            message.style.color = "#a66500";

            document.querySelector(".main-content").appendChild(message);

            const backArea = document.querySelector(".bottom-back-area");

            if (backArea) backArea.style.display = "flex";

            return;
        }

        const status = getPlacementStatus(studentId);

        const studentPanel = document.querySelector(
            ".student-information-panel"
        );

        const academicPanel = document.querySelector(
            ".academic-information-panel"
        );

        const internshipPanel = document.querySelector(
            ".internship-information-panel"
        );

        const supervisorPanel = document.querySelector(
            ".supervisor-information-panel"
        );

        const statusPanel = document.querySelector(
            ".placement-status-panel"
        );

        setInformationValue(
            studentPanel,
            "Student Name",
            student.name
        );

        setInformationValue(
            studentPanel,
            "Student ID",
            studentId
        );

        setInformationValue(
            studentPanel,
            "Placement ID",
            student.placementId
        );

        setInformationValue(
            studentPanel,
            "Submission Date",
            student.submissionDate
        );

        const placementLink = studentPanel
            ? studentPanel.querySelector(".profile-link")
            : null;

        if (placementLink) {
            placementLink.href =
                "../Placement%20Approval/placement_details.html?placement_id=" +
                encodeURIComponent(student.placementId);
        }

        if (academicPanel) {
            academicPanel.style.display =
                student.hasAcademicInfo ? "" : "none";
        }

        if (student.hasAcademicInfo) {
            setInformationValue(
                academicPanel,
                "Current Semester",
                student.semester
            );

            setInformationValue(
                academicPanel,
                "Completed Semesters",
                student.completedSemesters
            );

            setInformationValue(
                academicPanel,
                "CGPA",
                student.cgpa
            );

            setInformationValue(
                academicPanel,
                "Academic Eligibility",
                student.eligibility
            );
        }

        setInformationValue(
            internshipPanel,
            "Company Name",
            student.company
        );

        setInformationValue(
            internshipPanel,
            "Internship Position",
            student.position
        );

        setInformationValue(
            internshipPanel,
            "Internship Duration",
            student.duration || "Not provided in sample record"
        );

        setInformationValue(
            internshipPanel,
            "Placement ID",
            student.placementId
        );

        setInformationValue(
            internshipPanel,
            "Posting ID",
            student.postingId || "Not provided in sample record"
        );

        const postingLink = internshipPanel
            ? internshipPanel.querySelector(".profile-link")
            : null;

        if (postingLink) {
            if (student.postingId) {
                postingLink.href =
                    "../Internship%20Postings/posting_details.html?posting_id=" +
                    encodeURIComponent(student.postingId);

                postingLink.style.display = "";
            } else {
                postingLink.style.display = "none";
            }
        }

        if (supervisorPanel) {
            supervisorPanel.style.display =
                student.hasSupervisorInfo ? "" : "none";
        }

        if (student.hasSupervisorInfo) {
            const supervisorName = supervisorPanel.querySelector(
                ".supervisor-profile strong"
            );

            const supervisorId = supervisorPanel.querySelector(
                ".supervisor-profile span"
            );

            if (supervisorName) {
                supervisorName.textContent = student.supervisor;
            }

            if (supervisorId) {
                supervisorId.textContent =
                    "Supervisor ID: " + student.supervisorId;
            }

            setInformationValue(
                supervisorPanel,
                "Supervisor Name",
                student.supervisor
            );

            setInformationValue(
                supervisorPanel,
                "Supervisor ID",
                student.supervisorId
            );

            setInformationValue(
                supervisorPanel,
                "Designation",
                student.designation
            );

            setInformationValue(
                supervisorPanel,
                "Company",
                student.company
            );
        }

        const statusHeader = statusPanel
            ? statusPanel.querySelector(".placement-status-header")
            : null;

        if (statusHeader) {
            const statusText = statusHeader.querySelector("strong");
            const placementNumber = statusHeader.querySelector("div span");
            const statusIcon = statusHeader.querySelector(
                ".placement-status-icon"
            );

            if (statusText) {
                statusText.textContent = status;
            }

            if (placementNumber) {
                placementNumber.textContent = student.placementId;
            }

            if (statusIcon) {
                statusIcon.className = "placement-status-icon";

                if (status === "Approved") {
                    statusIcon.classList.add("placement-green");
                    statusIcon.textContent = "✓";
                } else if (status === "Pending Review") {
                    statusIcon.classList.add("placement-yellow");
                    statusIcon.textContent = "◷";
                } else {
                    statusIcon.classList.add("placement-red");
                    statusIcon.textContent = "↻";
                }
            }
        }

        setSideInformation(
            statusPanel,
            "Student Name",
            student.name
        );

        setSideInformation(
            statusPanel,
            "Student ID",
            studentId
        );

        setSideInformation(
            statusPanel,
            "Company",
            student.company
        );

        setSideInformation(
            statusPanel,
            "Position",
            student.position
        );

        setSideInformation(
            statusPanel,
            "Submitted On",
            student.submissionDate
        );

        setSideInformation(
            statusPanel,
            "Current Status",
            status,
            status === "Approved" ? "active-text" : "pending-text"
        );

        const reviewLink = statusPanel
            ? statusPanel.querySelector(".profile-link")
            : null;

        if (reviewLink) {
            reviewLink.href =
                "../Placement%20Approval/placement_details.html?placement_id=" +
                encodeURIComponent(student.placementId);
        }

        setupDetailsSearch();
    }

    function setupDetailsSearch() {
        const search = document.querySelector(
            ".topbar-search input"
        );

        if (!search) return;

        const items = document.querySelectorAll(
            ".information-item, .side-information"
        );

        search.setAttribute(
            "aria-label",
            "Search student details"
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

    loadPlacementDecisions();
    setupProfileAndNotifications();
    setupDropdowns();
    setupStudentList();
    updateStudentDetails();

    window.addEventListener("storage", function (event) {
        if (event.key === placementKey) {
            loadPlacementDecisions();
            updateSummary();

            const table = document.querySelector(
                ".student-list-panel table"
            );

            if (table) {
                table.querySelectorAll("tbody tr[data-student-id]").forEach(
                    function (row) {
                        const studentId = row.dataset.studentId;

                        setStatus(
                            row.cells[5].querySelector(".status"),
                            getPlacementStatus(studentId)
                        );
                    }
                );
            }

            updateStudentDetails();
        }
    });

});