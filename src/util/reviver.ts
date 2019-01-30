const JSONDatesReviver = (key: string, val: string) => {
    const isDate = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?:\:\d{2})*\.\d{2,}Z$/.test(val);
    if (isDate) {
        const dateObj = new Date(val);
        return dateObj;
    } else {
        return val;
    }
};

export default JSONDatesReviver;
