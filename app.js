const express = require("express");
const path = require("path");
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");

const postController = require("./controllers/postController");
const authRoute = require("./routes/authRoute");
const { isAuthenticated, isAdmin } = require('./middleware/authMiddleware');
const workoutRoutes = require('./routes/workout');
const analyticsRoutes = require('./routes/analytics');
const planController = require("./controllers/planController");
require("./config/passport");
const locatorRouter = require("./routes/locator");
const feedbackRoute = require("./routes/feedback");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Налаштування Express Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

//Налаштування сесії
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

app.use(passport.initialize());
app.use(passport.session());

//Основні маршрути
app.use(express.static("public"));
app.use("/", require("./routes/index"));
app.get("/blog", postController.getPosts);
app.delete('/post/:id', isAdmin, postController.deletePost);
app.get("/post/:id", postController.getPostById);

//Захищені маршрути
app.get("/new-post", isAdmin, postController.getNewPostForm);
app.post("/new-post", isAdmin, postController.createPost);
app.get("/edit-post/:id", isAdmin, postController.getEditPostForm);
app.post("/edit-post/:id", isAdmin, postController.editPost);

app.use("/programs", require("./routes/programs"));
app.use("/plans", require("./routes/plans"));
app.use("/my-programs", isAuthenticated, require("./routes/myprograms"));
app.use("/analyze", isAuthenticated, require("./routes/analyze"));

//Інші маршрути
app.use("/locator", locatorRouter);
app.use('/feedback', feedbackRoute);
app.use("/calculator", require("./routes/calculator"));
app.use("/auth", authRoute);

app.post('/api/save-exercise-plan', isAuthenticated, planController.saveExercisePlan);
app.post('/api/save-diet-plan', isAuthenticated, planController.saveDietPlan);
app.get('/api/get-plans', isAuthenticated, planController.getUserPlans);
app.use('/api/workouts', workoutRoutes);
app.use('/api/analytics', analyticsRoutes);

//Обработка 404
app.use((req, res, next) => {
  res.status(404).render('error_page', { status: 404, message: 'Сторінку не знайдено' });
});

module.exports = app;
