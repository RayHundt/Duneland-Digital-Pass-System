const form = document.getElementById("student-pass-form");
const nameInput = document.getElementById("studentName");
const fromSelect = document.getElementById("fromLocation");
const toSelect = document.getElementById("toLocation");
const dateInput = document.getElementById("requestDate");
const reasonInput = document.getElementById("reason");
const messageEl = document.getElementById("form-message");

function showMessage(text, type = "success") {
    messageEl.textContent = text;
    messageEl.className = `${type}-message`;
    messageEl.hidden = false;
}

function clearMessage() {
    messageEl.hidden = true;
    messageEl.textContent = "";
}

function populateLocationSelect(selecetEl, locations){
    selecetEl.innerHTML = "";

    const placeHolder = document.createElement("option");
    placeHolder.value = "";
    placeHolder.textContent = "Select a location";
    selecetEl.appendChild(placeholder);

    const groupedLocations = locations.reduce((acc, loc) => {
        if (!acc[loc.department]) acc[loc.department] = [];
        acc[loc.department].push(loc.roomNumber);
        return acc;
    }, {});

    Object.keys(groupedLocations).sort().forEach((department) => {
        const grouped = document.createElement("optgroup");
        grouped.label = department;

        groupedLocations[department].sort().forEach((room) => {
            const option = document.createElement("option");
            option.value = room;
            option.textContent = room;
            grouped.appendChild(option);
    });

    selecetEl.appendChild(group);
    });
}



document.addEventListener("DOMContentLoaded", () => {
    setToday();
    populateLocationOptions();
});