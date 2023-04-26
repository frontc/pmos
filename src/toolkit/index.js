export const defaultDate = () => {
    let date = new Date();
    let month = date.getMonth();
    if (month === 0) month = 12;
    if (month.toString().length === 1) {
        month = '0' + month;
    }
    return date.getFullYear() + month;
}

export const isNumber = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

export const toFloat = (value) =>{
    if(isNumber(value)) return parseFloat(value);
    return 0;
}