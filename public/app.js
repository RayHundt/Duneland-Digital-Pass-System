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

async function loadPasses() {
    try{
        const response = await fetch("/api/passes");
        const passes = await response.json();
        const statusClass =  assignStatusClass(passes.status);

        passTableBody.innerHTML = "";
        passes.forEach((pass)=>{
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${pass.passId}</td>
                <td>${pass.teacherName}</td>
                <td>${pass.studentName}</td>
                <td>${pass.fromLocation}</td>
                <td>${pass.toLocation}</td>
                <td>${pass.reason || "N/A"}</td>
                <td class="${statusClass}">${pass.status}</td>
                
            `;
            passTableBody.appendChild(row);
            assignStatusClass(pass.status);
        });
    } catch (error) {
        console.error("Error loading passes:", error);

    }
}


document.addEventListener("DOMContentLoaded", loadPasses);