const postModel = require('../models/postModel');

exports.getHomePage = async (req, res) => {
 try {
 // Отримуємо 3 останні пости з моделі
 const posts = await new Promise((resolve, reject) => {
 postModel.getAllPosts((err, rows) => {
 if (err) reject(err);
 const latestPosts = rows.slice(-3).reverse();
 resolve(latestPosts);
 });
 });

 // Рендерим шаблон і передаємо пости
 res.render('index', {
 title: 'Головна сторінка',
 posts: posts,
 user: req.user || null
 });
 } catch (err) {
 console.error('Помилка при отриманні постів:', err);
 res.status(500).send('Помилка сервера');
 }
};