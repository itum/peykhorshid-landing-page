const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// مسیرهای مربوط به کوییز اصلی
router.get('/users', (req, res) => quizController.getAllUsers(req, res));
router.post('/users', (req, res) => quizController.addUser(req, res));
router.post('/submit', (req, res) => quizController.updateUser(req, res));

// مسیرهای مربوط به کوییز دوم
router.post('/quiz2', (req, res) => quizController.createQuiz2(req, res));
router.post('/quiz2/submit', (req, res) => quizController.submitQuiz2(req, res));
router.get('/quiz2/users', (req, res) => quizController.getAllQuiz2Users(req, res));

module.exports = router; 