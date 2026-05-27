const passTableBody = document.getElementById("pass-table-body");

/**
 * Map a pass status to a CSS class name for presentation.
 * @param {string} status - Pass status (e.g. "requested", "approved and in progress", "completed", "denied").
 * @returns {string} CSS class name used for status styling.
 */
function assignStatusClass(status){
    if(status === "requested"){
        return "status-requested";
    }else if(status === "approved and in progress"){
        return "status-approved";
    }else if(status === "completed"){
        return "status-completed";
    }else if(status === "denied"){
        return "status-denied";
    } else {
        return "status-requested";
    }
}

/**
 * Format an ISO/Date string into a localized human-readable string.
 * @param {string|Date|undefined} dateString - date input (ISO string or Date); may be undefined/null.
 * @returns {string|null} localized date/time string, or null if input is falsy/invalid.
 */
function dateFormatter(dateString){
    if(dateString){
        return new Date(dateString).toLocaleString();
    } else {
        return null;
    }
}

/**
 * Toggle the visual "active" state for status filter buttons.
 * @param {string} selectedStatus - status string matching a button's `data-status` attribute.
 * Side effect: updates button classes in the `.status-filters` container.
 */
function setActiveStatusFilter(selectedStatus) {
    const buttons = document.querySelectorAll(".status-filters button");

    buttons.forEach((button) => {
        button.classList.toggle("active", button.getAttribute("data-status") === selectedStatus);
    });
}

/**
 * Load passes from the backend and render them into the table.
 * @param {string} statusFilter - optional status filter (case-insensitive). When empty, loads all passes.
 * Expected server response: Array of pass objects { passId, teacherName, studentName, studentId, fromLocation, toLocation, reason?, status, requestedAt, approvedAt, endedAt }
 * Side effects: clears and repopulates `passTableBody`.
 * Errors are logged to console; no throw is propagated to caller.
 */
async function loadPasses(statusFilter = "") {
    try{
        const endpoint = statusFilter 
            ? `/api/passes?status=${encodeURIComponent(statusFilter)}`
            : "/api/passes";
        const response = await fetch(endpoint);
        const passes = await response.json();

        // TODO: If pass count grows large, implement server-side pagination
        // and incremental rendering instead of clearing and re-rendering all rows.
        passTableBody.innerHTML = "";
        passes.forEach((pass)=>{
            const row = document.createElement("tr");
            const statusClass =  assignStatusClass(pass.status);
            row.innerHTML = `
                <td>${pass.passId}</td>
                <td>${pass.teacherName}</td>
                <td>${pass.studentName}</td>
                <td>${pass.studentId}</td>
                <td>${pass.fromLocation}</td>
                <td>${pass.toLocation}</td>
                <td>${pass.reason || "N/A"}</td>
                <td class="${statusClass}">${pass.status}</td>
                <td>${dateFormatter(pass.requestedAt)}</td>
                <td>${dateFormatter(pass.approvedAt)||dateFormatter(pass.endedAt) || "N/A"}</td>
            `;
            passTableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading passes:", error);

    }
}

/**
 * Attach click handlers to the status filter buttons.
 * On click: loads passes for the clicked status and updates the active button state.
 */
function setupStatusFilters(){
    const buttons = document.querySelectorAll(".status-filters button");

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const selectedStatus = button.getAttribute("data-status");
            loadPasses(selectedStatus);
            setActiveStatusFilter(selectedStatus);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupStatusFilters();
    setActiveStatusFilter("");
    loadPasses();
});