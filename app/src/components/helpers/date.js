export default function formatDate(dateString) {
    const jsDate = new Date(dateString);
    const day = jsDate.getUTCDate();
    const month = jsDate.getUTCMonth() + 1; // Months are 0-indexed
    const year = jsDate.getUTCFullYear();

    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(month).padStart(2, '0');

    return `${formattedMonth}/${formattedDay}/${year}`;
}
