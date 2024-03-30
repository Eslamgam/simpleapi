

const express = require('express')


const router = express.Router()
const courseController = require('../controller/course.controller')
const verfiyToken = require('../middelware/verfiyToken');
const userRole = require('../utils/userRoles')
// const { validationSchema } = require('../middelware/validationSchema')
const { validationSchema } = require('../middelware/validationSchema');
const allowedTo = require('../middelware/allowedTo');
router.route('/').get(verfiyToken, courseController.getCourses)
    .post(verfiyToken,allowedTo(userRole.MANGER,userRole.ADMIN), validationSchema(), courseController.addCourse)

router.route('/:courseId').get(verfiyToken, courseController.getCourse)
    .patch(verfiyToken,allowedTo(userRole.MANGER,userRole.ADMIN) ,courseController.updateCourse)
    .delete(verfiyToken,allowedTo(userRole.MANGER,userRole.ADMIN) , courseController.deleteCourse)

module.exports = router
