const JSONDatesReviver = (key: string, val: string) => {
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?:\:\d{2})*\.\d{2,}Z$/.test(val)) {
        return new Date(val);
    } else {
        return val;
    }
};

export default JSONDatesReviver;
