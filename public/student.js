const form = document.getElementById("student-pass-form");
const nameInput = document.getElementById("studentName");
const fromSelect = document.getElementById("fromLocation");
const toSelect = document.getElementById("toLocation");
const dateInput = document.getElementById("requestDate");
const reasonInput = document.getElementById("reason");
const messageEl = document.getElementById("form-message");

function clearMessage() {
    messageEl.hidden = true;
    messageEl.textContent = "";
}

function setToday() {
    dateInput.value = new Date().toLocaleDateString();
}

function populateLocationSelect(selectEl, locations) {
    selectEl.innerHTML = "";

    const placeHolder = document.createElement("option");
    placeHolder.value = "";
    placeHolder.textContent = "Select a location";
    selectEl.appendChild(placeHolder);

    const groupedLocations = locations.reduce((acc, loc) => {
        if (!acc[loc.department]) acc[loc.department] = [];
        acc[loc.department].push(loc.roomNumber);
        return acc;
    }, {});

    Object.keys(groupedLocations).sort().forEach((department) => {
        const group = document.createElement("optgroup");
        group.label = department;

        groupedLocations[department].sort().forEach((room) => {
            const option = document.createElement("option");
            option.value = room;
            option.textContent = room;
            group.appendChild(option);
        });

        selectEl.appendChild(group);
    });
}

async function loadLocations() {
    try {
        const response = await fetch("/api/locations");
        if (!response.ok) {
            throw new Error(`Failed to load locations (${response.status})`);
        }

        const locations = await response.json();
        populateLocationSelect(fromSelect, locations);
        populateLocationSelect(toSelect, locations);
    } catch (error) {
        console.error("Error loading locations:", error);
    }
}



document.addEventListener("DOMContentLoaded", () => {
    setToday();
    loadLocations();
});