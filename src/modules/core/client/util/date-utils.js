import isValid from 'date-fns/isValid';

export const getSlashFormattedDate = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const date = dateObj.getDate();
    return `${year}/${month}/${date}`;
};

export const isDateValid = (date) => {
    const year = date.getFullYear();
    return isValid(date) && !isNaN(year) && year > 0;
};
