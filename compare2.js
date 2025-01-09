let allColleges = []; // Variable to store all colleges data
let selectedColleges = []; // Variable to store selected colleges for comparison

// Fetch all colleges when the search bar is focused or typed into
async function fetchAllColleges(query = "") {
    try {
        const response = await fetch("http://localhost:4000/api/v1/college");
        const data = await response.json();

        if (data.status === 1) {
            allColleges = data.result.collegesData;

            // Filter colleges based on query
            const filteredColleges = allColleges.filter(college =>
                college.collegeName.toLowerCase().includes(query.toLowerCase())
            );

            // Call to display filtered colleges in the suggestion list
            displaySuggestions(filteredColleges);
        } else {
            console.error("Failed to fetch college data:", data.message);
        }
    } catch (error) {
        console.error("Error fetching colleges:", error);
    }
}

// Display filtered colleges in the suggestion list
function displaySuggestions(colleges) {
    const suggestionsList = document.getElementById("compare-suggestions-list");
    suggestionsList.innerHTML = ""; // Clear previous suggestions

    colleges.forEach(college => {
        const suggestionItem = document.createElement("li");
        suggestionItem.textContent = college.collegeName;
        suggestionItem.onclick = () => {
            // Add college to the selected list
            addCollegeToCompare(college);
            document.getElementById("compare-search-bar").value = college.collegeName;
            suggestionsList.style.display = "none"; // Hide suggestions once a college is selected
        };
        suggestionsList.appendChild(suggestionItem);
    });

    // Show or hide the suggestion list based on the number of suggestions
    suggestionsList.style.display = colleges.length > 0 ? "block" : "none";
}

// Handle input change in the search bar to filter suggestions
function filterCompareSuggestions(event) {
    const query = event.target.value;
    if (query.length > 2) { // Fetch suggestions after typing 3 characters
        fetchAllColleges(query);
    }
}

// Handle "Enter" key to select a college
function handleCompareEnter(event) {
    if (event.key === "Enter") {
        const searchInput = document.getElementById("compare-search-bar").value;
        const selectedCollege = allColleges.find(college => college.collegeName === searchInput);
        if (selectedCollege) {
            addCollegeToCompare(selectedCollege);
        }
    }
}

// Add a college to the selected colleges list (up to 4 colleges)
function addCollegeToCompare(college) {
    if (selectedColleges.length < 4) {
        selectedColleges.push(college);
        displaySelectedColleges();
    } else {
        alert("You can only compare up to 4 colleges.");
    }
}

// Display selected colleges in the college selection section
function displaySelectedColleges() {
    const selectedCollegesContainer = document.getElementById("selected-colleges");
    selectedCollegesContainer.innerHTML = ""; // Clear previous selections

    selectedColleges.forEach(college => {
        const collegeItem = document.createElement("div");
        collegeItem.classList.add("selected-college");
        collegeItem.textContent = college.collegeName;
        selectedCollegesContainer.appendChild(collegeItem);
    });
}

// Compare the selected colleges and display details in a vertical table
async function compareColleges() {
    if (selectedColleges.length < 2) {
        alert("Please select at least two colleges to compare.");
        return;
    }

    // Fetch and display the comparison details of selected colleges
    await fetchCollegeComparisonDetails();
}

// Fetch detailed information for the selected colleges
async function fetchCollegeComparisonDetails() {
    try {
        // Fetch details for each selected college using its ID
        const collegeDetailsPromises = selectedColleges.map(college =>
            fetch(`http://localhost:4000/api/v1/college/${college.id}`) // Pass the specific college ID
                .then(res => res.json())
                .then(data => data.result) // Ensure we get the college data from the response
                .catch(error => {
                    console.error("Error fetching college details for ID:", college.id, error);
                    return null; // In case of an error, we return null to handle it gracefully
                })
        );

        const collegeDetails = await Promise.all(collegeDetailsPromises);

        // Filter out any null values if a fetch failed
        const validCollegeDetails = collegeDetails.filter(detail => detail !== null);

        // Display the comparison table with the fetched details
        displayComparisonTable(validCollegeDetails);
    } catch (error) {
        console.error("Error fetching college details:", error);
    }
}

// Display the comparison table with college details in vertical format
function displayComparisonTable(colleges) {
    const comparisonTableBody = document.getElementById("comparison-table-body");
    const comparisonTableHeader = document.querySelector("#comparison-table thead tr");
    comparisonTableBody.innerHTML = ""; // Clear previous table content
    comparisonTableHeader.innerHTML = ""; // Clear previous header content

    // Column headers (attributes) for the college details
    const attributes = [
        "College Name", 
        "Academic Fee", 
        "Hostel Fee", 
        "Average Package", 
        "Highest Package", 
        "Uniform", 
        "Total Students"
    ];

    // Dynamically create college name headers in the first row of the table header
    const collegeNameHeader = document.createElement("th");
    collegeNameHeader.textContent = "College Name"; // "College Name" should always be the first header in the table
    comparisonTableHeader.appendChild(collegeNameHeader);

    // Dynamically add a header for each selected college
    colleges.forEach(college => {
        const collegeNameHeader = document.createElement("th");
        collegeNameHeader.textContent = college.collegeExists?.collegeName || "N/A"; // Default to "N/A" if missing
        comparisonTableHeader.appendChild(collegeNameHeader);
    });

    // For each attribute, create a row
    attributes.forEach(attribute => {
        const row = document.createElement("tr");

        // Column for the attribute (on the left)
        const attributeCell = document.createElement("td");
        attributeCell.textContent = attribute;
        row.appendChild(attributeCell);

        // For each college, display its detail for this attribute in the corresponding column
        colleges.forEach(college => {
            const cell = document.createElement("td");

            // Get the college detail based on the attribute
            switch (attribute) {
                case "College Name":
                    cell.textContent = college.collegeExists?.collegeName || "N/A";  // Default to "N/A" if the field is missing
                    break;
                case "Academic Fee":
                    cell.textContent = college.collegeExists?.academicFee || "N/A";
                    break;
                case "Hostel Fee":
                    cell.textContent = college.collegeExists?.hostelFee || "N/A";
                    break;
                case "Average Package":
                    cell.textContent = college.collegeExists?.averagePackage || "N/A";
                    break;
                case "Highest Package":
                    cell.textContent = college.collegeExists?.highestPackage || "N/A";
                    break;
                case "Uniform":
                    cell.textContent = college.collegeExists?.uniform === "true" ? "Yes" : "No";  // Convert string "true" to Yes and "false" to No
                    break;
                case "Total Students":
                    cell.textContent = college.collegeExists?.totalStudents || "N/A";
                    break;
                default:
                    cell.textContent = "N/A";
            }

            row.appendChild(cell);
        });

        comparisonTableBody.appendChild(row);
    });

    // Show the comparison table container
    document.getElementById("comparison-table-container").classList.remove("hidden");
}




// Event listener for clicks outside the search bar to hide suggestions
document.addEventListener("click", (event) => {
    const searchBar = document.getElementById("compare-search-bar");
    const suggestionsList = document.getElementById("compare-suggestions-list");

    if (!searchBar.contains(event.target) && !suggestionsList.contains(event.target)) {
        suggestionsList.style.display = "none"; // Hide suggestions
    }
});

// Show suggestions when the search bar is clicked
document.getElementById("compare-search-bar").addEventListener("focus", function() {
    fetchAllColleges(); // Fetch all colleges when the search bar is clicked
});

// Event listener for input in the search bar to filter suggestions
document.getElementById("compare-search-bar").addEventListener("input", filterCompareSuggestions);

// Event listener for "Enter" key in the search bar
document.getElementById("compare-search-bar").addEventListener("keydown", handleCompareEnter);

// Compare button click event listener
document.getElementById("compare-button").addEventListener("click", compareColleges);
