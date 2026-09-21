// ======================================================
// 🤖 AI STUDENT ASSISTANT
// STUDY MANAGEMENT SYSTEM
// SCRIPT.JS — PART 1/3
// ======================================================


// ======================================================
// 🔐 LOGIN PROTECTION
// ======================================================

const currentPage = window.location.pathname.toLowerCase();

if (
    !currentPage.endsWith("login.html") &&
    !currentPage.endsWith("signup.html")
) {
    const loggedIn = localStorage.getItem("studentLoggedIn");

    if (loggedIn !== "true") {
        window.location.href = "login.html";
    }
}


// ======================================================
// 📚 SUBJECT DATA
// ======================================================

const subjects = [
    "Python",
    "C / C++",
    "DSA",
    "AI / ML",
    "Web Development",
    "Database",
    "Git & GitHub"
];


// ======================================================
// 🌐 DJANGO LIBRARY API
// ======================================================

const LIBRARY_API_BASE_URL =
    "http://127.0.0.1:8000";


// ======================================================
// ⏱️ STUDY TIMER
// ======================================================

let timerSeconds = 0;
let timerInterval = null;


// Current study target
let currentStudyTarget = null;


// ======================================================
// 📅 STUDY TARGET DATA
// ======================================================

let studyTargets = JSON.parse(
    localStorage.getItem("studyTargets") || "[]"
);


// ======================================================
// 🧭 NAVIGATION
// ======================================================

function showSection(sectionId, button = null) {

    const sections =
        document.querySelectorAll(".page-section");

    sections.forEach(section => {
        section.classList.remove("active-section");
    });


    const selectedSection =
        document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.add("active-section");
    }


    const navButtons =
        document.querySelectorAll(".nav-button");

    navButtons.forEach(btn => {
        btn.classList.remove("active");
    });


    if (button) {
        button.classList.add("active");
    }
}


// ======================================================
// 👤 LOGGED-IN STUDENT
// ======================================================

function loadLoggedInStudent() {

    const studentData =
        localStorage.getItem("studentUser");

    if (!studentData) {
        return;
    }


    try {

        const student =
            JSON.parse(studentData);


        const welcomeName =
            document.getElementById("welcomeName");

        const profileName =
            document.getElementById("profileName");

        const profileEmail =
            document.getElementById("profileEmail");


        if (welcomeName && student.name) {
            welcomeName.textContent =
                student.name;
        }


        if (profileName && student.name) {
            profileName.value =
                student.name;
        }


        if (profileEmail && student.email) {
            profileEmail.value =
                student.email;
        }

    } catch (error) {

        console.error(
            "Student data error:",
            error
        );

    }
}


// ======================================================
// 🚪 LOGOUT
// ======================================================

function logoutUser() {

    localStorage.removeItem(
        "studentLoggedIn"
    );

    localStorage.removeItem(
        "currentStudent"
    );

    window.location.href =
        "login.html";
}


// ======================================================
// 📅 STUDY TARGET SAVE
// ======================================================

function saveStudyTargets() {

    localStorage.setItem(
        "studyTargets",
        JSON.stringify(studyTargets)
    );
}


// ======================================================
// 📅 GET PLANNER INPUTS
// ======================================================

function getPlannerInputs() {

    const subject =
        document.getElementById("studySubject");

    const topic =
        document.getElementById("studyTopic");

    const date =
        document.getElementById("studyDate");

    const time =
        document.getElementById("studyTime");

    const duration =
        document.getElementById("studyDuration");


    return {

        subject:
            subject ? subject.value.trim() : "",

        topic:
            topic ? topic.value.trim() : "",

        date:
            date ? date.value : "",

        time:
            time ? time.value : "",

        duration:
            duration ? Number(duration.value) : 0

    };
}


// ======================================================
// 🎯 CREATE STUDY TARGET
// ======================================================

function createStudyTarget() {

    const data =
        getPlannerInputs();


    if (!data.subject) {

        alert(
            "Please select a subject."
        );

        return;
    }


    if (!data.topic) {

        alert(
            "Please enter a topic."
        );

        return;
    }


    if (!data.date) {

        alert(
            "Please select a study date."
        );

        return;
    }


    if (!data.time) {

        alert(
            "Please select a start time."
        );

        return;
    }


    if (!data.duration || data.duration <= 0) {

        alert(
            "Please select study duration."
        );

        return;
    }


    const target = {

        id:
            Date.now(),

        subject:
            data.subject,

        topic:
            data.topic,

        date:
            data.date,

        time:
            data.time,

        duration:
            data.duration,

        status:
            "Pending"

    };


    studyTargets.push(target);

    saveStudyTargets();

    loadStudyTargets();

    startStudyTarget(target.id);
}


// ======================================================
// 📋 LOAD MY TIMETABLE
// ======================================================

function loadStudyTargets() {

    const container =
        document.getElementById(
            "studyTargetsList"
        );


    if (!container) {
        return;
    }


    if (studyTargets.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                📅
                <p>
                    No study targets created yet.
                </p>
            </div>
        `;

        return;
    }


    const sortedTargets =
        [...studyTargets].sort(
            (a, b) => {

                const first =
                    `${a.date} ${a.time}`;

                const second =
                    `${b.date} ${b.time}`;

                return first.localeCompare(second);
            }
        );


    container.innerHTML =
        sortedTargets.map(target => `

        <div class="study-target-card">

            <div class="study-target-info">

                <h3>
                    📚 ${escapeHTML(target.subject)}
                </h3>

                <p>
                    <strong>Topic:</strong>
                    ${escapeHTML(target.topic)}
                </p>

                <p>
                    📅 ${target.date}
                    &nbsp;
                    ⏰ ${target.time}
                </p>

                <p>
                    ⏱️ ${target.duration} minutes
                </p>

                <p>
                    Status:
                    <strong>
                        ${target.status}
                    </strong>
                </p>

            </div>


            <div class="study-target-actions">

                <button
                    onclick="startStudyTarget(${target.id})"
                    class="primary-button"
                >
                    ▶ Study
                </button>


                <button
                    onclick="deleteStudyTarget(${target.id})"
                    class="reset-button"
                >
                    🗑️ Delete
                </button>

            </div>

        </div>

    `).join("");
}


// ======================================================
// ▶️ START SELECTED STUDY TARGET
// ======================================================

function startStudyTarget(targetId) {

    const target =
        studyTargets.find(
            item => item.id === targetId
        );


    if (!target) {
        return;
    }


    currentStudyTarget =
        target;


    timerSeconds =
        target.duration * 60;


    updateTimerDisplay();


    const status =
        document.getElementById(
            "timerStatus"
        );


    if (status) {

        status.textContent =
            `Ready: ${target.subject} - ${target.topic}`;

    }


    showSection(
        "plannerSection"
    );
}


// ======================================================
// 🗑️ DELETE STUDY TARGET
// ======================================================

function deleteStudyTarget(targetId) {

    const confirmed =
        confirm(
            "Delete this study target?"
        );


    if (!confirmed) {
        return;
    }


    studyTargets =
        studyTargets.filter(
            target =>
                target.id !== targetId
        );


    saveStudyTargets();

    loadStudyTargets();
}


// ======================================================
// 🛡️ SIMPLE HTML ESCAPE
// ======================================================

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// ======================================================
// ⏱️ TIMER DISPLAY
// ======================================================

function updateTimerDisplay() {

    const display =
        document.getElementById(
            "timerDisplay"
        );


    if (!display) {
        return;
    }


    const minutes =
        Math.floor(
            timerSeconds / 60
        );


    const seconds =
        timerSeconds % 60;


    display.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


// ======================================================
// ▶ START TIMER
// ======================================================

function startTimer() {

    if (timerInterval) {
        return;
    }


    if (!currentStudyTarget) {

        alert(
            "Please select a Study Target first."
        );

        return;
    }


    const status =
        document.getElementById(
            "timerStatus"
        );


    if (status) {
        status.textContent =
            "📖 Study session running...";
    }


    timerInterval =
        setInterval(
            runTimer,
            1000
        );
}


// ======================================================
// ⏳ TIMER RUN
// ======================================================

function runTimer() {

    if (timerSeconds <= 0) {

        completeStudySession();

        return;
    }


    timerSeconds--;

    updateTimerDisplay();
}


// ======================================================
// ⏸ PAUSE TIMER
// ======================================================

function pauseTimer() {

    if (timerInterval) {

        clearInterval(
            timerInterval
        );

        timerInterval = null;
    }


    const status =
        document.getElementById(
            "timerStatus"
        );


    if (status) {

        status.textContent =
            "⏸ Study session paused";

    }
}


// ======================================================
// 🔄 RESET TIMER
// ======================================================

function resetTimer() {

    if (timerInterval) {

        clearInterval(
            timerInterval
        );

        timerInterval = null;
    }


    if (currentStudyTarget) {

        timerSeconds =
            currentStudyTarget.duration * 60;

    } else {

        timerSeconds = 0;

    }


    updateTimerDisplay();


    const status =
        document.getElementById(
            "timerStatus"
        );


    if (status) {

        status.textContent =
            "Ready to study";

    }
}

// ======================================================
// 📊 STUDY SESSION COMPLETION
// ======================================================

function completeStudySession() {

    if (timerInterval) {

        clearInterval(
            timerInterval
        );

        timerInterval = null;
    }


    timerSeconds = 0;

    updateTimerDisplay();


    if (!currentStudyTarget) {
        return;
    }


    const target =
        studyTargets.find(
            item =>
                item.id === currentStudyTarget.id
        );


    if (target) {

        target.status =
            "Completed";


        target.completedAt =
            new Date().toISOString();

    }


    saveStudyTargets();

    loadStudyTargets();


    const status =
        document.getElementById(
            "timerStatus"
        );


    if (status) {

        status.textContent =
            "🎉 Study session completed!";

    }


    alert(
        `Great job! Your ${currentStudyTarget.duration}-minute study session is complete.`
    );


    currentStudyTarget = null;
}


// ======================================================
// 👤 PROFILE
// ======================================================

function loadProfile() {

    const studentData =
        localStorage.getItem(
            "studentUser"
        );


    if (!studentData) {
        return;
    }


    try {

        const student =
            JSON.parse(studentData);


        const nameInput =
            document.getElementById(
                "profileName"
            );


        const emailInput =
            document.getElementById(
                "profileEmail"
            );


        if (nameInput && student.name) {
            nameInput.value =
                student.name;
        }


        if (emailInput && student.email) {
            emailInput.value =
                student.email;
        }

    } catch (error) {

        console.error(
            "Profile loading error:",
            error
        );

    }
}


// ======================================================
// 🌙 THEME
// ======================================================

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "theme"
        );


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-theme"
        );

    }

}


// ======================================================
// 🌓 TOGGLE THEME
// ======================================================

function toggleTheme() {

    document.body.classList.toggle(
        "dark-theme"
    );


    const darkMode =
        document.body.classList.contains(
            "dark-theme"
        );


    localStorage.setItem(
        "theme",
        darkMode
            ? "dark"
            : "light"
    );
}


// ======================================================
// 📚 LIBRARY RESOURCES
// ======================================================

let libraryResources = [];


// ======================================================
// 📚 LOAD LIBRARY FROM DJANGO
// ======================================================

async function loadLibraryFromAPI() {

    try {

        const response =
            await fetch(
                `${LIBRARY_API_BASE_URL}/api/library/`
            );


        if (!response.ok) {
            throw new Error(
                "Library API error"
            );
        }


        const data =
            await response.json();


        if (Array.isArray(data)) {

            libraryResources =
                data.map(item => ({

                    id:
                        item.id,

                    title:
                        item.title,

                    category:
                        item.category,

                    level:
                        item.level,

                    description:
                        item.description,

                    file:
                        item.file

                }));


            displayLibraryResources(
                libraryResources
            );

        }

    } catch (error) {

        console.warn(
            "Django library unavailable:",
            error
        );

    }
}


// ======================================================
// 📚 DISPLAY LIBRARY
// ======================================================

function displayLibraryResources(
    resources = libraryResources
) {

    const container =
        document.getElementById(
            "libraryResources"
        );


    if (!container) {
        return;
    }


    if (!resources.length) {

        container.innerHTML = `
            <div class="empty-state">
                📚
                <p>
                    No programming resources found.
                </p>
            </div>
        `;

        return;
    }


    container.innerHTML =
        resources.map(resource => `

        <div class="library-card">

            <div class="library-card-icon">
                📘
            </div>

            <div class="library-card-content">

                <h3>
                    ${escapeHTML(resource.title)}
                </h3>

                <p>
                    ${escapeHTML(
                        resource.description || ""
                    )}
                </p>

                <div class="library-meta">

                    <span>
                        ${escapeHTML(
                            resource.category || ""
                        )}
                    </span>

                    <span>
                        ${escapeHTML(
                            resource.level || ""
                        )}
                    </span>

                </div>


                ${
                    resource.file
                    ?
                    `
                    <button
                        class="primary-button"
                        onclick="openLibraryPDF('${escapeHTML(resource.file)}')"
                    >
                        📖 Open Notes
                    </button>
                    `
                    :
                    ""
                }

            </div>

        </div>

    `).join("");
}


// ======================================================
// 📖 OPEN LIBRARY PDF
// ======================================================

function openLibraryPDF(filePath) {

    if (!filePath) {

        alert(
            "PDF file is not available."
        );

        return;
    }


    let url =
        filePath;


    if (
        filePath.startsWith("/")
    ) {

        url =
            `${LIBRARY_API_BASE_URL}${filePath}`;

    }


    window.open(
        url,
        "_blank"
    );
}


// ======================================================
// 🔎 LIBRARY SEARCH
// ======================================================

function searchLibrary() {

    const searchInput =
        document.getElementById(
            "librarySearch"
        );


    if (!searchInput) {
        return;
    }


    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    if (!searchText) {

        displayLibraryResources(
            libraryResources
        );

        return;
    }


    const filtered =
        libraryResources.filter(
            resource => {

                const title =
                    String(
                        resource.title || ""
                    ).toLowerCase();


                const category =
                    String(
                        resource.category || ""
                    ).toLowerCase();


                const description =
                    String(
                        resource.description || ""
                    ).toLowerCase();


                return (
                    title.includes(searchText) ||
                    category.includes(searchText) ||
                    description.includes(searchText)
                );

            }
        );


    displayLibraryResources(
        filtered
    );
}


// ======================================================
// 🏷️ LIBRARY CATEGORY FILTER
// ======================================================

function filterLibraryCategory(
    category
) {

    if (
        !category ||
        category === "All"
    ) {

        displayLibraryResources(
            libraryResources
        );

        return;
    }


    const filtered =
        libraryResources.filter(
            resource =>

                String(
                    resource.category || ""
                ).toLowerCase()
                ===
                String(
                    category
                ).toLowerCase()
        );


    displayLibraryResources(
        filtered
    );
}


// ======================================================
// 🎚️ LIBRARY LEVEL FILTER
// ======================================================

function filterLibraryLevel(
    level
) {

    if (
        !level ||
        level === "All"
    ) {

        displayLibraryResources(
            libraryResources
        );

        return;
    }


    const filtered =
        libraryResources.filter(
            resource =>

                String(
                    resource.level || ""
                ).toLowerCase()
                ===
                String(
                    level
                ).toLowerCase()
        );


    displayLibraryResources(
        filtered
    );
}


// ======================================================
// 📚 INITIALIZE LIBRARY
// ======================================================

function initializeLibrary() {

    const searchInput =
        document.getElementById(
            "librarySearch"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            searchLibrary
        );

    }


    loadLibraryFromAPI();
}


// ======================================================
// ⬆️ LIBRARY PDF UPLOAD
// ======================================================

async function uploadLibraryPDF() {

    const fileInput =
        document.getElementById(
            "libraryFile"
        );


    if (!fileInput || !fileInput.files.length) {

        alert(
            "Please select a PDF file."
        );

        return;
    }


    const file =
        fileInput.files[0];


    if (
        file.type !==
        "application/pdf"
    ) {

        alert(
            "Only PDF files are allowed."
        );

        return;
    }


    if (
        file.size >
        10 * 1024 * 1024
    ) {

        alert(
            "PDF size must be less than 10 MB."
        );

        return;
    }


    const formData =
        new FormData();


    formData.append(
        "file",
        file
    );


    const titleInput =
        document.getElementById(
            "libraryTitle"
        );


    const categoryInput =
        document.getElementById(
            "libraryCategory"
        );


    const levelInput =
        document.getElementById(
            "libraryLevel"
        );


    const descriptionInput =
        document.getElementById(
            "libraryDescription"
        );


    if (titleInput) {

        formData.append(
            "title",
            titleInput.value.trim()
        );

    }


    if (categoryInput) {

        formData.append(
            "category",
            categoryInput.value
        );

    }


    if (levelInput) {

        formData.append(
            "level",
            levelInput.value
        );

    }


    if (descriptionInput) {

        formData.append(
            "description",
            descriptionInput.value.trim()
        );

    }


    try {

        const response =
            await fetch(
                `${LIBRARY_API_BASE_URL}/api/library/upload/`,
                {
                    method: "POST",
                    body: formData
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Upload failed"
            );

        }


        alert(
            "PDF uploaded successfully!"
        );


        if (fileInput) {
            fileInput.value = "";
        }


        await loadLibraryFromAPI();


    } catch (error) {

        console.error(
            "PDF upload error:",
            error
        );


        alert(
            "PDF upload failed. Please make sure Django server is running."
        );

    }
}


// ======================================================
// 💾 SAVE BASIC APP DATA
// ======================================================

function loadSavedData() {

    loadStudyTargets();

    loadLoggedInStudent();

    loadProfile();
}


// ======================================================
// ⌨️ KEYBOARD SUPPORT
// ======================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            timerInterval
        ) {

            pauseTimer();

        }

    }
);

// ======================================================
// 🚀 PAGE INITIALIZATION
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // Theme
        loadTheme();


        // Student information
        loadLoggedInStudent();


        // Profile
        loadProfile();


        // Study targets
        loadStudyTargets();


        // Timer
        updateTimerDisplay();


        // Library
        initializeLibrary();

    }
);


// ======================================================
// 📅 SET TODAY AS DEFAULT DATE
// ======================================================

function setDefaultStudyDate() {

    const dateInput =
        document.getElementById(
            "studyDate"
        );


    if (!dateInput) {
        return;
    }


    if (!dateInput.value) {

        const today =
            new Date();


        const year =
            today.getFullYear();


        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");


        const day =
            String(
                today.getDate()
            ).padStart(2, "0");


        dateInput.value =
            `${year}-${month}-${day}`;
    }
}


// ======================================================
// 📚 ADD SUBJECT OPTIONS
// ======================================================

function loadSubjectOptions() {

    const select =
        document.getElementById(
            "studySubject"
        );


    if (!select) {
        return;
    }


    // Don't add again
    if (select.options.length > 1) {
        return;
    }


    subjects.forEach(
        subject => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                subject;


            option.textContent =
                subject;


            select.appendChild(
                option
            );

        }
    );
}


// ======================================================
// 📅 PLANNER INITIALIZATION
// ======================================================

function initializePlanner() {

    loadSubjectOptions();

    setDefaultStudyDate();

    loadStudyTargets();

    updateTimerDisplay();
}


// ======================================================
// 🔄 REFRESH STUDY TARGETS
// ======================================================

function refreshStudyPlanner() {

    loadStudyTargets();

    updateTimerDisplay();
}


// ======================================================
// 🧹 CLEAR COMPLETED TARGETS
// ======================================================

function clearCompletedTargets() {

    const completed =
        studyTargets.filter(
            target =>
                target.status ===
                "Completed"
        );


    if (!completed.length) {

        alert(
            "There are no completed study targets."
        );

        return;
    }


    const confirmed =
        confirm(
            "Clear all completed study targets?"
        );


    if (!confirmed) {
        return;
    }


    studyTargets =
        studyTargets.filter(
            target =>
                target.status !==
                "Completed"
        );


    saveStudyTargets();

    loadStudyTargets();
}


// ======================================================
// 🕒 FORMAT DATE
// ======================================================

function formatStudyDate(dateValue) {

    if (!dateValue) {
        return "";
    }


    const date =
        new Date(
            dateValue + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


// ======================================================
// 🕒 FORMAT TIME
// ======================================================

function formatStudyTime(timeValue) {

    if (!timeValue) {
        return "";
    }


    const parts =
        timeValue.split(":");


    const hour =
        Number(parts[0]);


    const minute =
        parts[1];


    const suffix =
        hour >= 12
            ? "PM"
            : "AM";


    const displayHour =
        hour % 12 || 12;


    return `${displayHour}:${minute} ${suffix}`;
}


// ======================================================
// 📊 STUDY STATISTICS
// ======================================================

function getStudyStatistics() {

    const completed =
        studyTargets.filter(
            target =>
                target.status ===
                "Completed"
        );


    const totalMinutes =
        completed.reduce(
            (total, target) =>
                total +
                Number(
                    target.duration || 0
                ),
            0
        );


    const totalSessions =
        completed.length;


    return {
        totalMinutes,
        totalSessions
    };
}


// ======================================================
// 🏠 UPDATE DASHBOARD STUDY TIME
// ======================================================

function updateDashboardStudyStats() {

    const stats =
        getStudyStatistics();


    const studyTime =
        document.getElementById(
            "studyTime"
        );


    if (studyTime) {

        if (
            stats.totalMinutes >=
            60
        ) {

            const hours =
                Math.floor(
                    stats.totalMinutes / 60
                );


            const minutes =
                stats.totalMinutes % 60;


            studyTime.textContent =
                `${hours}h ${minutes}m`;

        } else {

            studyTime.textContent =
                `${stats.totalMinutes}m`;

        }

    }


    const completedCount =
        document.getElementById(
            "completedStudySessions"
        );


    if (completedCount) {

        completedCount.textContent =
            stats.totalSessions;

    }
}


// ======================================================
// 🔄 UPDATE DASHBOARD AFTER SESSION
// ======================================================

function updateAfterStudySession() {

    updateDashboardStudyStats();

    loadStudyTargets();

    updateTimerDisplay();
}


// ======================================================
// 🛠️ REPLACE COMPLETE SESSION
// ======================================================

const originalCompleteStudySession =
    completeStudySession;


completeStudySession =
    function () {

        originalCompleteStudySession();

        updateAfterStudySession();

    };


// ======================================================
// 🚀 FINAL PLANNER STARTUP
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializePlanner();

        updateDashboardStudyStats();

    }
);


// ======================================================
// 🖱️ GLOBAL CLICK SUPPORT
// ======================================================

document.addEventListener(
    "click",
    function (event) {

        const target =
            event.target;


        // Theme button
        if (
            target.id ===
            "themeButton"
        ) {

            toggleTheme();

        }

    }
);


// ======================================================
// ⏰ AUTO CHECK CURRENT TARGET
// ======================================================

setInterval(
    function () {

        if (!studyTargets.length) {
            return;
        }


        const now =
            new Date();


        const currentDate =
            now.toISOString()
                .split("T")[0];


        const currentTime =
            `${String(
                now.getHours()
            ).padStart(2, "0")}:${String(
                now.getMinutes()
            ).padStart(2, "0")}`;


        studyTargets.forEach(
            target => {

                if (
                    target.status ===
                    "Pending" &&
                    target.date ===
                    currentDate &&
                    target.time ===
                    currentTime
                ) {

                    console.log(
                        `Study target started: ${target.subject} - ${target.topic}`
                    );

                }

            }
        );

    },
    60000
);