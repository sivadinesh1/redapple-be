const bcrypt = require('bcrypt')

const encryptPassword = async (password) => {
    try {
     
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('dinesh ...' + hashedPassword);
        return hashedPassword;
    } catch(errors) {
        console.log('log errors ' + errors);
    }
}

const smartTrim = (str, length, delim, appendix) => {
    if (str.length <= length) return str;

    var trimmedStr = str.substr(0, length + delim.length);

    var lastDelimIndex = trimmedStr.lastIndexOf(delim);
    if (lastDelimIndex >= 0) trimmedStr = trimmedStr.substr(0, lastDelimIndex);

    if (trimmedStr) trimmedStr += appendix;
    return trimmedStr;
};

module.exports = {
	encryptPassword,
    smartTrim
};
