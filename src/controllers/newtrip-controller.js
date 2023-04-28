const Diagram = require('../models/trip-model')
const Category = require('../models/category-model')
const renderTripReport = (req, res) => {
  res.render('summary')
}

const renderQR = (req, res) => {
  res.render('qrCode')
}

const createQr = (req, res) => {
  let qrData = req.body.qrData
  let src = `https://quickchart.io/qr?text=${qrData}`
  res.render('qrView', {src})
}

const allTrips = async (req, res) => {
  const allTrips = await Diagram.find().exec(); 
  res.render('allTrips', {allTrips})
}

const renderGoogle = async (req, res) => {
  res.render('google')
}

const renderDoughnut = async (req, res) => {
  res.render('doughnut')
}

const createDoughnut = async (req, res) => {
  let diagramLabels = req.body.diagramLabels;
  let diagramData = req.body.diagramData;
  let diagramName = req.body.diagramName;
  let diagramLabelsResult = diagramLabels.split(',')
  let diagramDataStr = diagramData.split(',')

  let result = ''
  for (let i = 0; i < diagramLabelsResult.length; i++) {
     result += `'${diagramLabelsResult[i]}',`
  }

  let sum = 0
  let resultCost = []
  for (let i = 0; i < diagramDataStr.length - 1; i++) {
    diagramDataStr[i] = parseInt("diagramDataStr[i]", 10);
  }
  let newDiagram
  let src = `https://quickchart.io/chart?c={type:'doughnut',data:{labels:[${result}],datasets:[{data:[${diagramData}]}]},options:{plugins:{doughnutlabel:{labels:[{text:'${sum}',font:{size:20}},{text:'total'}]}}}}`

  if (diagramLabels && diagramLabels) {
    try {
      newDiagram = new Diagram({
          name: diagramName,
          labels: result,
          data: diagramData,
          link: src
        })

      await newDiagram.save()
      res.render('equally', { src, diagramName })
      
    } catch (e) {
      console.log(e);
      res.render('doughnut', { error: 'This trip already exist or incorrect data!'  })
    }
  } else {
    res.render('doughnut', {error: 'Not all fields are filled!'})
} 
}

const findCategoryById = async (req, res) => {
  let diagram = await Diagram.findById(req.params.id).exec();
  res.render('editCategory', {diagram})
}

const deleteDiagram = async (req, res) => {
  const allTrips = await Diagram.find();
  await Diagram.deleteOne({ _id: req.params.id }).exec();

  res.render('allTrips', {allTrips})
}

const editCategoryEqually = async (req, res) => {
  let diagram = await Diagram.findById(req.params.id).exec();
  let diagramName = req.body.diagramName
  let diagramLabels = req.body.diagramLabels
  let diagramData = req.body.diagramData
  diagram.name = diagramName  ;
  diagram.labels = diagramLabels ;
  diagram.data = diagramData ;
  
  let diagramLabelsResult = diagramLabels.split(',')
  let result = ''

  for (let i = 0; i < diagramLabelsResult.length; i++) {
     result += `'${diagramLabelsResult[i]}',`
  }

  let sum = 0
  let resultCost = []
  for (let i = 0; i < diagramData.length - 1; i++) {
    sum += diagramData[i]
  }

  let newDiagram
  let src = `https://quickchart.io/chart?c={type:'pie',data:{labels:[${result}], datasets:[{data:[${diagramData}]}]}}`

  if (diagramName && diagramLabels && diagramData) {
    try {
      await diagram.save();
      res.render('equally', { diagram, src })
    } catch (e) {
      console.log(e);
      res.render('editCategory', { error: 'Incorrect data!' })
    }
  } else {
    res.render('editCategory', {error: 'Not all fields are filled!'})
}
}

const findTripById = async (req, res) => {
  let diagram = await Diagram.findById(req.params.id).exec();
  res.render('summary', { diagram } );
}

const renderNewDiagram = (req, res) => {
  res.render('createNewDiagram')
}

const createNewDiagram = async (req, res) => {
  let diagramLabels = req.body.newTripName;
  let diagramData = req.body.tripUsers;
  let diagramName = req.body.diagramName;
  let diagramLabelsResult = diagramLabels.split(',')
  let result = ''

  for (let i = 0; i < diagramLabelsResult.length; i++) {
     result += `'${diagramLabelsResult[i]}',`
  }

  let sum = 0
  for (let i = 0; i < diagramData.length - 1; i++) {
    sum += diagramData[i]
  }

  let newDiagram
  let src = `https://quickchart.io/chart?c={type:'pie',data:{labels:[${result}], datasets:[{data:[${diagramData}]}]}}`


  if (diagramLabels && diagramLabels) {
    try {
      newDiagram = new Diagram({
          name: diagramName,
          labels: result,
          data: diagramData,
          link: src
        })

      await newDiagram.save()
      res.render('equally', {  src, diagramName })
    } catch (e) {
      console.log(e);
      res.render('createNewDiagram', { error: 'This trip already exist or incorrect data!'  })
    }
  } else {
    res.render('createNewDiagram', {error: 'Not all fields are filled!'})
} 
}

const renderCreateCategory = (req, res) => {
  let tripName = req.body.tripName;
  res.render('createcategory', { tripName })
}

const addCategory = async (req, res) => {
  let tripId = req.body.tripId;
  let newTrip = await Trip.findById(tripId).exec()
  res.render('createcategory', { newTrip  })
}

const createNewCategory = async (req, res) => {
  let categoryName = req.body.newCategoryName;
  let cost = req.body.fullCost;
  let tripId = req.body.tripId;
  let newTrip = await Diagram.findById(tripId)
  let payers = newTrip.users
  let tripCategories = newTrip.categories
  let newCategory
  let tripName = newTrip.name
  let payerCost = Math.round(cost / payers.length)
  let payerCostArr = []

  for (let i = 0; i < payers.length; i++) {
    payerCostArr.push({ name: payers[i], cost: payerCost })
  }

  if (categoryName && cost && payers) {
    try {
        newCategory = new Category({
        name: categoryName,
        cost,
        users: payerCostArr,
        trip: tripName
      })
      
      tripCategories.push(newCategory)
      newTrip.categories = tripCategories
      await newCategory.save()
      await newTrip.save()
      res.render('equally', { categoryName, payers, payerCost, tripName , newCategory, newTrip})

    } catch (e) {
      console.log(e);
      res.render('createcategory', { error: 'This category already exist or incorrect data!', categoryName, payers, payerCost, tripName , newCategory, newTrip })
    }
  } else {
    res.render('createcategory', {error: 'Not all fields are filled!', categoryName, payers, payerCost, tripName , newCategory, newTrip})
}
}

const renderCastomizeCategory = (req, res) => {
  let name = req.body.newCategoryName;
  res.render('castomizeCategory', {name})
}

const castomizeCategory = async (req, res) => {
  let categoryName = req.body.newCategoryName;
  let tripName = req.body.tripName
  let fullCost = req.body.fullCost;
  let payers = req.body.payers.split(',');
  res.locals.payers = payers

  if (categoryName && fullCost && payers) {
    try {
      
      res.render('castomizeCategory', { categoryName, payers, fullCost, tripName })

    } catch (e) {
      console.log(e);
      res.render('castomizeCategory', { error: 'Incorrect data!' })
    }
  } else {
    res.render('castomizeCategory', {error: 'Not all fields are filled!'})
}
}

const renderSavedCastomizeCategory = async (req, res) => {
  let categoryName = req.body.categoryName;
  let castomCost = req.body.castomizeCategoryCost;
  let payers = req.body.payer;
  let tripName = req.body.tripName
  res.render('savedCastomizeCategory', {categoryName, castomCost, payers, tripName})
}

const saveCastomizeCategory = async (req, res) => {
  let categoryName = req.body.categoryName;
  let castomCost = req.body.castomizeCategoryCost;
  let payers = req.body.payer;
  let fullCost = req.body.fullCost;
  let tripName = req.body.tripName
  let castomCostArr = [];

  for (let i = 0; i < payers.length; i++) {
    castomCostArr.push({ name: payers[i], cost: castomCost[i] })
  }
  
  if (castomCost) {
    try {
      const newCategory = new Category({
        name: categoryName,
        cost: fullCost,
        users: castomCostArr,
        trip: tripName
      })

      await newCategory.save()
      res.render('savedCastomizeCategory', {categoryName, castomCostArr, payers, tripName})
      
    } catch (e) {
      console.log(e);
      res.render('savedCastomizeCategory', { error: 'Incorrect data!' })
    }
  } else {
    res.render('savedCastomizeCategory', {error: 'Not all fields are filled!'})
}
}

module.exports = {
  renderNewDiagram,
  renderCreateCategory,
  createNewDiagram,
  createNewCategory,
  renderCastomizeCategory,
  castomizeCategory,
  renderSavedCastomizeCategory,
  saveCastomizeCategory,
  renderTripReport,
  allTrips,
  findTripById,
  addCategory,
  findCategoryById,
  editCategoryEqually,
  createQr,
  renderQR,
  deleteDiagram,
  renderGoogle,
  renderDoughnut,
  createDoughnut
}
