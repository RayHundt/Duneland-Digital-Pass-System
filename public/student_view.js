const form = document.getElementById("student-pass-form");
const studentIdInput = document.getElementById("studentId");
const fromSelect = document.querySelector("select[name='fromTeacher']");
const toSelect = document.querySelector("select[name='toTeacher']");
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

    const fullName = teacher.firstName + " " + teacher.lastName;

    const groupedTeachers = teachers.reduce((acc, teacher) => {
        if (!acc[teacher.department]) acc[teacher.department] = [];
        acc[teacher.department].push(teacher);
        return acc;
    }, {});

    Object.keys(groupedTeachers).sort().forEach((department) => {
        const group = document.createElement("optgroup");
        group.label = department;

        groupedTeachers[department].sort().forEach((teacher) => {
            const fullName = `${teacher.firstName} ${teacher.lastName}`;
            option.value = fullName;
            option.dataset.teacherId = teacher._id;
            option.textContent = fullName;

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

async function locationFromTeacherName(fromSelect, toSelect) {
    try{
        const fromResponse = await fetch(`/api/teachers?name=${encodeURIComponent(selectedFullName)}`);
        const toResponse = await fetch(`/api/teachers?name=${encodeURIComponent(selectedFullName)}`);
        if (!fromResponse.ok || !toResponse.ok){
            throw new Error(`Failed to fetch teacher name (${fromResponse.status} / ${toResponse.status})`);
        }

        const fromTeachers = await fromResponse.json();
        const toTeachers = await toResponse.json();

        if (fromTeachers.length === 0) {
            throw new Error("No teacher found with that name");
        }

        if (toTeachers.length === 0) {
            throw new Error("No teacher found with that name");
        }

    return { from: fromTeachers[0], to: toTeachers[0] };

    } catch (error) {
    console.error("Error fetching teacher name:", error);
    throw error;
    }
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage();
    try {  
        const studentId = studentIdInput.value.trim();
        const fromTeacher = fromSelect.value;
        const toTeacher = toSelect.value;
        const reason = reasonInput.value.trim();

        const selectedFromOption = fromSelect.options[0];
        const selectedToOption = toSelect.options[0];

        const fromTeacher = allTeachers.find(t => t._id === selectedFromOption?.dataset?.teacherId) || allTeachers.find(t => (`${t.firstName} ${t.lastName}`).toLowerCase() === fromTeacher.value.toLowerCase());
        const toTeacher = allTeachers.find(t => t._id === selectedToOption?.dataset?.teacherId) || allTeachers.find(t => (`${t.firstName} ${t.lastName}`).toLowerCase() === toTeacher.value.toLowerCase());

        if(!fromTeacher || !toTeacher) {
            throw new Error("Selected teacher(s) not found");
        }

        const student = await studentNameFromId(studentId);
        const studentName = `${student.firstName} ${student.lastName}`;

        const fromTeacherInfo = await locationFromTeacherName(fromTeacher);
        const toTeacherInfo = await locationFromTeacherName(toTeacher);
        const teacherId = fromTeacherInfo.from._id;

        const payload = {
            passId: `Pass-${Date.now()}`,
            studentId: studentId,
            studentName: studentName,
            teacherId: fromTeacher._id,
            teacherName: `${fromTeacherInfo.from.firstName} ${fromTeacherInfo.from.lastName}`,
            fromLocation: fromTeacherInfo.roomNumber,
            toLocation: toTeacherInfo.roomNumber,
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

        form.requestFullscreen();
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