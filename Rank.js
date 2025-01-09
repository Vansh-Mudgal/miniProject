async function loadRankings(criteria) {
    // Show loading indication
    document.getElementById("ranking-table-container").classList.add("hidden");

    // Fetch the college data based on the selected criteria
    try {
        const response = await fetch("http://localhost:4000/api/v1/college");
        const data = await response.json();

        if (data.status === 1) {
            const collegesData = data.result.collegesData;

            // Sort the colleges by the selected criteria (ascending order)
            collegesData.sort((a, b) => {
                if (criteria === 'highestPackage' || criteria === 'averagePackage') {
                    // For packages, we need to convert the string to numerical values for proper sorting
                    return parseInt(b[criteria]) - parseInt(a[criteria]);
                } else if (criteria === 'academicFee' || criteria === 'hostelFee') {
                    return parseInt(a[criteria]) - parseInt(b[criteria]);
                } else {
                    return 0; // In case the criteria doesn't match
                }
            });

            // Display the rankings table with the sorted data
            displayRankingTable(collegesData, criteria);
        } else {
            console.error("Failed to fetch college data:", data.message);
        }
    } catch (error) {
        console.error("Error fetching ranking data:", error);
    }
}

function displayRankingTable(collegesData, criteria) {
    const rankingTableBody = document.getElementById("ranking-table-body");
    rankingTableBody.innerHTML = ""; // Clear previous table content

    collegesData.forEach(college => {
        const row = document.createElement("tr");

        // Create the College Name cell
        const collegeNameCell = document.createElement("td");
        collegeNameCell.textContent = college.collegeName;
        row.appendChild(collegeNameCell);

        // Create the Value cell based on the selected criteria
        const valueCell = document.createElement("td");
        valueCell.textContent = college[criteria] || "N/A"; // Display "N/A" if the value is missing
        row.appendChild(valueCell);

        rankingTableBody.appendChild(row);
    });

    // Show the ranking table container
    document.getElementById("ranking-table-container").classList.remove("hidden");
}
