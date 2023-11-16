document.addEventListener('DOMContentLoaded', function () {
    loadLastUserInput();
    loadRecentDates();
});

function handleEnter(event) {
    if (event.key === 'Enter') {
        calculateWeeks();
    }
}

function calculateWeeks() {
    const dobInput = document.getElementById("dobInput");
    const lifeGrid = document.getElementById("lifeGrid");
    const errorDiv = document.getElementById("error");

    // Hide the grid initially
    lifeGrid.style.display = "none";

    const dob = new Date(dobInput.value);
    const currentDate = new Date();
    const maxAllowedDate = new Date(currentDate.getFullYear() - 90, currentDate.getMonth(), currentDate.getDate());

    if (isNaN(dob.getTime()) || dob > currentDate || dob < maxAllowedDate) {
        errorDiv.textContent = "Please enter a valid date of birth between 90 years ago and today.";
        errorDiv.style.display = "block";
        return;
    }

    errorDiv.textContent = "";
    errorDiv.style.display = "none";

    const availableWidth = window.innerWidth || document.documentElement.clientWidth;
    const optimalColumns = Math.floor(availableWidth / 15); // Assuming each cell has a width of 15px

    lifeGrid.innerHTML = "";

    for (let row = 0; row < 60; row++) {
        for (let col = 0; col < optimalColumns; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");

            const currentWeek = row * optimalColumns + col;

            if (currentWeek < weeksPassed) {
                cell.classList.add("red");
            } else if (currentWeek === weeksPassed) {
                cell.classList.add("yellow");
            } else if (currentWeek - weeksPassed <= 10) {
                cell.classList.add("green");
            }

            lifeGrid.appendChild(cell);
        }
    }

    lifeGrid.style.display = "grid";
    loadRecentDates();
}

function saveDate(date) {
    const recentDates = JSON.parse(localStorage.getItem("recentDates")) || [];
    recentDates.unshift(date.toISOString());
    // Save the last 10 user inputs
    const top10Dates = recentDates.slice(0, 10);
    localStorage.setItem("recentDates", JSON.stringify(top10Dates));

    // Save the current input as the last user input
    saveLastUserInput(dobInput.value);
}

function loadRecentDates() {
    const recentDates = JSON.parse(localStorage.getItem("recentDates")) || [];
    const recentDatesDropdown = document.getElementById("recentDates");
    recentDatesDropdown.innerHTML = '<option value="">Select a recent date</option>';

    recentDates.forEach((date) => {
        const option = document.createElement("option");
        option.value = date;
        option.textContent = new Date(date).toLocaleDateString();
        recentDatesDropdown.appendChild(option);
    });
}

function loadSelectedDate() {
    const selectedDate = document.getElementById("recentDates").value;

    if (selectedDate) {
        // Convert the selected date to the format expected by the date input
        const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
        document.getElementById("dobInput").value = formattedDate;
        calculateWeeks();
    }
}

function saveLastUserInput(input) {
    localStorage.setItem("lastUserInput", input);
}

function loadLastUserInput() {
    const lastUserInput = localStorage.getItem("lastUserInput");
    if (lastUserInput) {
        document.getElementById("dobInput").value = lastUserInput;
        calculateWeeks(); // Automatically calculate weeks if there's a last user input
    }
}

function clearHistory() {
    // Clear the recentDates and lastUserInput from local storage
    localStorage.removeItem("recentDates");
    localStorage.removeItem("lastUserInput");
    // Clear the dropdown options
    document.getElementById("recentDates").innerHTML = '<option value="">Select a recent date</option>';
}

function clearResults() {
    // Clear the lifeGrid and hide it
    document.getElementById("lifeGrid").innerHTML = "";
    document.getElementById("lifeGrid").style.display = "none";

    // Remove cached data related to results
    localStorage.removeItem("recentDates");
    localStorage.removeItem("lastUserInput");
}