const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

// Підключення до бази даних у файлі
const db = new sqlite3.Database("./fitness.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error("Помилка при підключенні до бази даних:", err.message);
    } else {
        console.log("Успішно підключено до бази даних SQLite.");
    }
});

// Допоміжна функція для виконання SQL-запитів
const runQuery = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                console.error("Помилка виконання запиту:", { sql, error: err.message });
                reject(err);
            } else {
                resolve(this);
            }
        });
    });
};

// Функція ініціалізації таблиць
const initializeDatabase = async () => {
    try {
        await runQuery(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                start_weight REAL,
                current_weight REAL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                age INTEGER,
                registration_date DATETIME NOT NULL DEFAULT (datetime('now')),
                last_visit_date DATETIME
            )
        `);

        await runQuery(`
            CREATE TABLE IF NOT EXISTS post_category (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL UNIQUE
            )
        `);

        await runQuery(`
            CREATE TABLE IF NOT EXISTS posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                category_id INTEGER NOT NULL,
                content TEXT NOT NULL,
                date_created DATETIME NOT NULL,
                image_path TEXT,
                FOREIGN KEY (category_id) REFERENCES post_category(id)
            )
        `);

        await runQuery(`
            CREATE TABLE IF NOT EXISTS feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL,
                message TEXT NOT NULL,
                submitted_at DATETIME NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (email) REFERENCES users(email)
            )

        `);

        await runQuery(`
            CREATE TABLE IF NOT EXISTS user_plans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                plan_type TEXT NOT NULL,
                plan_data TEXT NOT NULL,
                saved_at DATETIME NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        await runQuery(`
            CREATE TABLE IF NOT EXISTS workouts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                start_time DATETIME NOT NULL,
                end_time DATETIME,
                weight REAL,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        console.log("Таблиці перевірено або створено");

        // Додаємо тестового користувача, якщо його ще немає
        await addTestAdminIfMissing();

    } catch (err) {
        console.error("Помилка ініціалізації БД:", err);
    }
};

const addTestAdminIfMissing = async () => {
    db.get("SELECT * FROM users WHERE email = ?", ['admin@example.com'], async (err, row) => {
        if (err) {
            console.error("Помилка пошуку користувача:", err.message);
        } else if (!row) {
            const hashedPassword = await bcrypt.hash("adminadmin", 10);
            await runQuery(
                `INSERT INTO users (name, email, password, start_weight, current_weight, age)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                ['Admin', 'admin@example.com', hashedPassword, 85.5, 82.0, 30]
            );
            console.log("Тестовий користувач 'admin@example.com' доданий");
        } else {
            console.log("Тестовий користувач вже існує");
        }
    });
};

initializeDatabase();

module.exports = db;
