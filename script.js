// Ensure all logic runs after DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (!loggedInUser) {
        window.location.href = "login.html"; // Redirect to login if not logged in
    }

    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
    const appointmentsList = document.getElementById("appointments-list");

    // Render Appointments
    if (appointmentsList) {
        appointmentsList.innerHTML = "";
        appointments.forEach((appointment, index) => {
            const appointmentElement = document.createElement("div");
            appointmentElement.classList.add("appointment");
            appointmentElement.setAttribute("data-date", appointment.date);

            appointmentElement.innerHTML = `
                <p><strong>Patient:</strong> ${appointment.patient}</p>
                <p><strong>Doctor:</strong> ${appointment.doctor}</p>
                <p><strong>Date:</strong> ${appointment.date}</p>
                <p><strong>Time:</strong> ${appointment.time}</p>
                <p><strong>Status:</strong> ${appointment.completed ? "Completed" : "Pending"}</p>
                <button class="complete-btn" data-index="${index}">Mark as Completed</button>
            `;

            appointmentsList.appendChild(appointmentElement);
        });

        // Mark appointment as completed
        document.querySelectorAll(".complete-btn").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                appointments[index].completed = true;
                localStorage.setItem("appointments", JSON.stringify(appointments));
                alert("Appointment marked as completed!");
                location.reload();
            });
        });
    }

    // Reminder System
    setInterval(() => {
        const now = new Date();
        appointments.forEach((appointment, index) => {
            const appointmentTime = new Date(`${appointment.date}T${appointment.time}`);
            const timeDifference = appointmentTime - now;

            // Show reminder 1 hour before the appointment
            if (timeDifference > 0 && timeDifference < 3600000 && !appointment.reminded) {
                alert(`Reminder: Your appointment with ${appointment.doctor} is in less than an hour.`);
                appointments[index].reminded = true;  // Set reminded flag
            }
        });

        localStorage.setItem("appointments", JSON.stringify(appointments));
    }, 60000); // Check every minute

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById("darkModeToggle");
    if (darkModeToggle) {
        if (localStorage.getItem("darkMode") === "enabled") {
            document.body.classList.add("dark-mode");
        }

        darkModeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            localStorage.setItem("darkMode", document.body.classList.contains("dark-mode") ? "enabled" : "disabled");
        });
    }

    // Search Appointments
    const searchInput = document.getElementById("search");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const searchText = e.target.value.toLowerCase();
            document.querySelectorAll(".appointment").forEach(app => {
                app.style.display = app.innerText.toLowerCase().includes(searchText) ? "block" : "none";
            });
        });
    }

    // Filter Appointments by Date
    const filterDropdown = document.getElementById("filter");
    if (filterDropdown) {
        filterDropdown.addEventListener("change", () => {
            const today = new Date().toISOString().split("T")[0];
            document.querySelectorAll(".appointment").forEach(app => {
                const appDate = app.getAttribute("data-date");
                app.style.display = (filterDropdown.value === "today" && appDate !== today) ? "none" : "block";
            });
        });
    }

    // Calendar View Integration
    if (document.getElementById("calendar")) {
        let calendar = new FullCalendar.Calendar(document.getElementById("calendar"), {
            initialView: "dayGridMonth",
            events: appointments.map(app => ({
                title: `${app.patient} with Dr. ${app.doctor}`,
                start: `${app.date}T${app.time}`,
                allDay: false
            }))
        });
        calendar.render();
    }

    // Logout Button
    document.getElementById("logoutBtn")?.addEventListener("click", function () {
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    });

    // Book Appointment
    window.bookAppointment = function (doctorName) {
        document.getElementById("appointment-form").style.display = "block";
        document.getElementById("doctor-name").value = doctorName;
    };

    // Handle Appointment Form Submission
    document.getElementById("bookingForm")?.addEventListener("submit", function (event) {
        event.preventDefault();

        const patient = document.getElementById("patient-name").value;
        const date = document.getElementById("appointment-date").value;
        const time = document.getElementById("appointment-time").value;
        const doctor = document.getElementById("doctor-name").value;

        // Validate time format (HH:MM)
        const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
        if (!timeRegex.test(time)) {
            alert("Invalid time format. Use HH:MM.");
            return;
        }

        const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
        appointments.push({ patient, date, time, doctor, reminded: false });

        localStorage.setItem("appointments", JSON.stringify(appointments));

        alert("Appointment booked successfully!");
        setTimeout(() => {
            window.location.href = "appointments.html";
        }, 100);
    });

});
//Reminder Functionality
function startReminders() {
    setInterval(() => {
        const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
        const now = new Date();

        appointments.forEach((appointment, index) => {
            if (appointment.reminded) return;  // Skip if already reminded

            const appointmentTime = new Date(`${appointment.date}T${appointment.time}`);
            const timeDifference = appointmentTime - now;

            // Trigger reminder 30 minutes before appointment
            if (timeDifference > 0 && timeDifference <= 30 * 60 * 1000) {
                // Use Alert or Notification API
                if (Notification.permission === "granted") {
                    new Notification(`Reminder: Your appointment with ${appointment.doctor} is in 30 minutes.`);
                } else {
                    alert(`Reminder: Your appointment with ${appointment.doctor} is in 30 minutes.`);
                }

                // Mark as reminded
                appointments[index].reminded = true;
                localStorage.setItem("appointments", JSON.stringify(appointments));
            }
        });
    }, 60000);  // Check every minute
}

// 🌟 Request Notification Permission
function requestNotificationPermission() {
    if (Notification.permission !== "granted") {
        Notification.requestPermission().then((permission) => {
            if (permission !== "granted") {
                alert("Reminders may not appear without notification permissions.");
            }
        });
    }
}

// 🚀 Initialize reminders on page load
document.addEventListener("DOMContentLoaded", () => {
    requestNotificationPermission();
    startReminders();
});

// 🕐 Countdown Timer for Next Appointment
function startAppointmentTimer() {
    const timerDisplay = document.getElementById("countdown-timer");
    const nextAppointmentDisplay = document.getElementById("next-appointment");

    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    // 🛑 Stop existing timer before starting a new one
    if (window.timerInterval) {
        clearInterval(window.timerInterval);
    }

    if (appointments.length === 0) {
        nextAppointmentDisplay.textContent = "No upcoming appointments";
        timerDisplay.textContent = "--:--:--";
        return;
    }

    // Sort appointments by date and time
    appointments.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA - dateB;
    });

    const nextAppointment = appointments[0];
    const appointmentTime = new Date(`${nextAppointment.date}T${nextAppointment.time}`);

    nextAppointmentDisplay.innerHTML = `
        ${nextAppointment.patient} with Dr. ${nextAppointment.doctor} <br>
        on ${nextAppointment.date} at ${nextAppointment.time}
    `;

    function updateTimer() {
        const now = new Date();
        const timeDifference = appointmentTime - now;

        if (timeDifference <= 0) {
            timerDisplay.textContent = "Appointment Time!";
            timerDisplay.classList.remove("warning", "urgent");
            clearInterval(window.timerInterval);
            return;
        }

        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;

        // Update color based on time left
        if (timeDifference < 5 * 60 * 1000) {
            timerDisplay.classList.add("urgent");
            timerDisplay.classList.remove("warning");
        } else if (timeDifference < 30 * 60 * 1000) {
            timerDisplay.classList.add("warning");
            timerDisplay.classList.remove("urgent");
        } else {
            timerDisplay.classList.remove("warning", "urgent");
        }
    }

    // ✅ Restart the timer using global variable
    window.timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
}


//  Initialize the reminder timer on page load
document.addEventListener("DOMContentLoaded", () => {
    startAppointmentTimer();
});
// 🛠️ Function to render appointments
function renderAppointments() {
    const appointmentsList = document.getElementById("appointments-list");
    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    if (!appointmentsList) return;

    appointmentsList.innerHTML = "";

    appointments.forEach((appointment, index) => {
        const appointmentElement = document.createElement("div");
        appointmentElement.classList.add("appointment");
        appointmentElement.setAttribute("data-date", appointment.date);

        // Add "Completed" badge if marked
        const statusText = appointment.completed ? "✅ Completed" : "⏳ Pending";
        const statusClass = appointment.completed ? "completed" : "pending";

        appointmentElement.innerHTML = `
            <p><strong>Patient:</strong> ${appointment.patient}</p>
            <p><strong>Doctor:</strong> ${appointment.doctor}</p>
            <p><strong>Date:</strong> ${appointment.date}</p>
            <p><strong>Time:</strong> ${appointment.time}</p>
            <p class="${statusClass}"><strong>Status:</strong> ${statusText}</p>
            <button class="complete-btn" data-index="${index}">${appointment.completed ? "Undo" : "Mark as Completed"}</button>
        `;

        appointmentsList.appendChild(appointmentElement);
    });

    // Add event listeners for marking appointments as completed
    document.querySelectorAll(".complete-btn").forEach(button => {
        button.addEventListener("click", () => {
            const index = button.getAttribute("data-index");
            
            // Toggle completion status
            appointments[index].completed = !appointments[index].completed;

            // Save changes to localStorage
            localStorage.setItem("appointments", JSON.stringify(appointments));
            
            // Re-render the appointments
            renderAppointments();
        });
    });
}

// 🛠️ Function to remove completed appointments
function removeCompletedAppointments() {
    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    const uncompletedAppointments = appointments.filter(appointment => !appointment.completed);

    if (appointments.length === uncompletedAppointments.length) {
        alert("No completed appointments to remove.");
        return;
    }

    if (confirm("Are you sure you want to remove all completed appointments?")) {
        localStorage.setItem("appointments", JSON.stringify(uncompletedAppointments));

        // 🛑 Stop the existing timer
        clearInterval(window.timerInterval);

        // 🔥 Re-render appointments and restart the timer
        renderAppointments();
        startAppointmentTimer();  // Restart the timer with updated list

        alert("Completed appointments removed successfully!");
    }
}


// 🚀 Initialize the functionality on page load
document.addEventListener("DOMContentLoaded", () => {
    renderAppointments();

    const clearCompletedBtn = document.getElementById("clear-completed-btn");
    
    if (clearCompletedBtn) {
        clearCompletedBtn.addEventListener("click", removeCompletedAppointments);
    }
});
// 🛠️ Check and request notification permissions only if not granted
document.addEventListener("DOMContentLoaded", () => {
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
            if (permission !== "granted") {
                alert("Reminders may not appear without notification permissions.");
            }
        });
    }
});

