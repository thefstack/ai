const optionsDate = {
    month: 'short',
    day: 'numeric'
};

const optionsDateWithYear = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
};

const optionsTime = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
};

const formattedDate = (date) => { 
    const dateObject = new Date(date); // Convert to Date object
    if (isNaN(dateObject)) {
        return "Invalid date"; // Handle invalid date cases
    }

    // Format date and time separately to avoid commas
    const dateString = dateObject.toLocaleDateString('en-US', optionsDate).replace(/,/g, '');
    const timeString = dateObject.toLocaleTimeString('en-US', optionsTime).replace(/,/g, '');

    return `${dateString} ${timeString}`; // Concatenate without commas
};

const formattedDateWithYear = (date) => { 
    const dateObject = new Date(date); // Convert to Date object
    if (isNaN(dateObject)) {
        return "Invalid date"; // Handle invalid date cases
    }

    // Format date and time separately to avoid commas
    const dateString = dateObject.toLocaleDateString('en-US', optionsDateWithYear);

    return `${dateString}`; // Concatenate without commas
};

module.exports={ formattedDate, formattedDateWithYear};
