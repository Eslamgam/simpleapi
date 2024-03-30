
const Course = require('../models/course.model')
const httpStatusText = require('../utils/httpStatusText')
const asyncWrapper = require('../middelware/asyncWrapper')

const { validationResult } = require('express-validator');
const appError = require('../utils/appError')
const getCourses = asyncWrapper(async (req, res) => {
    const query = req.query;

    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;

    const courses = await Course.find().limit(limit).skip(skip)

    return res.status(200).json({ status: httpStatusText.SUCCESS, data: { courses } })


})
const addCourse = asyncWrapper(
    async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const error = appError.create(errors.array(), 400, httpStatusText.FAIL)
            return next(error);
        }
        const { title, price } = req.body
        const newCourse = new Course({
            title,
            price
        })
        await newCourse.save()
        return res.status(200).json({ status: httpStatusText.SUCCESS, data: { newCourse } })
    }
)

const getCourse = asyncWrapper(
    async (req, res, next) => {
        const course = await Course.findById(req.params.courseId)
        if (!course) {
            const error = appError.create('course not found', 404, httpStatusText.ERROR);
            return next(error)
        }
        return res.status(200).json({ status: httpStatusText.SUCCESS, data: { course } })
    }
)


const updateCourse = asyncWrapper(
    async (req, res, next) => {

        const courseId = req.params.courseId
        if (!courseId) {
            const error = appError.create('id not found', 404, httpStatusText.FAIL)
            return next(error)
        }
        const updateCourse = await Course.updateOne({ _id: req.params.courseId }, { $set: { ...req.body } })
        return res.status(200).json({ status: httpStatusText.SUCCESS, data: { updateCourse } })
    }
)

const deleteCourse = asyncWrapper(
    async (req, res, next) => {
        const courseId = req.params.courseId
        const deletedCourse = await Course.deleteOne({ _id: courseId })
        return res.status(200).json({ status: httpStatusText.SUCCESS, data: { deletedCourse } })

    }
)

module.exports = {
    getCourses, addCourse, getCourse, updateCourse, deleteCourse
}