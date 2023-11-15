document.addEventListener('DOMContentLoaded', function () {
    // Load the last user input
    loadLastUserInput();
    // Load recent dates from local storage
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
        errorDiv.style.display = "block"; // Show the error message
        return;
    }

    errorDiv.textContent = "";  // Clear any previous error message
    errorDiv.style.display = "none"; // Hide the error message

    // Calculate weeks and display the grid
    const weeksPassed = Math.floor((currentDate - dob) / (1000 * 60 * 60 * 24 * 7));

    saveDate(dob);

    lifeGrid.innerHTML = "";

    for (let row = 0; row < 60; row++) {
        for (let col = 0; col < 78; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");

            if (row * 78 + col < weeksPassed) {
                cell.classList.add("red");
            } else if (row * 78 + col === weeksPassed) {
                cell.classList.add("yellow");
            } else if (row * 78 + col - weeksPassed <= 10) {
                cell.classList.add("green");
            }

            lifeGrid.appendChild(cell);
        }
    }

    // Show the grid after validating input
    lifeGrid.style.display = "grid";

    // Load recent dates
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