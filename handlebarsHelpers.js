module.exports = {
    format: (isTrue) => {
        if (isTrue === true) {
            return "YES";
        } else if (isTrue === false) {
            return "NO";
        } else if (isTrue === null) {
            return "NODATA";
        }
    },
    ifeq: (a, b, options) => {
        if (a === b) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
};
