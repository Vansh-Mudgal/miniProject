let allColleges = []; // Variable to store all colleges data

// Function to fetch all colleges when the search bar is focused
async function fetchAllColleges() {
    try {
        const response = await fetch("http://localhost:4000/api/v1/college");
        const data = await response.json();
        
        // Check if the API response is successful
        if (data.status === 1) {
            // Store the fetched colleges data
            allColleges = data.result.collegesData;

            // Extract the college names from the response
            const collegeNames = allColleges.map(college => college.collegeName);
            
            // Call to display the names in the suggestions list
            displaySuggestions(collegeNames);
        } else {
            console.error("Failed to fetch college data:", data.message);
        }
    } catch (error) {
        console.error("Error fetching colleges:", error);
    }
}

// Function to display college names in the suggestion list
function displaySuggestions(collegeNames) {
    const suggestionsList = document.getElementById("suggestions-list");
    suggestionsList.innerHTML = ""; // Clear previous suggestions

    collegeNames.forEach(collegeName => {
        const suggestionItem = document.createElement("li");
        suggestionItem.textContent = collegeName;
        suggestionItem.onclick = () => {
            // Fetch and display the details of the selected college
            const selectedCollege = allColleges.find(college => college.collegeName === collegeName);
            displayCollegeDetails(selectedCollege); // Display the details for the selected college

            document.getElementById("search-bar").value = collegeName;
            suggestionsList.style.display = "none"; // Hide the suggestions once a college is selected
        };
        suggestionsList.appendChild(suggestionItem);
    });

    // Show or hide the suggestions list based on the length of the suggestions
    suggestionsList.style.display = collegeNames.length > 0 ? "block" : "none";
}

// Function to display the college details in a stylish format
function displayCollegeDetails(college) {
    const collegeDetailsContainer = document.getElementById("college-details-container");
    collegeDetailsContainer.innerHTML = ""; // Clear previous details

    const collegeDetailCard = document.createElement("div");
    collegeDetailCard.classList.add("college-detail");

    collegeDetailCard.innerHTML = `
        <h3>${college.collegeName}</h3>
        <p><span class="label">Academic Fee:</span> ${college.academicFee}</p>
        <p><span class="label">Hostel Fee:</span> ${college.hostelFee}</p>
        <p><span class="label">Average Package:</span> ${college.averagePackage}</p>
        <p><span class="label">Highest Package:</span> ${college.highestPackage}</p>
        <p><span class="label">Uniform:</span> ${college.uniform ? "Yes" : "No"}</p>
        <p><span class="label">No. of Students:</span> ${college.totalStudents}</p>
    `;

    collegeDetailsContainer.appendChild(collegeDetailCard);

    // Show the details container
    collegeDetailsContainer.classList.remove("hidden");
    document.getElementById("suggestions-list").style.display = "none"; // Hide suggestions
}

// Event listener for input in the search bar to filter suggestions
function filterSuggestions(event) {
    const query = event.target.value;

    if (query.length > 2) { // Fetch suggestions after 2 characters
        fetchAllColleges();
    }
}

// Handle Enter key to fetch and display college details
function handleEnter(event) {
    if (event.key === "Enter") {
        const searchInput = document.getElementById("search-bar").value;
        // Find the selected college from the stored colleges data
        const selectedCollege = allColleges.find(college => college.collegeName === searchInput);
        if (selectedCollege) {
            displayCollegeDetails(selectedCollege);
        } else {
            console.error("College not found");
        }
    }
}

// Hide suggestions when clicking outside the search bar or suggestions list
function handleClickOutside(event) {
    const searchBar = document.getElementById("search-bar");
    const suggestionsList = document.getElementById("suggestions-list");

    if (!searchBar.contains(event.target) && !suggestionsList.contains(event.target)) {
        suggestionsList.style.display = "none"; // Hide suggestions when clicking outside
    }
}

// Event listener for clicks outside the search bar
document.addEventListener("click", handleClickOutside);
