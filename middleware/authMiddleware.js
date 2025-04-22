module.exports = {
    isAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/auth/login');
    },
    
    isAdmin: (req, res, next) => {
        if (req.isAuthenticated() && req.user.id === 1) {
            return next();
        }
        res.redirect('/');
    }
};

