/**
 * Converts an array of objects to a CSV string.
 * @param {Array} data - Array of objects to convert.
 * @param {Array} headers - Optional array of header names.
 * @returns {string} - CSV formatted string.
 */
export const convertToCSV = (data, headers) => {
    if (!data || !data.length) return '';

    const columnHeaders = headers || Object.keys(data[0]);
    const csvRows = [];

    // Add headers
    csvRows.push(columnHeaders.join(','));

    // Add data rows
    for (const row of data) {
        const values = columnHeaders.map(header => {
            const val = row[header];
            const escaped = ('' + val).replace(/"/g, '""');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
};

/**
 * Triggers a browser download of a CSV file.
 * @param {string} csvContent - The CSV string to download.
 * @param {string} fileName - The desired file name.
 */
export const downloadCSV = (csvContent, fileName) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
