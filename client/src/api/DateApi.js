const ONE_DAY_MS = 1000 * 60 * 60 * 24;

/**
 * Extract the number of days from the given day up to today
 * @param {String} dateString 
 * @returns The number of days
 */
const getDaysAgoFrom = (dateString) => {
    const diffDates = new Date().getTime() - new Date(dateString).getTime();

    return Math.round(diffDates / ONE_DAY_MS);
};


export {getDaysAgoFrom}