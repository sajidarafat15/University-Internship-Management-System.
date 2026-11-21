// FORM ELEMENTS
let assignmentForm = document.querySelector("form");
let internInput = document.getElementById("intern");
let supervisorInput = document.getElementById("supervisor");
let departmentInput = document.getElementById("department");
let positionInput = document.getElementById("position");
let startDateInput = document.getElementById("start-date");
let responsibilitiesInput = document.getElementById("responsibilities");
let assignmentTable = document.querySelector("tbody");
let supervisorCards = document.querySelectorAll(".supervisor-card");

// UPDATE SUPERVISOR WORKLOAD
function updateWorkload() {
    let workloads = document.querySelectorAll(".supervisor-workload");

    for (let i = 0; i < workloads.length; i++) {
        let supervisorName = supervisorCards[i].querySelector(".supervisor-info h3").textContent;
        let count = 0;

        for (let j = 0; j < assignmentTable.rows.length; j++) {
            let assignedSupervisor = assignmentTable.rows[j].cells[2].textContent;

            if (assignedSupervisor == supervisorName) {
                count++;
            }
        }

        workloads[i].textContent = "Workload: " + count;
    }
}

// UPDATE STATISTICS
function updateStatistics() {
    let totalSupervisors = supervisorCards.length;
    let assignedInterns = assignmentTable.rows.length;
    let availableSupervisors = 0;

    for (let i = 0; i < supervisorCards.length; i++) {
        let status = supervisorCards[i].querySelector(".availability").textContent;

        if (status == "Available") {
            availableSupervisors++;
        }
    }

    let statistics = document.querySelectorAll(".stat-card h2");
    statistics[0].textContent = totalSupervisors;
    statistics[1].textContent = assignedInterns;
    statistics[2].textContent = availableSupervisors;

    let summary = document.querySelectorAll(".summary-item strong");
    summary[0].textContent = totalSupervisors;
    summary[1].textContent = assignedInterns;
    summary[2].textContent = availableSupervisors;
}

// ASSIGN SUPERVISOR
function assignSupervisor(event) {
    event.preventDefault();

    let intern = internInput.options[internInput.selectedIndex].text;
    let supervisor = supervisorInput.options[supervisorInput.selectedIndex].text;
    let department = departmentInput.value;
    let position = positionInput.value;
    let startDate = startDateInput.value;
    let responsibilities = responsibilitiesInput.value;

    // CHECK FORM INFORMATION
    if (internInput.value == "" || supervisorInput.value == "" ||
        department == "" || startDate == "" || responsibilities == "") {
        alert("Please complete all required fields.");
        return;
    }

    // FIND SELECTED SUPERVISOR
    let selectedCard = null;

    for (let i = 0; i < supervisorCards.length; i++) {
        let name = supervisorCards[i].querySelector(".supervisor-info h3").textContent;

        if (name == supervisor) {
            selectedCard = supervisorCards[i];
        }
    }

    if (selectedCard == null) {
        alert("Selected supervisor was not found.");
        return;
    }

    // CHECK SUPERVISOR STATUS
    let supervisorStatus = selectedCard.querySelector(".availability").textContent;

    if (supervisorStatus == "Inactive") {
        alert("This supervisor is currently inactive.");
        return;
    }

    // CHECK SUPERVISOR DEPARTMENT
    let supervisorDepartment = selectedCard.querySelector(".supervisor-info p").textContent;

    if (supervisorDepartment != department) {
        alert("Please select a supervisor from the same department.");
        return;
    }

    // CHECK EXISTING ASSIGNMENT
    let existingRow = null;

    for (let i = 0; i < assignmentTable.rows.length; i++) {
        let existingIntern = assignmentTable.rows[i].cells[0].textContent;

        if (existingIntern == intern) {
            existingRow = assignmentTable.rows[i];
        }
    }

    // FORMAT START DATE
    let date = new Date(startDate + "T00:00:00");
    let formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

    // ADD OR UPDATE ASSIGNMENT
    if (existingRow != null) {
        existingRow.cells[1].textContent = department;
        existingRow.cells[2].textContent = supervisor;
        existingRow.cells[3].textContent = formattedDate;
        existingRow.cells[4].textContent = "Assigned";

        alert("Supervisor assignment updated successfully.");
    } else {
        let newRow = assignmentTable.insertRow();

        newRow.insertCell(0).textContent = intern;
        newRow.insertCell(1).textContent = department;
        newRow.insertCell(2).textContent = supervisor;
        newRow.insertCell(3).textContent = formattedDate;
        newRow.insertCell(4).textContent = "Assigned";

        alert("Supervisor assigned successfully.");
    }

    updateWorkload();
    updateStatistics();
    assignmentForm.reset();
}

// CLEAR FORM
function clearForm() {
    assignmentForm.reset();
}

// EVENT LISTENERS
assignmentForm.addEventListener("submit", assignSupervisor);

document.querySelector(".btn-reset").addEventListener("click", clearForm);

// INITIAL PAGE SETUP
updateWorkload();
updateStatistics();