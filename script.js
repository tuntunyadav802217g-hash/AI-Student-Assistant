/* =========================================
   AI STUDENT ASSISTANT
   VERSION 5
   JAVASCRIPT
========================================= */


/* =========================================
   SUBJECT DATA
========================================= */

const subjects = [
    "Mathematics",
    "Python",
    "DSA",
    "Physics"
];

const subjectIds = [
    "math",
    "python",
    "dsa",
    "physics"
];


/* =========================================
   GLOBAL DATA
========================================= */

let timerSeconds = 25 * 60;
let timerInterval = null;


/* =========================================
   SECTION NAVIGATION
========================================= */

function showSection(sectionId, button = null) {

    const sections =
        document.querySelectorAll(".page-section");

    sections.forEach(section => {

        section.classList.remove("active-section");

    });


    const selectedSection =
        document.getElementById(sectionId);

    if (selectedSection) {

        selectedSection.classList.add(
            "active-section"
        );

    }


    /* Update active navigation button */

    const navButtons =
        document.querySelectorAll(".nav-button");

    navButtons.forEach(btn => {

        btn.classList.remove("active");

    });


    if (button) {

        button.classList.add("active");

    } else {

        navButtons.forEach(btn => {

            const onclickText =
                btn.getAttribute("onclick") || "";

            if (
                onclickText.includes(
                    sectionId
                )
            ) {

                btn.classList.add("active");

            }

        });

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================
   DARK / LIGHT MODE
========================================= */

function toggleTheme() {

    document.body.classList.toggle("dark");


    const isDark =
        document.body.classList.contains("dark");


    localStorage.setItem(
        "studentTheme",
        isDark ? "dark" : "light"
    );


    updateThemeButton();
}


function updateThemeButton() {

    const button =
        document.getElementById("themeButton");

    if (!button) return;


    const isDark =
        document.body.classList.contains("dark");


    button.textContent =
        isDark ? "☀️" : "🌙";
}


function loadTheme() {

    const savedTheme =
        localStorage.getItem("studentTheme");


    if (savedTheme === "dark") {

        document.body.classList.add("dark");

    }


    updateThemeButton();
}


/* =========================================
   GET MARKS
========================================= */

function getMarks() {

    const marks = {};


    subjectIds.forEach(id => {

        const input =
            document.getElementById(id);

        marks[id] =
            Number(input.value);

    });


    return marks;
}


/* =========================================
   VALIDATE MARKS
========================================= */

function validateMarks() {

    for (const id of subjectIds) {

        const input =
            document.getElementById(id);


        if (input.value.trim() === "") {

            alert(
                "Please enter marks for all subjects."
            );

            input.focus();

            return false;
        }


        const value =
            Number(input.value);


        if (
            isNaN(value) ||
            value < 0 ||
            value > 100
        ) {

            alert(
                "Marks must be between 0 and 100."
            );

            input.focus();

            return false;
        }

    }


    return true;
}


/* =========================================
   CALCULATE RESULT
========================================= */

function calculateResult(saveHistory = true) {

    if (!validateMarks()) {

        return;

    }


    const nameInput =
        document.getElementById("studentName");


    const name =
        nameInput.value.trim() || "Student";


    const marks =
        getMarks();


    const total =
        marks.math +
        marks.python +
        marks.dsa +
        marks.physics;


    const percentage =
        total / subjects.length;


    const grade =
        calculateGrade(percentage);


    const weakest =
        findWeakestSubject(marks);


    /* Dashboard */

    document.getElementById(
        "welcomeName"
    ).textContent = name;


    document.getElementById(
        "percentageValue"
    ).textContent =
        percentage.toFixed(1) + "%";


    document.getElementById(
        "gradeValue"
    ).textContent =
        grade;


    document.getElementById(
        "totalValue"
    ).textContent =
        `${total}/400`;


    document.getElementById(
        "weakSubjectValue"
    ).textContent =
        weakest.name;


    /* Create sections */

    createPerformance(marks);

    createChart(marks);

    createTargets(marks);

    createStudyPlan(marks);

    createSuggestion(
        marks,
        percentage,
        grade,
        weakest.name
    );


    /* Save */

    const studentData = {

        name: name,

        marks: marks,

        total: total,

        percentage: percentage,

        grade: grade,

        weakest: weakest.name

    };


    localStorage.setItem(
        "studentData",
        JSON.stringify(studentData)
    );


    if (saveHistory) {

        saveHistoryRecord(
            studentData
        );

    }


    /* Go to dashboard */

    showSection(
        "dashboardSection"
    );

}


/* =========================================
   GRADE CALCULATION
========================================= */

function calculateGrade(percentage) {

    if (percentage >= 90) {
        return "A+";
    }

    if (percentage >= 80) {
        return "A";
    }

    if (percentage >= 70) {
        return "B";
    }

    if (percentage >= 60) {
        return "C";
    }

    if (percentage >= 50) {
        return "D";
    }

    return "F";
}


/* =========================================
   FIND WEAKEST SUBJECT
========================================= */

function findWeakestSubject(marks) {

    let weakestId =
        subjectIds[0];


    subjectIds.forEach(id => {

        if (
            marks[id] <
            marks[weakestId]
        ) {

            weakestId = id;

        }

    });


    const index =
        subjectIds.indexOf(weakestId);


    return {

        id: weakestId,

        name: subjects[index],

        marks: marks[weakestId]

    };
}


/* =========================================
   SUBJECT PERFORMANCE
========================================= */

function createPerformance(marks) {

    const container =
        document.getElementById(
            "subjectPerformance"
        );


    container.innerHTML = "";


    subjectIds.forEach((id, index) => {

        const mark =
            marks[id];


        const item =
            document.createElement("div");


        item.className =
            "performance-item";


        item.innerHTML = `

            <div class="performance-header">

                <span>
                    ${subjects[index]}
                </span>

                <span>
                    ${mark}/100
                </span>

            </div>

            <div class="progress-container">

                <div
                    class="progress-bar"
                    style="width: ${mark}%"
                ></div>

            </div>

        `;


        container.appendChild(item);

    });

}


/* =========================================
   PERFORMANCE CHART
========================================= */

function createChart(marks) {

    const container =
        document.getElementById(
            "marksChart"
        );


    container.innerHTML = "";


    subjectIds.forEach((id, index) => {

        const mark =
            marks[id];


        const chartItem =
            document.createElement("div");


        chartItem.innerHTML = `

            <div class="chart-label">

                <span>
                    ${subjects[index]}
                </span>

                <strong>
                    ${mark}%
                </strong>

            </div>

            <div class="chart-track">

                <div
                    class="chart-fill"
                    style="width: ${mark}%"
                ></div>

            </div>

        `;


        container.appendChild(chartItem);

    });

}


/* =========================================
   SUBJECT TARGETS
========================================= */

function getTarget(subject) {

    const saved =
        localStorage.getItem(
            `target_${subject}`
        );


    return saved
        ? Number(saved)
        : 80;
}


function createTargets(marks) {

    const container =
        document.getElementById(
            "targetPerformance"
        );


    container.innerHTML = "";


    subjectIds.forEach((id, index) => {

        const subject =
            subjects[index];


        const mark =
            marks[id];


        const target =
            getTarget(subject);


        const progress =
            Math.min(
                (mark / target) * 100,
                100
            );


        const achieved =
            mark >= target;


        const item =
            document.createElement("div");


        item.className =
            "target-item";


        item.innerHTML = `

            <div class="target-header">

                <span class="target-subject">
                    ${subject}
                </span>

                <span class="target-info">
                    Target: ${target}
                </span>

            </div>


            <div class="target-bar">

                <div
                    class="target-fill"
                    style="width: ${progress}%"
                ></div>

            </div>


            <div class="target-bottom">

                <span>
                    Current: ${mark}
                </span>

                <span class="${
                    achieved
                    ? "target-achieved"
                    : "target-needed"
                }">

                    ${
                        achieved
                        ? "✓ Target Achieved"
                        : `${target - mark} marks needed`
                    }

                </span>

            </div>

        `;


        container.appendChild(item);

    });

}


/* =========================================
   STUDY PLAN
========================================= */

function createStudyPlan(marks) {

    const container =
        document.getElementById(
            "studyPlan"
        );


    const data =
        subjectIds.map((id, index) => {

            return {

                subject: subjects[index],

                marks: marks[id]

            };

        });


    data.sort(
        (a, b) =>
            a.marks - b.marks
    );


    let html =
        `<div class="study-plan">`;


    const durations = [
        50,
        40,
        30,
        25
    ];


    data.forEach((item, index) => {

        html += `

            <div class="study-task">

                <div class="task-time">
                    ${index + 1}
                    . Session
                </div>

                <div>

                    <div class="task-name">
                        📚 Study ${item.subject}
                    </div>

                    <div class="task-duration">
                        Current marks:
                        ${item.marks}/100
                    </div>

                </div>

                <div class="task-duration">
                    ${durations[index]} min
                </div>

            </div>

        `;

    });


    html += `</div>`;


    container.innerHTML =
        html;

}


/* =========================================
   AI STUDY SUGGESTION
========================================= */

function createSuggestion(
    marks,
    percentage,
    grade,
    weakest
) {

    const container =
        document.getElementById(
            "dashboardSuggestion"
        );


    let message = "";


    if (percentage >= 85) {

        message = `
            <strong>Excellent work! 🎉</strong>
            <p>
                Your overall performance is strong.
                Focus on consistency and advanced
                problem solving to improve further.
            </p>
        `;

    } else if (percentage >= 70) {

        message = `
            <strong>Good progress! 💪</strong>
            <p>
                Your performance is good.
                Give extra attention to
                <b>${weakest}</b> and practice
                questions regularly.
            </p>
        `;

    } else if (percentage >= 50) {

        message = `
            <strong>Keep improving! 📚</strong>
            <p>
                Focus on your weak areas,
                revise your concepts and solve
                practice questions every day.
                Start with <b>${weakest}</b>.
            </p>
        `;

    } else {

        message = `
            <strong>Let's build your foundation! 🚀</strong>
            <p>
                Start with basic concepts and
                follow your study planner daily.
                Give priority to <b>${weakest}</b>.
            </p>
        `;

    }


    container.innerHTML = `

        <div class="suggestion-box">

            <div class="suggestion-content">

                🤖

                <div>

                    ${message}

                    <small>
                        Current Grade:
                        <b>${grade}</b>
                    </small>

                </div>

            </div>

        </div>

    `;
}


/* =========================================
   TASK MANAGER
========================================= */

function addTask() {

    const input =
        document.getElementById(
            "taskInput"
        );


    const text =
        input.value.trim();


    if (!text) {

        alert(
            "Please enter a task."
        );

        input.focus();

        return;

    }


    const tasks =
        JSON.parse(
            localStorage.getItem(
                "studentTasks"
            )
        ) || [];


    tasks.push({

        id:
            Date.now(),

        text:
            text,

        completed:
            false

    });


    localStorage.setItem(
        "studentTasks",
        JSON.stringify(tasks)
    );


    input.value = "";


    loadTasks();
}


function loadTasks() {

    const container =
        document.getElementById(
            "taskList"
        );


    if (!container) return;


    const tasks =
        JSON.parse(
            localStorage.getItem(
                "studentTasks"
            )
        ) || [];


    if (tasks.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                📝

                <p>
                    No tasks yet.
                    Add your first assignment.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    tasks.forEach(task => {

        const item =
            document.createElement("div");


        item.className =
            "task-item";


        item.innerHTML = `

            <div class="task-left">

                <input
                    type="checkbox"
                    class="task-checkbox"
                    ${
                        task.completed
                        ? "checked"
                        : ""
                    }
                    onchange="
                        toggleTask(${task.id})
                    "
                >

                <span
                    class="task-text
                    ${
                        task.completed
                        ? "task-completed"
                        : ""
                    }"
                >
                    ${escapeHTML(task.text)}
                </span>

            </div>


            <button
                class="delete-task"
                onclick="
                    deleteTask(${task.id})
                "
                title="Delete task"
            >
                🗑️
            </button>

        `;


        container.appendChild(item);

    });

}


function toggleTask(id) {

    const tasks =
        JSON.parse(
            localStorage.getItem(
                "studentTasks"
            )
        ) || [];


    const task =
        tasks.find(
            item => item.id === id
        );


    if (task) {

        task.completed =
            !task.completed;

    }


    localStorage.setItem(
        "studentTasks",
        JSON.stringify(tasks)
    );


    loadTasks();
}


function deleteTask(id) {

    let tasks =
        JSON.parse(
            localStorage.getItem(
                "studentTasks"
            )
        ) || [];


    tasks =
        tasks.filter(
            task => task.id !== id
        );


    localStorage.setItem(
        "studentTasks",
        JSON.stringify(tasks)
    );


    loadTasks();
}


/* =========================================
   ATTENDANCE
========================================= */

function loadAttendance() {

    const container =
        document.getElementById(
            "attendanceList"
        );


    if (!container) return;


    container.innerHTML = "";


    subjects.forEach((subject, index) => {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    "studentAttendance"
                )
            ) || {};


        const data =
            saved[subject] || {

                attended: 0,

                total: 0

            };


        const item =
            document.createElement("div");


        item.className =
            "attendance-item";


        item.innerHTML = `

            <div class="attendance-header">

                <span class="attendance-subject">
                    ${subject}
                </span>

                <span
                    id="attendancePercent${index}"
                    class="attendance-percent"
                >
                    ${calculateAttendance(
                        data.attended,
                        data.total
                    )}
                </span>

            </div>


            <div class="attendance-inputs">

                <input
                    type="number"
                    id="attended${index}"
                    min="0"
                    placeholder="Classes attended"
                    value="${data.attended || ""}"
                >

                <input
                    type="number"
                    id="totalClasses${index}"
                    min="1"
                    placeholder="Total classes"
                    value="${data.total || ""}"
                >

            </div>


            <div class="attendance-bar">

                <div
                    id="attendanceFill${index}"
                    class="attendance-fill"
                    style="
                        width: ${
                            getAttendanceNumber(
                                data.attended,
                                data.total
                            )
                        }%;
                    "
                ></div>

            </div>


            <button
                class="primary-button"
                style="
                    margin-top: 12px;
                    width: 100%;
                    min-height: 42px;
                    font-size: 13px;
                "
                onclick="
                    saveAttendance(${index})
                "
            >
                💾 Save Attendance
            </button>

        `;


        container.appendChild(item);

    });

}


function calculateAttendance(
    attended,
    total
) {

    if (!total || total <= 0) {

        return "0%";

    }


    const percentage =
        (attended / total) * 100;


    return percentage.toFixed(1) + "%";
}


function getAttendanceNumber(
    attended,
    total
) {

    if (!total || total <= 0) {

        return 0;

    }


    return Math.min(
        (attended / total) * 100,
        100
    );
}


function saveAttendance(index) {

    const attendedInput =
        document.getElementById(
            `attended${index}`
        );


    const totalInput =
        document.getElementById(
            `totalClasses${index}`
        );


    const attended =
        Number(
            attendedInput.value
        );


    const total =
        Number(
            totalInput.value
        );


    if (
        total <= 0 ||
        attended < 0 ||
        attended > total
    ) {

        alert(
            "Please enter valid attendance values."
        );

        return;

    }


    const saved =
        JSON.parse(
            localStorage.getItem(
                "studentAttendance"
            )
        ) || {};


    saved[subjects[index]] = {

        attended: attended,

        total: total

    };


    localStorage.setItem(
        "studentAttendance",
        JSON.stringify(saved)
    );


    const percent =
        getAttendanceNumber(
            attended,
            total
        );


    document.getElementById(
        `attendancePercent${index}`
    ).textContent =
        percent.toFixed(1) + "%";


    document.getElementById(
        `attendanceFill${index}`
    ).style.width =
        percent + "%";


    alert(
        `${subjects[index]} attendance saved.`
    );
}


/* =========================================
   PROFILE
========================================= */

function saveProfile() {

    const name =
        document.getElementById(
            "profileName"
        ).value.trim();


    const course =
        document.getElementById(
            "profileCourse"
        ).value.trim();


    const semester =
        document.getElementById(
            "profileSemester"
        ).value.trim();


    const roll =
        document.getElementById(
            "profileRoll"
        ).value.trim();


    if (!name) {

        alert(
            "Please enter your name."
        );

        return;

    }


    const profile = {

        name,
        course,
        semester,
        roll

    };


    localStorage.setItem(
        "studentProfile",
        JSON.stringify(profile)
    );


    /* Also update student name */

    document.getElementById(
        "studentName"
    ).value = name;


    document.getElementById(
        "welcomeName"
    ).textContent = name;


    const message =
        document.getElementById(
            "profileMessage"
        );


    message.textContent =
        "✓ Profile saved successfully.";


    setTimeout(() => {

        message.textContent = "";

    }, 3000);
}


function loadProfile() {

    const profile =
        JSON.parse(
            localStorage.getItem(
                "studentProfile"
            )
        );


    if (!profile) return;


    document.getElementById(
        "profileName"
    ).value =
        profile.name || "";


    document.getElementById(
        "profileCourse"
    ).value =
        profile.course || "";


    document.getElementById(
        "profileSemester"
    ).value =
        profile.semester || "";


    document.getElementById(
        "profileRoll"
    ).value =
        profile.roll || "";


    if (profile.name) {

        document.getElementById(
            "studentName"
        ).value =
            profile.name;

        document.getElementById(
            "welcomeName"
        ).textContent =
            profile.name;

    }
}


/* =========================================
   PROGRESS HISTORY
========================================= */

function saveHistoryRecord(data) {

    const history =
        JSON.parse(
            localStorage.getItem(
                "studentHistory"
            )
        ) || [];


    history.unshift({

        name: data.name,

        percentage:
            Number(
                data.percentage.toFixed(1)
            ),

        grade: data.grade,

        weakest: data.weakest,

        date:
            new Date().toLocaleString()

    });


    /* Keep latest 10 records */

    if (history.length > 10) {

        history.pop();

    }


    localStorage.setItem(
        "studentHistory",
        JSON.stringify(history)
    );


    loadHistory();
}


function loadHistory() {

    const container =
        document.getElementById(
            "historyList"
        );


    if (!container) return;


    const history =
        JSON.parse(
            localStorage.getItem(
                "studentHistory"
            )
        ) || [];


    if (history.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                📈

                <p>
                    No performance history yet.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    history.forEach(record => {

        const item =
            document.createElement("div");


        item.className =
            "history-item";


        item.innerHTML = `

            <div>

                <div class="history-date">
                    ${escapeHTML(record.date)}
                </div>

                <strong>
                    ${escapeHTML(record.name)}
                </strong>

            </div>


            <div class="history-average">
                ${record.percentage}%
            </div>


            <div class="history-grade">
                ${escapeHTML(record.grade)}
            </div>


            <div class="history-date">
                Focus:
                ${escapeHTML(record.weakest)}
            </div>

        `;


        container.appendChild(item);

    });

}


/* =========================================
   STUDY TIMER
========================================= */

function updateTimerDisplay() {

    const minutes =
        Math.floor(
            timerSeconds / 60
        );


    const seconds =
        timerSeconds % 60;


    const display =
        document.getElementById(
            "timerDisplay"
        );


    if (!display) return;


    display.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


function startTimer() {

    if (timerInterval) return;


    const status =
        document.getElementById(
            "timerStatus"
        );


    status.textContent =
        "🔥 Focus mode started!";


    timerInterval =
        setInterval(() => {

            if (timerSeconds > 0) {

                timerSeconds--;

                updateTimerDisplay();

            } else {

                clearInterval(
                    timerInterval
                );

                timerInterval = null;


                status.textContent =
                    "🎉 Study session complete!";

                alert(
                    "Great job! Your 25-minute study session is complete."
                );

            }

        }, 1000);
}


function pauseTimer() {

    if (timerInterval) {

        clearInterval(
            timerInterval
        );

        timerInterval = null;


        document.getElementById(
            "timerStatus"
        ).textContent =
            "⏸ Timer paused";

    }
}


function resetTimer() {

    clearInterval(
        timerInterval
    );


    timerInterval = null;

    timerSeconds =
        25 * 60;


    updateTimerDisplay();


    document.getElementById(
        "timerStatus"
    ).textContent =
        "Ready to study";
}


/* =========================================
   RESET ACADEMIC DATA
========================================= */

function resetApp() {

    const confirmed =
        confirm(
            "Reset your marks and performance data?"
        );


    if (!confirmed) return;


    document.getElementById(
        "studentName"
    ).value = "";


    subjectIds.forEach(id => {

        document.getElementById(
            id
        ).value = "";

    });


    document.getElementById(
        "welcomeName"
    ).textContent =
        "Student";


    document.getElementById(
        "percentageValue"
    ).textContent =
        "0%";


    document.getElementById(
        "gradeValue"
    ).textContent =
        "-";


    document.getElementById(
        "totalValue"
    ).textContent =
        "0/400";


    document.getElementById(
        "weakSubjectValue"
    ).textContent =
        "-";


    document.getElementById(
        "subjectPerformance"
    ).innerHTML = `

        <div class="empty-state">

            📊

            <p>
                Your performance will appear here.
            </p>

        </div>

    `;


    document.getElementById(
        "marksChart"
    ).innerHTML = "";


    document.getElementById(
        "targetPerformance"
    ).innerHTML = "";


    document.getElementById(
        "studyPlan"
    ).innerHTML = `

        <div class="empty-state">

            📅

            <p>
                Analyze your marks first
                to generate your study plan.
            </p>

        </div>

    `;


    document.getElementById(
        "dashboardSuggestion"
    ).innerHTML = `

        <div class="empty-state">

            📚

            <p>
                Analyze your marks to receive
                personalized study advice.
            </p>

        </div>

    `;


    localStorage.removeItem(
        "studentData"
    );


    alert(
        "Academic data has been reset."
    );


    showSection(
        "performanceSection"
    );
}


/* =========================================
   SECURITY HELPER
========================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================
   LOAD SAVED STUDENT DATA
========================================= */

function loadSavedData() {

    const saved =
        JSON.parse(
            localStorage.getItem(
                "studentData"
            )
        );


    if (!saved) return;


    document.getElementById(
        "studentName"
    ).value =
        saved.name || "";


    document.getElementById(
        "math"
    ).value =
        saved.marks.math;


    document.getElementById(
        "python"
    ).value =
        saved.marks.python;


    document.getElementById(
        "dsa"
    ).value =
        saved.marks.dsa;


    document.getElementById(
        "physics"
    ).value =
        saved.marks.physics;


    /* Rebuild dashboard without
       creating duplicate history */

    calculateResult(false);
}


/* =========================================
   KEYBOARD SUPPORT
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

        /* Ctrl + Enter = Analyze */

        if (
            event.ctrlKey &&
            event.key === "Enter"
        ) {

            calculateResult();

        }


        /* Enter inside task input */

        const taskInput =
            document.getElementById(
                "taskInput"
            );


        if (
            event.key === "Enter" &&
            document.activeElement === taskInput
        ) {

            addTask();

        }

    }
);


/* =========================================
   INITIALIZE APP
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadTheme();

        loadProfile();

        loadTasks();

        loadAttendance();

        loadHistory();

        loadSavedData();

        updateTimerDisplay();

    }
);