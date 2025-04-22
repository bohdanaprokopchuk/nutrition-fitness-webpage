const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/userModel');
const db = require("../database");

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        // Використовуємо метод findOne
        const user = await new Promise((resolve, reject) => {
            User.findOne(email, (err, user) => {
                if (err) reject(err);
                else resolve(user);
            });
        });

        if (!user) {
            console.log('Користувача не знайдено:', email);
            return done(null, false, { message: 'Неверний email чи пароль' });
        }

        // Проверяем пароль
        const isMatch = await new Promise((resolve, reject) => {
            User.comparePassword(password, user.password, (err, match) => {
                if (err) reject(err);
                else resolve(match);
            });
        });

        if (!isMatch) {
            console.log('Неправильний пароль користувача:', email);
            return done(null, false, { message: 'Неправильний email чи пароль' });
        }

        console.log('Успішна автентифікація:', email);
        return done(null, user);
    } catch (err) {
        console.error('Помилка автентифікації:', err);
        return done(err);
    }
}));

// Серіалізація користувача
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Десеріалізація користувача
passport.deserializeUser((id, done) => {
    db.get("SELECT * FROM users WHERE id = ?", [id], (err, user) => {
        done(err, user);
    });
});

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});