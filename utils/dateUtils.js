/**
 * Returns the current date and time in a formatted string.
 * @returns {string} - Formatted date and time (YYYY-MM-DD HH:mm:ss).
 */
const giveCurrentDateTime = () => {
    // Get the current date and time
    const today = new Date();

    // Extract year, month, and day components
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    // Extract hours, minutes, and seconds components
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    // Combine date and time components into a formatted string
    const dateTime = date + ' ' + time;

    return dateTime;
};

module.exports = { giveCurrentDateTime };
