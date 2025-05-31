export const otpGenerator = (digits) => {
    return digits === "4"
        ? Math.floor(1000 + Math.random() * 9000).toString()
        : Math.floor(100000 + Math.random() * 900000).toString();
};
