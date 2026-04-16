const passTableBody = document.getElementById("pass-table-body");

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

function dateFormatter(dateString){
    if(dateString){
    return new Date(dateString).toLocaleString();
    } else {
        return null;
    }
}

async function loadPasses(statusFilter = "") {
    try{
        const endpoint = statusFilter 
            ? `/api/passes?status=${encodeURIComponent(statusFilter)}`
            : "/api/passes";
        const response = await fetch(endpoint);
        const passes = await response.json();

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

function setupStatusFilters(){
    const buttons = document.querySelectorAll(".status-filters button");

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const selectedStatus = button.getAttribute("data-status");
            loadPasses(selectedStatus);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupStatusFilters();
    loadPasses();
});