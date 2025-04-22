const db = require("../database");
const bcrypt = require("bcrypt");

//Додаємо метод findOne для Passport.js
module.exports = {
    //Пошук користувача по email (для Passport)
    findOne: function(email, callback) {
        db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
            if (err) return callback(err);
            callback(null, row || false);
        });
    },

    //Порівняння паролів
    comparePassword: function(candidatePassword, hash, callback) {
        bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
            if (err) return callback(err);
            callback(null, isMatch);
        });
    },

    getUserByEmail: function(email, callback) {
        this.findOne(email, callback);
    },
    
    registerUser: function(name, email, password, start_weight, age, callback) {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return callback(err);
            
            const registrationDate = new Date().toISOString();
            
            db.run(
                `INSERT INTO users (name, email, password, start_weight, age, registration_date) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [name, email, hashedPassword, parseFloat(start_weight), parseInt(age), registrationDate],
                function (err) {
                    if (err) {
                        console.error("Помилка при додаванні користувача:", err);
                        return callback(err);
                    }
                    callback(null, this.lastID); //Повертаємо id нового користувача
                }
            );
            
        });
    },
    
    updateCurrentWeight: function(userId, weight, callback) {
        if (isNaN(weight)) {
            return callback(new Error('Некоректна вага'));
        }

        db.run(
            `UPDATE users SET current_weight = ? WHERE id = ?`,
            [weight, userId],
            function (err) {
                if (err) {
                    console.error("Помилка при оновленні ваги:", err);
                    return callback(err);
                }
                callback(null);
            }
        );
    }
    
};