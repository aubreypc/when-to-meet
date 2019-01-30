const JSONDatesReviver = (key: string, val: string | number) => {
    console.log(val);
    const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
    if (typeof(val) == "string" && dateFormat.test(val)) {
        return new Date(val);
    } else {
        return val;
    }
};

export default JSONDatesReviver;
