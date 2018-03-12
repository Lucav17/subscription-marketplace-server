module.exports = {
    PORT: process.env.PORT || 3050,
    DATABASE: process.env.DATABASE || 'mongodb://root:pass@ds213259.mlab.com:13259/subscription-marketplace',
    SECRET_KEY: process.env.SECRET_KEY || 'SUB_KEY_SECRET'
};