export const defaultDate = () => {
    let date = new Date();
    let month = date.getMonth();
    if (month === 0) month = 12;
    if (month.toString().length === 1){
        month='0'+month;
    }
    return date.getFullYear()+month;
}