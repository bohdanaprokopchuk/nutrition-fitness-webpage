const Post = require("../models/postModel");
const upload = require('../middleware/upload');

// Отримати список постів
exports.getPosts = (req, res) => {
    Post.getAllPosts((err, posts) => {
        if (err) return res.status(500).send("Помилка БД");
        res.render("posts", {
            posts,
            user: req.user || null
        });
    });
};

// Отримати один пост за id
exports.getPostById = (req, res) => {
    Post.getPostById(req.params.id, (err, post) => {
        if (err || !post) return res.status(404).send("Даний пост не знайдений");
        res.render("post", {
            post,
            user: req.user || null
        });
    });
};

// Форма додавання посту
exports.getNewPostForm = (req, res) => {
    Post.getAllCategories((err, categories) => {
        if (err) return res.status(500).send("Помилка БД");
        res.render("new_post", {
            categories,
            user: req.user || null
        });
    });
};

// Створення нового поста з зображенням
exports.createPost = [
    upload.single('post_image'),
    
    (req, res) => {
        const { title, content, category, new_category } = req.body;
        
        // Шлях до зображень
        const imagePath = req.file ? '/uploads/posts/' + req.file.filename : null;

        // Виводимо інформацію про файл в консоль
        console.log('Зображення:', req.file);
        if (req.file) {
            console.log('Властивості файлу:', {
                originalname: req.file.originalname,
                filename: req.file.filename,
                size: req.file.size,
                mimetype: req.file.mimetype,
                path: req.file.path
            });
        } else {
            console.log('Зображення не було завантажено');
        }
        
        // Функція для обробки категорії
        const handleCategory = (callback) => {
            if (new_category && new_category.trim() !== '') {
                Post.addCategory(new_category.trim(), (err, newCategoryId) => {
                    if (err) {
                        return res.status(500).send("Помилка додавання категорії");
                    }
                    callback(newCategoryId);
                });
            } else {
                callback(category);
            }
        };

        handleCategory((categoryId) => {
            Post.addPostWithImage(
                title,
                categoryId,
                content,
                imagePath,
                (err) => {
                    if (err) {
                        return res.status(500).send("Помилка додавання посту");
                    }
                    res.redirect("/blog");
                }
            );
        });
    }
];

// Отримати пости за категорією
exports.getPostsByCategory = (req, res) => {
    const categoryName = req.params.category_name;

    Post.getPostsByCategory(categoryName, (err, posts) => {
        if (err) return res.status(500).send("Помилка бази даних");
        if (!posts || posts.length === 0) {
            return res.status(404).send("У цій категорії немає постів");
        }
        res.render("category_posts", { 
            categoryName, 
            posts,
            user: req.user || null
        });
    });
};

exports.getEditPostForm = (req, res) => {
    Post.getPostById(req.params.id, (err, post) => {
        if (err || !post) return res.status(404).send("Даний пост не знайдений");
        
        Post.getAllCategories((err, categories) => {
            if (err) return res.status(500).send("Помилка БД");
            
            res.render("edit_post", {
                post,
                categories,
                user: req.user || null
            });
        });
    });
};


// Редагування посту
exports.editPost = [
    upload.single('post_image'),
    
    (req, res) => {
        const { id, title, content, category, new_category } = req.body;
        const imagePath = req.file ? '/uploads/posts/' + req.file.filename : null;

        // Функція обробки категорії
        const handleCategory = (callback) => {
            if (new_category && new_category.trim() !== '') {
                Post.addCategory(new_category.trim(), (err, newCategoryId) => {
                    if (err) {
                        if (req.file) {
                            fs.unlinkSync(path.join(__dirname, '../public/uploads/posts', req.file.filename));
                        }
                        return res.status(500).send("Помилка додавання категорії");
                    }
                    callback(newCategoryId);
                });
            } else {
                callback(category);
            }
        };

        handleCategory((categoryId) => {
            Post.updatePostWithImage(
                id,
                title,
                categoryId,
                content,
                imagePath,
                (err) => {
                    if (err) {
                        if (req.file) {
                            fs.unlinkSync(path.join(__dirname, '../public/uploads/posts', req.file.filename));
                        }
                        return res.status(500).send("Помилка оновлення посту");
                    }
                    res.redirect(`/post/${id}`);
                }
            );
        });
    }
];

exports.deletePost = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Необхідно авторизуватися' });
    }

    const postId = req.params.id;
    
    Post.deletePost(postId, (err) => {
        if (err) {
            console.error('Помилка при видаленні посту:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Помилка сервера при видаленні посту' 
            });
        }
        
        res.json({ 
            success: true,
            message: 'Пост успішно видалено'
        });
    });
};