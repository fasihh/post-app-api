module.exports = res => {
    return res.status(401).json({
        message: 'Auth failed'
    });
}