
// 1. SEARCH THE INTERN TABLE
const internSearch = document.getElementById("internSearch");

if (internSearch != null) {
    internSearch.addEventListener("keyup", function () {
        const searchText = internSearch.value.toLowerCase();
        const table = document.getElementById("internTable");
        const rows = table.getElementsByTagName("tr");

        for (let i = 1; i < rows.length; i++) {
            const rowText = rows[i].textContent.toLowerCase();

            if (rowText.indexOf(searchText) > -1) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    });
}

// 2. ADD A NEW TASK
const taskForm = document.getElementById("taskForm");

if (taskForm != null) {
    taskForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const intern = document.getElementById("taskIntern").value;
        const title = document.getElementById("taskTitle").value;
        const deadline = document.getElementById("taskDeadline").value;

        const tableBody = document.getElementById("taskTable").getElementsByTagName("tbody")[0];
        const newRow = document.createElement("tr");

        const cell1 = document.createElement("td");
        const cell2 = document.createElement("td");
        const cell3 = document.createElement("td");
        const cell4 = document.createElement("td");
        const cell5 = document.createElement("td");

        cell1.textContent = title;
        cell2.textContent = intern;
        cell3.textContent = deadline;
        cell4.textContent = "In Progress";
        cell4.className = "status-active";

        const statusButton = document.createElement("button");
        statusButton.type = "button";
        statusButton.textContent = "Update Status";
        statusButton.className = "btn-secondary";

        statusButton.addEventListener("click", function () {
            if (cell4.textContent == "In Progress") {
                cell4.textContent = "Completed";
                cell4.className = "status-completed";
            } else {
                cell4.textContent = "In Progress";
                cell4.className = "status-active";
            }
        });

        cell5.appendChild(statusButton);
        newRow.appendChild(cell1);
        newRow.appendChild(cell2);
        newRow.appendChild(cell3);
        newRow.appendChild(cell4);
        newRow.appendChild(cell5);
        tableBody.appendChild(newRow);

        const message = document.getElementById("taskMessage");
        message.textContent = "New task has been added to the task list.";
        message.style.display = "block";

        taskForm.reset();
    });
}

// Update the status buttons already present in the task table.
const taskStatusButtons = document.getElementsByClassName("statusButton");

for (let i = 0; i < taskStatusButtons.length; i++) {
    taskStatusButtons[i].addEventListener("click", function () {
        const row = taskStatusButtons[i].parentElement.parentElement;
        const statusCell = row.getElementsByTagName("td")[3];

        if (statusCell.textContent == "In Progress") {
            statusCell.textContent = "Completed";
            statusCell.className = "status-completed";
        } else {
            statusCell.textContent = "In Progress";
            statusCell.className = "status-active";
        }
    });
}

// 3. MARK WEEKLY REPORTS AS REVIEWED
const reviewButtons = document.getElementsByClassName("reviewButton");

for (let i = 0; i < reviewButtons.length; i++) {
    reviewButtons[i].addEventListener("click", function () {
        const row = reviewButtons[i].parentElement.parentElement;
        const statusCell = row.getElementsByTagName("td")[4];

        if (statusCell.textContent == "Pending Review") {
            statusCell.textContent = "Reviewed";
            statusCell.className = "status-completed";
            reviewButtons[i].textContent = "Reviewed";
        } else {
            statusCell.textContent = "Pending Review";
            statusCell.className = "status-pending";
            reviewButtons[i].textContent = "Mark Reviewed";
        }
    });
}

// 4. ADD SUPERVISOR FEEDBACK
const feedbackForm = document.getElementById("feedbackForm");

if (feedbackForm != null) {
    feedbackForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const intern = document.getElementById("feedbackIntern").value;
        const week = document.getElementById("reportWeek").value;
        const feedback = document.getElementById("reportFeedback").value;

        const tableBody = document.getElementById("feedbackTable").getElementsByTagName("tbody")[0];
        const newRow = document.createElement("tr");

        const cell1 = document.createElement("td");
        const cell2 = document.createElement("td");
        const cell3 = document.createElement("td");

        cell1.textContent = intern;
        cell2.textContent = "Week " + week;
        cell3.textContent = feedback;

        newRow.appendChild(cell1);
        newRow.appendChild(cell2);
        newRow.appendChild(cell3);
        tableBody.appendChild(newRow);

        const message = document.getElementById("feedbackMessage");
        message.textContent = "Feedback has been added.";
        message.style.display = "block";

        feedbackForm.reset();
    });
}

// 5. CALCULATE THE FINAL EVALUATION
const evaluationForm = document.getElementById("evaluationForm");

if (evaluationForm != null) {
    evaluationForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const intern = document.getElementById("evaluationIntern").value;
        const technical = Number(document.getElementById("technicalMark").value);
        const task = Number(document.getElementById("taskMark").value);
        const professional = Number(document.getElementById("professionalMark").value);
        const comments = document.getElementById("evaluationComments").value;
        const recommendationOptions = document.getElementsByName("recommendation");
        let recommendation = "";

        for (let i = 0; i < recommendationOptions.length; i++) {
            if (recommendationOptions[i].checked) {
                recommendation = recommendationOptions[i].value;
            }
        }

        const strengthOptions = document.getElementsByName("strengths");
        let strengths = "";

        for (let i = 0; i < strengthOptions.length; i++) {
            if (strengthOptions[i].checked) {
                strengths = strengths + strengthOptions[i].value + " ";
            }
        }

        if (technical < 0 || technical > 100 ||
            task < 0 || task > 100 ||
            professional < 0 || professional > 100) {
            alert("Please enter marks between 0 and 100.");
        } else {
            const average = (technical + task + professional) / 3;
            const result = document.getElementById("evaluationResult");

            result.textContent = "Intern: " + intern +
                " | Average Mark: " + average.toFixed(2) +
                " | Recommendation: " + recommendation +
                " | Strengths: " + strengths +
                " | Comments: " + comments;

            const message = document.getElementById("evaluationMessage");
            message.textContent = "Evaluation calculated successfully.";
            message.style.display = "block";
        }
    });
}

// 6. UPDATE THE SUPERVISOR PROFILE DISPLAY
const profileForm = document.getElementById("profileForm");

if (profileForm != null) {
    profileForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("supervisorName").value;
        const email = document.getElementById("supervisorEmail").value;
        const phone = document.getElementById("supervisorPhone").value;

        document.getElementById("welcomeText").textContent = "Welcome, " + name;

        const message = document.getElementById("profileMessage");
        message.textContent = "Profile information updated. Email: " + email +
            " | Contact: " + phone;
        message.style.display = "block";
    });
}
