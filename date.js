exports.getDate = () => {
    const today = new Date();

    const option = {
        weekday: "long",
        month: "long",
        day: "numeric",
    }

    return today.toLocaleString("en-GB", option)

}
exports.getDay = () => {
    const today = new Date();

    const option = {
        weekday: "long",
    }

    return today.toLocaleString("en-GB", option)
}