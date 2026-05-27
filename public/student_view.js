const form = document.getElementById("student-pass-form");
const studentIdInput = document.getElementById("studentId");
const fromSelect = document.getElementById("fromTeacher");
const toSelect = document.getElementById("toTeacher");
const dateInput = document.getElementById("requestDate");
const reasonInput = document.getElementById("reason");
const messageEl = document.getElementById("form-message");
let allTeachers = [];

/** 
 * Clears the message displayed in the UI. It hides the message element and resets its text content to an empty string. 
*/
function clearMessage() {
    messageEl.hidden = true;
    messageEl.textContent = "";
}

/** 
 * Sets the date input field to today's date using the runtime locale.
 * Called on page load to pre-fill the date field in the pass form.
 * Note: the displayed format depends on the user's locale (uses `toLocaleDateString`).
*/
function setToday() {
    dateInput.value = new Date().toLocaleDateString();
}

/** 
 * Populates the teacher selection dropdown with the provided list of teachers.
 * @param {HTMLSelectElement} selectEl - The select element to populate (e.g., fromSelect or toSelect).
 * @param {Array<Object>} teachers - An array of teacher objects (expects { firstName, lastName, department, _id, roomNumber }).
 * Side effects:
 *  - Groups options by `department` using <optgroup> labels.
 *  - Sets `option.dataset.teacherId` to the teacher's canonical `_id` (used as the primary key on submit).
*/
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

/** 
 * Displays a message in the UI with the specified text and type.
 * @param {string} text - The message text to display.
 * @param {string} type - The type of message to display (e.g., "success", "error")
*/
function showMessage(text, type = "success"){
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    messageEl.hidden = false;
}

/** 
 * Fetches the list of teachers from the server and populates the "from" and "to" teacher selection dropdowns in the pass form. It also caches the list of teachers for later use when resolving teacher IDs during form submission. 
*/
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

/** 
 * When the form is submitted, this function resolves the student's name based on their ID to be displayed in the admin view and to satisfy the requirements of a new pass.
 * @param {string} studentId - The ID of the student.
 * @returns {Promise<Object>} - A promise resolving to the student object.
 */
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

/** 
 * Handles the form submission for creating a new pass.
 * - Validates inputs and resolves the student via `studentNameFromId`.
 * - Resolves `fromTeacher`/`toTeacher` from the cached `allTeachers` array.
 *   (Primary lookup uses `option.dataset.teacherId`; falls back to full-name match.)
 * - Constructs the payload expected by `POST /api/passes` and sends it.
 * - Side effects: resets the form and shows a success or error message via `showMessage()`.
 * Payload shape:
 * {
 *   passId, studentId, studentName, teacherId, teacherName, fromLocation, toLocation, reason?
 * }
*/
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

        // TODO: Ambiguous-name fallback is fragile. Prefer dataset.teacherId always
        // and surface an error if multiple teachers share the same display name.
        const fromTeacher = allTeachers.find(t => t._id === selectedFromOption?.dataset?.teacherId) || allTeachers.find(t => (`${t.firstName} ${t.lastName}`).toLowerCase() === fromTeacherObject.value.toLowerCase());
        // TODO: Consider validating that `toTeacher` exists and is different from `fromTeacher`.
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