/**
 * Utility to export an array of objects to a CSV file.
 */
export const downloadCSV = (data: any[], fileName: string) => {
    if (!data || data.length === 0) {
        console.warn("No data available for export.");
        return;
    }

    // 1. Get headers from the first object
    const headers = Object.keys(data[0]);
    
    // 2. Format CSV content
    const csvContent = [
        headers.join(','), // Header row
        ...data.map(row => 
            headers.map(header => {
                const cell = row[header] ?? '';
                // Handle nested objects (like category.name) if any
                if (typeof cell === 'object') {
                    return `"${JSON.stringify(cell).replace(/"/g, '""')}"`;
                }
                // Wrap strings with commas in double quotes
                const formattedCell = String(cell).replace(/"/g, '""');
                return formattedCell.includes(',') ? `"${formattedCell}"` : formattedCell;
            }).join(',')
        )
    ].join('\n');

    // 3. Create blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${fileName}_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
