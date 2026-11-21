// DASHBOARD ELEMENTS

let dateBadge = document.querySelector(".date-badge");
let dateDot = document.querySelector(".date-dot");


// UPDATE CURRENT DATE

function updateDate() {
    let today = new Date();

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    let currentDate = today.toLocaleDateString("en-GB", options);

    dateBadge.innerHTML = '<span class="date-dot"></span> ' + currentDate;
}


// INITIAL PAGE SETUP

updateDate();