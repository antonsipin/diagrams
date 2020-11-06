const express = require('express');
const router = express.Router();
const newTripController = require('../controllers/newtrip-controller')
const newMailController = require('../controllers/mail-controller')

router
  .route('/')
  .get(newTripController.renderNewDiagram)
  .post(newTripController.createNewDiagram)

router
  .route('/category')
  .get(newTripController.renderCreateCategory)
  .post(newTripController.createNewCategory)

router
  .route('/addcategory')
  .post(newTripController.addCategory)

router
  .route('/category/castomize')
  .get(newTripController.renderCastomizeCategory)
  .post(newTripController.castomizeCategory)

router
  .route('/category/castomize/save')
  .get(newTripController.renderSavedCastomizeCategory)
  .post(newTripController.saveCastomizeCategory)

router
  .route('/report')
  .get(newTripController.renderTripReport)

router
  .route('/allTrips')
  .get(newTripController.allTrips)

router
  .route('/doughnut')
  .get(newTripController.renderDoughnut)
  .post(newTripController.createDoughnut)

  router
  .route('/qrCode')
  .get(newTripController.renderQR)
  .post(newTripController.createQr)
  

router
  .route('/google')
  .get(newTripController.renderGoogle)

router
  .route('/mail')
  .post(newMailController.sendMail)

router
  .route('/:id')
  .get(newTripController.findTripById)

router
  .route('/category/edit/:id')
  .post(newTripController.editCategoryEqually)

router
  .route('/category/delete/:id')
  .get(newTripController.deleteDiagram)

  router
  .route('/category/:id')
  .post(newTripController.findCategoryById)

module.exports = router
