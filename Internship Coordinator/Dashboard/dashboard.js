document.addEventListener("DOMContentLoaded", function () {

    const settingsKey = "internEaseCoordinatorSettings";
    const defaultName = "Mohammad Tahmedul Haque Rafid";

    let savedSettings = loadSettings();
    let pendingProfilePicture = null;
    let isReadingPicture = false;

    function loadSettings() {
        try {
            const data = localStorage.getItem(settingsKey);

            if (data) {
                return JSON.parse(data);
            }

            return {};
        } catch (error) {
            return {};
        }
    }

    function getInitials(name) {
        const words = name.trim().split(/\s+/);

        if (words.length === 1) {
            return words[0].substring(0, 2).toUpperCase();
        }

        let initials = "";

        for (let i = 0; i < words.length && i < 4; i++) {
            initials += words[i].charAt(0).toUpperCase();
        }

        return initials;
    }

    function updateAvatar(avatar, name, picture) {
        if (!avatar) {
            return;
        }

        avatar.textContent = "";
        avatar.style.overflow = "hidden";

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
            avatar.textContent = getInitials(name);
        }
    }

    function updateProfileDisplay() {
        const name = savedSettings.fullName || defaultName;
        const picture = savedSettings.profilePicture || "";
        const initials = getInitials(name);

        const headerNames = document.querySelectorAll(".profile-info strong");

        headerNames.forEach(function (item) {
            item.textContent = name;
        });

        const avatars = document.querySelectorAll(
            ".profile-avatar, .profile-large-avatar"
        );

        avatars.forEach(function (avatar) {
            updateAvatar(avatar, name, picture);
        });

        const largeName = document.querySelector(".profile-large h2");

        if (largeName) {
            largeName.textContent = name;
        }

        const profileNameItems = document.querySelectorAll(
            ".profile-main-card .information-item"
        );

        profileNameItems.forEach(function (item) {
            const label = item.querySelector("span");
            const value = item.querySelector("strong");

            if (label && value && label.textContent.trim() === "Full Name") {
                value.textContent = name;
            }

            if (label && value && label.textContent.trim() === "Account Initials") {
                value.textContent = initials;
            }
        });

        const settingsAccountItems = document.querySelectorAll(
            ".settings-information div"
        );

        settingsAccountItems.forEach(function (item) {
            const label = item.querySelector("span");
            const value = item.querySelector("strong");

            if (label && value && label.textContent.trim() === "Account Holder") {
                value.textContent = name;
            }
        });

        const welcomeHeading = document.querySelector(".welcome-section h1");

        if (welcomeHeading && welcomeHeading.textContent.trim().startsWith("Welcome,")) {
            welcomeHeading.textContent = "Welcome, " + name;
        }
    }

    function loadSettingsForm() {
        const form = document.querySelector(".account-settings-form");

        if (!form) {
            return;
        }

        const fullName = document.getElementById("full-name");
        const email = document.getElementById("email");
        const phone = document.getElementById("phone");
        const department = document.getElementById("department");
        const designation = document.getElementById("designation");
        const officeAddress = document.getElementById("office-address");

        if (fullName && savedSettings.fullName) {
            fullName.value = savedSettings.fullName;
        }

        if (email && savedSettings.email !== undefined) {
            email.value = savedSettings.email;
        }

        if (phone && savedSettings.phone !== undefined) {
            phone.value = savedSettings.phone;
        }

        if (department && savedSettings.department !== undefined) {
            department.value = savedSettings.department;
        }

        if (designation && savedSettings.designation !== undefined) {
            designation.value = savedSettings.designation;
        }

        if (officeAddress && savedSettings.officeAddress !== undefined) {
            officeAddress.value = savedSettings.officeAddress;
        }

        if (savedSettings.notifications) {
            const company = form.elements["company_notifications"];
            const placement = form.elements["placement_notifications"];
            const report = form.elements["report_notifications"];
            const evaluation = form.elements["evaluation_notifications"];

            if (company && typeof savedSettings.notifications.company === "boolean") {
                company.checked = savedSettings.notifications.company;
            }

            if (placement && typeof savedSettings.notifications.placement === "boolean") {
                placement.checked = savedSettings.notifications.placement;
            }

            if (report && typeof savedSettings.notifications.report === "boolean") {
                report.checked = savedSettings.notifications.report;
            }

            if (evaluation && typeof savedSettings.notifications.evaluation === "boolean") {
                evaluation.checked = savedSettings.notifications.evaluation;
            }
        }

        const language = document.getElementById("language");
        const timezone = document.getElementById("timezone");
        const dateFormat = document.getElementById("date-format");

        if (language && savedSettings.language) {
            language.value = savedSettings.language;
        }

        if (timezone && savedSettings.timezone) {
            timezone.value = savedSettings.timezone;
        }

        if (dateFormat && savedSettings.dateFormat) {
            dateFormat.value = savedSettings.dateFormat;
        }
    }

    function applyNotificationPreferences() {
        const items = document.querySelectorAll(".notification-item");
        let visibleCount = 0;

        items.forEach(function (item) {
            const icon = item.querySelector(".notification-item-icon");
            let type = "";

            if (icon) {
                if (icon.classList.contains("notification-blue")) {
                    type = "company";
                } else if (icon.classList.contains("notification-green")) {
                    type = "placement";
                } else if (icon.classList.contains("notification-purple")) {
                    type = "report";
                }
            }

            let showItem = true;

            if (savedSettings.notifications && type) {
                if (savedSettings.notifications[type] === false) {
                    showItem = false;
                }
            }

            item.style.display = showItem ? "" : "none";

            if (showItem) {
                visibleCount++;
            }
        });

        const badges = document.querySelectorAll(".notification-count");

        badges.forEach(function (badge) {
            badge.textContent = visibleCount;
            badge.style.display = visibleCount > 0 ? "" : "none";
        });
    }

    function getSearchText(element) {
        let text = element.innerText || element.textContent || "";

        const controls = element.querySelectorAll(
            'input:not([type="password"]), select, textarea'
        );

        controls.forEach(function (control) {
            text += " " + control.value;

            if (control.placeholder) {
                text += " " + control.placeholder;
            }

            if (control.tagName === "SELECT" && control.selectedOptions.length > 0) {
                text += " " + control.selectedOptions[0].textContent;
            }
        });

        return text.toLowerCase();
    }

    function setupSearch() {
        const searchInput = document.querySelector(
            ".topbar-search input[type='search']"
        );

        const mainContent = document.querySelector(".main-content");

        if (!searchInput || !mainContent) {
            return;
        }

        const searchItems = mainContent.querySelectorAll(
            ".summary-card, .panel"
        );

        searchInput.setAttribute("aria-label", "Search current page content");

        function searchPage() {
            const query = searchInput.value.trim().toLowerCase();
            let visibleCount = 0;

            searchItems.forEach(function (item) {
                const tableBody = item.querySelector("tbody");

                if (tableBody) {
                    const copy = item.cloneNode(true);
                    const tableContainer = copy.querySelector(".table-responsive");

                    if (tableContainer) {
                        tableContainer.remove();
                    } else {
                        const tables = copy.querySelectorAll("table");

                        tables.forEach(function (table) {
                            table.remove();
                        });
                    }

                    const headingText = getSearchText(copy);
                    const headingMatches = headingText.includes(query);

                    const rows = tableBody.querySelectorAll("tr");
                    let matchedRows = 0;

                    rows.forEach(function (row) {
                        const rowMatches = getSearchText(row).includes(query);
                        const showRow = query === "" || headingMatches || rowMatches;

                        row.style.display = showRow ? "" : "none";

                        if (showRow) {
                            matchedRows++;
                        }
                    });

                    const showPanel = query === "" || headingMatches || matchedRows > 0;

                    item.style.display = showPanel ? "" : "none";

                    if (showPanel) {
                        visibleCount++;
                    }
                } else {
                    const matches = getSearchText(item).includes(query);

                    item.style.display = matches ? "" : "none";

                    if (matches) {
                        visibleCount++;
                    }
                }
            });

            if (query !== "" && visibleCount === 0) {
                searchInput.placeholder = "No matching content found";
            } else {
                searchInput.placeholder = "Search...";
            }
        }

        searchInput.addEventListener("input", searchPage);

        searchInput.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                searchInput.value = "";
                searchPage();
                searchInput.blur();
            }
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

    function setupSettingsForm() {
        const form = document.querySelector(".account-settings-form");

        if (!form) {
            return;
        }

        const saveButton = form.querySelector(".button-submit");
        const pictureInput = document.getElementById("profile-picture");

        if (pictureInput) {
            pictureInput.addEventListener("change", function () {
                const file = pictureInput.files[0];

                if (!file) {
                    pendingProfilePicture = null;
                    return;
                }

                if (!file.type.startsWith("image/")) {
                    alert("Please select a valid image file.");
                    pictureInput.value = "";
                    return;
                }

                if (file.size > 1024 * 1024) {
                    alert("Image size must be 1 MB or less.");
                    pictureInput.value = "";
                    return;
                }

                isReadingPicture = true;

                const reader = new FileReader();

                reader.onload = function (event) {
                    pendingProfilePicture = event.target.result;
                    isReadingPicture = false;

                    const nameInput = document.getElementById("full-name");
                    const name = nameInput.value.trim() || defaultName;

                    const avatars = document.querySelectorAll(
                        ".profile-avatar, .profile-large-avatar"
                    );

                    avatars.forEach(function (avatar) {
                        updateAvatar(avatar, name, pendingProfilePicture);
                    });
                };

                reader.onerror = function () {
                    isReadingPicture = false;
                    alert("Could not read the selected image.");
                };

                reader.readAsDataURL(file);
            });
        }

        function saveSettings() {
            if (isReadingPicture) {
                alert("Please wait until the profile picture is ready.");
                return;
            }

            const fullNameInput = document.getElementById("full-name");
            const emailInput = document.getElementById("email");
            const phoneInput = document.getElementById("phone");
            const departmentInput = document.getElementById("department");
            const designationInput = document.getElementById("designation");
            const officeAddressInput = document.getElementById("office-address");

            const fullName = fullNameInput.value.trim();
            const email = emailInput.value.trim();

            if (fullName === "") {
                alert("Please enter your full name.");
                fullNameInput.focus();
                return;
            }

            if (email !== "" && !emailInput.checkValidity()) {
                alert("Please enter a valid email address.");
                emailInput.focus();
                return;
            }

            const currentPassword = document.getElementById("current-password");
            const newPassword = document.getElementById("new-password");
            const confirmPassword = document.getElementById("confirm-password");

            const passwordUsed =
                currentPassword.value !== "" ||
                newPassword.value !== "" ||
                confirmPassword.value !== "";

            if (passwordUsed) {
                if (
                    currentPassword.value === "" ||
                    newPassword.value === "" ||
                    confirmPassword.value === ""
                ) {
                    alert("Please fill in all three password fields.");
                    return;
                }

                if (newPassword.value !== confirmPassword.value) {
                    alert("New Password and Confirm New Password do not match.");
                    confirmPassword.focus();
                    return;
                }
            }

            const companyNotification = form.elements["company_notifications"];
            const placementNotification = form.elements["placement_notifications"];
            const reportNotification = form.elements["report_notifications"];
            const evaluationNotification = form.elements["evaluation_notifications"];

            const language = document.getElementById("language");
            const timezone = document.getElementById("timezone");
            const dateFormat = document.getElementById("date-format");

            let profilePicture = savedSettings.profilePicture || "";

            if (pendingProfilePicture !== null) {
                profilePicture = pendingProfilePicture;
            }

            const newSettings = {
                fullName: fullName,
                email: email,
                phone: phoneInput.value.trim(),
                department: departmentInput.value.trim(),
                designation: designationInput.value.trim(),
                officeAddress: officeAddressInput.value.trim(),
                profilePicture: profilePicture,

                notifications: {
                    company: companyNotification.checked,
                    placement: placementNotification.checked,
                    report: reportNotification.checked,
                    evaluation: evaluationNotification.checked
                },

                language: language.value,
                timezone: timezone.value,
                dateFormat: dateFormat.value
            };

            try {
                localStorage.setItem(settingsKey, JSON.stringify(newSettings));

                savedSettings = newSettings;
                pendingProfilePicture = profilePicture;

                updateProfileDisplay();
                applyNotificationPreferences();

                currentPassword.value = "";
                newPassword.value = "";
                confirmPassword.value = "";

                if (passwordUsed) {
                    alert(
                        "Your personal information and preferences have been saved in this browser.\n\n" +
                        "Your password has NOT been changed. A secure PHP/MySQL backend is required " +
                        "to verify and change the account password. Password values were not stored."
                    );
                } else {
                    alert(
                        "Settings saved successfully in this browser.\n\n" +
                        "Your updated profile information will also appear on the Dashboard and My Profile pages."
                    );
                }

            } catch (error) {
                alert(
                    "Could not save your settings in browser storage. " +
                    "Please try a smaller profile picture or check browser storage."
                );
            }
        }

        if (saveButton) {
            saveButton.addEventListener("click", saveSettings);
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            saveSettings();
        });
    }

    loadSettingsForm();
    updateProfileDisplay();
    applyNotificationPreferences();
    setupDropdowns();
    setupSearch();
    setupSettingsForm();

});