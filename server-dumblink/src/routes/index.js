require('dotenv').config();
const express = require('express');

// Init express router here..
const router = express.Router();

const {getBrand, getBrands, addBrand, updateBrand, deleteBrand, handleUpload, countVisit} = require('../controllers/links')
const {updateProfile, deleteUser, getUser} = require('../controllers/users')
const {auth} = require('../middlewares/auth')
const {register, login, checkAuth} = require('../controllers/auth')
const {uploadFile} = require('../middlewares/uploadFile')

router.get('/brands', auth, getBrands)
router.get('/brand/:uniqueLink', auth, getBrand)
router.post('/brand', auth, uploadFile('imageLink', 'imageBrand'), addBrand)
router.patch('/brand/:uniqueLink', auth, uploadFile('imageLink', 'imageBrand'), updateBrand)
router.delete('/brand/:id', auth, deleteBrand)
router.get('/visitCount/:id', auth, countVisit)

router.get('/get-user', auth, getUser)
router.patch('/profile-update/:id', auth, updateProfile)
router.delete('/delete-user/:id', auth, deleteUser)

// router.post('/upload', auth, uploadFile("image", "profile"), handleUpload )

router.post('/register', register)
router.post('/login', login)
router.get('/check-auth', auth, checkAuth)


module.exports = router