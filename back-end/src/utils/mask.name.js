const maskName = (fullName) => {
    if (!fullName) return "Khách hàng";
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0) + "***";
    const lastName = nameParts[nameParts.length - 1];
    return fullName.replace(lastName, lastName.charAt(0) + "***");
};

module.exports = maskName;