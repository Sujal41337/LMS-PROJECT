 let currentCourseIndex = null;
    let correctAnswer = 4;

// REGISTER
function register() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let role = document.getElementById("role").value;
   
    if(email === "admin@gmail.com"){
        role = "admin";
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    users.push({
    id: Date.now(),
    name,
    email,
    password,
    role
});

    localStorage.setItem("users", JSON.stringify(users));

    alert("Registered Successfully!");
    window.location.href = "index.html";
}

// LOGIN
function login() {
    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid Credentials");
    }
}

// LOAD DASHBOARD
function loadDashboard() {
    let user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("welcome").innerText =
        "Welcome " + user.name + " (" + user.role + ")";

    // Hide instructor panel by default
    document.getElementById("instructorPanel").style.display = "none";

    if (user.role === "instructor") {
        document.getElementById("instructorPanel").style.display = "block";
        displayCourses();
    }

    else if (user.role === "student") {
        displayCourses();
    }

    else if (user.role === "admin") {
        showAdminPanel();
    }
}


// ADD COURSE
function addCourse() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    let title = document.getElementById("courseTitle").value;
    let desc = document.getElementById("courseDesc").value;

    let courses = JSON.parse(localStorage.getItem("courses")) || [];

    courses.push({
        id: Date.now(),
        title: title,
        description: desc,
        instructorId: user.id,
        completedBy: []
    });

    localStorage.setItem("courses", JSON.stringify(courses));

    displayCourses();
}


// DISPLAY COURSES
function displayCourses() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    let courses = JSON.parse(localStorage.getItem("courses")) || [];
    let courseList = document.getElementById("courseList");

    courseList.innerHTML = "";

    courses.forEach((course, index) => {

        let progress = course.completedBy.includes(user.id) ? 100 : 0;

        courseList.innerHTML += `
            <div class="course-card">
                <h4>${course.title}</h4>
                <p>${course.description}</p>

                ${user.role === "student" ? `
                    <button onclick="startQuiz(${index})">Take Quiz</button>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width:${progress}%">
                            ${progress}%
                        </div>
                    </div>
                ` : ""}

                ${user.role === "instructor" ? `
                    <button onclick="deleteCourse(${index})">Delete Course</button>
                    <p>Completed Students: ${course.completedBy.length}</p>
                ` : ""}
            </div>
        `;
    });
}
// QUIZ
function startQuiz(index) {
    currentCourseIndex = index;

    document.getElementById("quizSection").style.display = "block";
    document.getElementById("quizQuestion").innerText = "What is 2 + 2?";

    document.getElementById("quizOptions").innerHTML = `
        <label><input type="radio" name="quiz" value="3"> 3</label><br>
        <label><input type="radio" name="quiz" value="4"> 4</label><br>
        <label><input type="radio" name="quiz" value="5"> 5</label>
    `;
}
// SUBMIT QUIZ 
function submitQuiz() {
    let selected = document.querySelector('input[name="quiz"]:checked');

    if (!selected) {
        alert("Select an answer!");
        return;
    }

    let user = JSON.parse(localStorage.getItem("currentUser"));
    let courses = JSON.parse(localStorage.getItem("courses"));

    if (parseInt(selected.value) === correctAnswer) {
        alert("Correct!");

        if (!courses[currentCourseIndex].completedBy.includes(user.id)) {
            courses[currentCourseIndex].completedBy.push(user.id);
        }

        localStorage.setItem("courses", JSON.stringify(courses));
    } else {
        alert("Wrong Answer!");
    }

    document.getElementById("quizSection").style.display = "none";
    displayCourses();
}

// DELETE COURSE
function deleteCourse(index) {
    let courses = JSON.parse(localStorage.getItem("courses")) || [];

    courses.splice(index, 1);

    localStorage.setItem("courses", JSON.stringify(courses));

    displayCourses();
}


// LOGOUT
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}
function showAdminPanel() {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let output = "<h3>All Users</h3>";

    users.forEach(u => {
        output += `<p>${u.name} - ${u.role}</p>`;
    });

    document.getElementById("courseList").innerHTML = output;
}
