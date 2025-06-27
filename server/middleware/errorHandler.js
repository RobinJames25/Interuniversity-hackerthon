export const  errorHandler = (err, req, res, next) => {
    const defaultMessage = "We're having technical issues. Please try again later.";

    const { status = 500, message, error } = err;

    if (error) {
        console.log('Error:', error);
    } else {
        console.error('Error:', message || err);
    }

    res.status(status).json({
        success: false,
        message: message || defaultMessage
    })
}