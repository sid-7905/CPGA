export function CombineHeatMapData(codeChefData, codeForcesData, leetCodeData) {
    const combinedMap = {};

    [...codeChefData, ...codeForcesData, ...leetCodeData].forEach((entry) => {
        // Normalize the date to 'YYYY-MM-DD' format
        const date = new Date(entry.date).toISOString().split("T")[0];

        if (combinedMap[date]) {
            combinedMap[date] += entry.value;
        } else {
            combinedMap[date] = entry.value;
        }
    });

    return Object.entries(combinedMap).map(([date, value]) => ({ date, value }));
}



export function ConvertCFData(result) {
    if(!result || result.length === 0) return null;
    const dataMap = {};
    const solvedMap = {};
    let count = 0;
    result.forEach((submission) => {
            const date = new Date(submission.creationTimeSeconds * 1000)
                .toISOString()
                .split("T")[0]; // Extract the date in YYYY-MM-DD format

            if (dataMap[date]) {
                dataMap[date] += 1; // Increment the value for successful submissions
            } else {
                dataMap[date] = 1; // Initialize the value for the date
            }
            if (submission.verdict === "OK" && !solvedMap[submission.problem.name]) {
                    count++;
                    solvedMap[submission.problem.name] = true;
            }
    });
    // console.log(count);
    // Convert the dataMap object into an array of objects
    return { "heatMapData": Object.entries(dataMap).map(([date, value]) => ({ date, value })),"solved":count};
}

export function ConvertLCData(submissionCalendar) {
    if (!submissionCalendar) return null;
    
    // Parse the JSON string if it's a string
    const parsedData = typeof submissionCalendar === 'string' 
        ? JSON.parse(submissionCalendar) 
        : submissionCalendar;
    
    // Convert the data to array of objects with date and value
    const heatMap = Object.entries(parsedData).map(([timestamp, value]) => {
        // Convert Unix timestamp to Date object
        const date = new Date(parseInt(timestamp, 10) * 1000)
            .toISOString()
            .split("T")[0]; // Convert to YYYY-MM-DD format
        
        return {
            date,
            value: parseInt(value, 10) // Ensure value is a number
        };
    });

    // Sort by date to ensure chronological order
    heatMap.sort((a, b) => new Date(a.date) - new Date(b.date));

    return heatMap;
}

