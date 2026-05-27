const form = document.getElementById("student-pass-form");
const studentIdInput = document.getElementById("studentId");
const fromSelect = document.getElementById("fromTeacher");
const toSelect = document.getElementById("toTeacher");
const dateInput = document.getElementById("requestDate");
const reasonInput = document.getElementById("reason");
const messageEl = document.getElementById("form-message");
let allTeachers = [];

function clearMessage() {
    messageEl.hidden = true;
    messageEl.textContent = "";
}

function setToday() {
    dateInput.value = new Date().toLocaleDateString();
}

function populateTeacherSelect(selectEl, teachers) {
    selectEl.innerHTML = "";

    const placeHolder = document.createElement("option");
    placeHolder.value = "";
    placeHolder.textContent = "Select a teacher";
    selectEl.appendChild(placeHolder);

    const groupedTeachers = teachers.reduce((acc, teacher) => {
        if (!acc[teacher.department]) acc[teacher.department] = [];
        acc[teacher.department].push(teacher);
        return acc;
    }, {});

    Object.keys(groupedTeachers).sort().forEach((department) => {
        const group = document.createElement("optgroup");
        group.label = department;

        groupedTeachers[department].sort().forEach((teacher) => {
            const option = document.createElement("option");
            const fullName = `${teacher.firstName} ${teacher.lastName}`;
            option.value = fullName;
            option.dataset.teacherId = teacher._id;
            option.textContent = fullName;
            group.appendChild(option);
        });

        selectEl.appendChild(group);
    });
}

function showMessage(text, type = "success"){
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    messageEl.hidden = false;
}

async function loadTeachers() {
    try {
        const response = await fetch("/api/teachers");
        if (!response.ok) {
            throw new Error(`Failed to load teachers (${response.status})`);
        }

        const teachers = await response.json();
        allTeachers = teachers;
        populateTeacherSelect(fromSelect, teachers);
        populateTeacherSelect(toSelect, teachers);
    } catch (error) {
        console.error("Error loading teachers:", error);
    }
}

async function studentNameFromId(studentId) {
    try{
        const response = await fetch(`/api/students?studentId=${encodeURIComponent(studentId)}`);
        if (!response.ok){
            throw new Error(`Failed to fetch student name (${response.status})`);
        }
    

    const students = await response.json();
    if (students.length === 0) {
        throw new Error("No student found with that ID");
    }

    return students[0];

    } catch (error) {
    console.error("Error fetching student name:", error);
    throw error;
    }
}

//Old function: locationFromTeacherId(teacherId) is no longer used because the information is now obtained from the cached teacher objects when resolving the "from" teacher in the form submission handler

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage();
    try {  
        const studentId = studentIdInput.value.trim();
        const fromTeacherObject = fromSelect.options[fromSelect.selectedIndex];
        const toTeacherObject = toSelect.options[toSelect.selectedIndex];
        const reason = reasonInput.value.trim();

        const selectedFromOption = fromSelect.options[fromSelect.selectedIndex];
        const selectedToOption = toSelect.options[toSelect.selectedIndex];

        const fromTeacher = allTeachers.find(t => t._id === selectedFromOption?.dataset?.teacherId) || allTeachers.find(t => (`${t.firstName} ${t.lastName}`).toLowerCase() === fromTeacherObject.value.toLowerCase());
        const toTeacher = allTeachers.find(t => t._id === selectedToOption?.dataset?.teacherId) || allTeachers.find(t => (`${t.firstName} ${t.lastName}`).toLowerCase() === toTeacherObject.value.toLowerCase());

        if(!fromTeacher || !toTeacher) {
            throw new Error("Selected teacher(s) not found");
        }

        const student = await studentNameFromId(studentId);
        const studentName = `${student.firstName} ${student.lastName}`;

        // Use the cached teacher objects we already resolved above
        const teacherId = fromTeacher._id;

        const payload = {
            passId: `Pass-${Date.now()}`,
            studentId: studentId,
            studentName: studentName,
            teacherId: fromTeacher._id,
            teacherName: `${fromTeacher.firstName} ${fromTeacher.lastName}`,
            fromLocation: fromTeacher.roomNumber,
            toLocation: toTeacher.roomNumber,
            reason: reason || ""
        };

        const response = await fetch("/api/passes", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if(!response.ok) {
            throw new Error(result.error || "Failed to submit pass request");
        }

        form.reset();
        setToday();
        showMessage(`Pass ${result.passId} created successfully!`, "success");

    }   catch (error) {
        console.error("Error submitting form:", error);
        showMessage(error.message, "error");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    setToday();
    loadTeachers();
});