const db = require("../database");

//Отримати всі пости
exports.getAllPosts = (callback) => {
 db.all(`SELECT posts.id, posts.title, posts.content, posts.image_path, posts.date_created, post_category.title AS category
 FROM posts
 JOIN post_category ON posts.category_id = post_category.id`,
 [], callback);
};

//Отримати пост за id
exports.getPostById = (id, callback) => {
 db.get(`SELECT posts.*, post_category.title AS category
 FROM posts
 JOIN post_category ON posts.category_id = post_category.id
 WHERE posts.id = ?`,
 [id], callback);
};

//Отримати всі категорії
exports.getAllCategories = (callback) => {
 db.all("SELECT * FROM post_category", [], callback);
};

//Додати новий пост
exports.addPost = (title, categoryId, content, image_path, callback) => {
 const date = new Date().toISOString().split("T")[0];
 db.run(`INSERT INTO posts (title, category_id, content, image_path, date_created) VALUES (?, ?, ?, ?, ?)`,
 [title, categoryId, content, image_path, date], callback);
};

//Додати нову категорію
exports.addCategory = (categoryTitle, callback) => {
 db.run(`INSERT INTO post_category (title) VALUES(?)`, [categoryTitle], function (err) {
 if (err) return callback (err);
 callback(null, this.lastID);
 });
};

//Додати новий пост з картинкою
exports.addPostWithImage = (title, categoryId, content, imagePath, callback) => {
    const date = new Date().toISOString().split("T")[0];
    db.run(
        `INSERT INTO posts (title, category_id, content, date_created, image_path) 
         VALUES (?, ?, ?, ?, ?)`,
        [title, categoryId, content, date, imagePath],
        function(err) {
            callback(err);
        }
    );
};

exports.updatePostWithImage = (postId, title, categoryId, content, imagePath, callback) => {
    let query;
    let params;
    
    if (imagePath) {
        query = `UPDATE posts SET title = ?, category_id = ?, content = ?, image_path = ? WHERE id = ?`;
        params = [title, categoryId, content, imagePath, postId];
    } else {
        query = `UPDATE posts SET title = ?, category_id = ?, content = ? WHERE id = ?`;
        params = [title, categoryId, content, postId];
    }
    
    db.run(query, params, function(err) {
        if (err) return callback(err);
        callback(null, this.changes);
    });
};

exports.deletePost = function(postId, callback) {
    db.get("SELECT image_path FROM posts WHERE id = ?", [postId], (err, post) => {
        if (err) return callback(err);
        if (!post) return callback(new Error('Post not found'));
        
        db.run("DELETE FROM posts WHERE id = ?", [postId], function(err) {
            if (err) return callback(err);

            if (post.image_path) {
                const fs = require('fs');
                const path = require('path');
                const imagePath = path.join(__dirname, '../public', post.image_path);
                
                fs.unlink(imagePath, (err) => {
                    if (err) console.error('Error deleting image file:', err);
                    callback(null, this.changes);
                });
            } else {
                callback(null, this.changes);
            }
        });
    });
};