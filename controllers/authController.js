const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

// Сторінка реєстрації
exports.getRegisterPage = (req, res) => {
    res.render("register");
};

// Обробка реєстрації
exports.register = async (req, res) => {
    const { name, email, password, start_weight, age } = req.body;
    
    console.log("Отримані дані для реєстрації:", {
        name, email, 
        start_weight, age
    });

    try {
        // Перевірка існування користувача
        const existingUser = await new Promise((resolve, reject) => {
            User.getUserByEmail(email, (err, user) => {
                if (err) reject(err);
                else resolve(user);
            });
        });

        if (existingUser) {
            console.log("Користувач вже існує:", email);
            return res.status(400).redirect('/error_page');
        }

        // Реєстрація нового користувача
        const userId = await new Promise((resolve, reject) => {
            User.registerUser(
                name, 
                email, 
                password, 
                parseFloat(start_weight), 
                parseInt(age),
                (err, id) => {
                    if (err) reject(err);
                    else resolve(id);
                }
            );
        });

        console.log("Успішна реєстрація. id користувача:", userId);
        
        res.redirect("/");

    } catch (err) {
        console.error("Помилка реєстрації:", {
            error: err.message,
            stack: err.stack
        });
        
        return res.status(500).redirect('/error_page');
    }
};

// Сторінка входу
exports.getLoginPage = (req, res) => {
    console.log("Відображення сторінки входу");
    res.render("login");
};

// Обробка входу
exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Помилка входу:', err);
            return res.status(500).redirect('/error_page');
        }
        
        if (!user) {
            console.log('Невдала спроба входу:', info?.message);
            return res.status(401).redirect('/error_page');
        }
        
        req.logIn(user, (err) => {
            if (err) {
                console.error('Помилка сесії:', err);
                return next(err);
            }
            
            console.log('Успішний вхід:', user.email);
            res.redirect("/");
        });
    })(req, res, next);
};

// Вихід
exports.logout = (req, res, next) => {
    const userEmail = req.user?.email || "Невідомий користувач";
    console.log(`Спроба виходу: ${userEmail}`);
    
    req.logout((err) => {
        if (err) {
            console.error("Помилка при виході:", {
                error: err,
                user: userEmail
            });
            return next(err);
        }
        console.log(`Успішний вихід: ${userEmail}`);
        res.redirect('/');
    });
};
