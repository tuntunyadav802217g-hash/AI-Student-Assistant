// =====================================
// AI Student Assistant - Authentication
// =====================================


// =====================================
// SIGNUP
// =====================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", function (event) {

        event.preventDefault();

        // Get signup values
        const name = document
            .getElementById("signupName")
            .value
            .trim();

        const email = document
            .getElementById("signupEmail")
            .value
            .trim()
            .toLowerCase();

        const password = document
            .getElementById("signupPassword")
            .value;

        const confirmPassword = document
            .getElementById("confirmPassword")
            .value;


        // Check password
        if (password.length < 6) {

            alert("Password must be at least 6 characters. ❌");

            return;
        }


        // Check confirm password
        if (password !== confirmPassword) {

            alert("Passwords do not match. ❌");

            return;
        }


        // Check existing account
        const existingUser =
            JSON.parse(localStorage.getItem("studentUser"));

        if (existingUser && existingUser.email === email) {

            alert("An account with this email already exists. ❌");

            window.location.href = "login.html";

            return;
        }


        // Create student account
        const studentUser = {

            name: name,

            email: email,

            password: password
        };


        // Save account
        localStorage.setItem(
            "studentUser",
            JSON.stringify(studentUser)
        );


        alert("Account created successfully! 🎉");


        // Go to login
        window.location.href = "login.html";

    });

}


// =====================================
// LOGIN
// =====================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();


        // Get login values
        const email = document
            .getElementById("loginEmail")
            .value
            .trim()
            .toLowerCase();

        const password = document
            .getElementById("loginPassword")
            .value;


        // Get saved account
        const savedUser =
            JSON.parse(localStorage.getItem("studentUser"));


        // Account doesn't exist
        if (!savedUser) {

            alert("No account found. Please create an account first. ❌");

            window.location.href = "signup.html";

            return;
        }


        // Check login details
        if (
            email === savedUser.email &&
            password === savedUser.password
        ) {

            // Create login session
            localStorage.setItem(
                "studentLoggedIn",
                "true"
            );


            // Save current student
            localStorage.setItem(
                "currentStudent",
                JSON.stringify(savedUser)
            );


            alert("Login successful! 🎉");


            // Open dashboard
            window.location.href = "index.html";

        } else {

            alert("Incorrect email or password. ❌");

        }

    });

}

// =====================================
// 🔑 FORGOT PASSWORD
// =====================================

const forgotPasswordForm =
    document.getElementById("forgotPasswordForm");

if (forgotPasswordForm) {

    forgotPasswordForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const email =
                document
                    .getElementById("resetEmail")
                    .value
                    .trim()
                    .toLowerCase();

            const newPassword =
                document
                    .getElementById("newPassword")
                    .value;

            const confirmNewPassword =
                document
                    .getElementById("confirmNewPassword")
                    .value;


            // Get saved account
            const savedUser =
                JSON.parse(
                    localStorage.getItem("studentUser")
                );


            // Check account
            if (!savedUser) {

                alert(
                    "No account found. Please create an account first. ❌"
                );

                window.location.href =
                    "signup.html";

                return;
            }


            // Check email
            if (email !== savedUser.email) {

                alert(
                    "No account found with this email. ❌"
                );

                return;
            }


            // Check password length
            if (newPassword.length < 6) {

                alert(
                    "Password must be at least 6 characters. ❌"
                );

                return;
            }


            // Check passwords
            if (newPassword !== confirmNewPassword) {

                alert(
                    "Passwords do not match. ❌"
                );

                return;
            }


            // Update password
            savedUser.password = newPassword;


            // Save updated account
            localStorage.setItem(
                "studentUser",
                JSON.stringify(savedUser)
            );


            alert(
                "Password reset successfully! 🎉"
            );


            // Go to login
            window.location.href =
                "login.html";

        }
    );
}