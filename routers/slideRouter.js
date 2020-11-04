const router = require('express')();
const TransactionsFactory = require('../database/transactionFactory');
const { validators, verifyToken } = require('../middleware');
const slideTransactions = TransactionsFactory.creating('slideTransactions');
const slideValidator = validators.slideValidator;
const tokenControl = verifyToken.tokenControl;
let { routerAuthorization } = require('../utils');
routerAuthorization = routerAuthorization['slider'];
const ImageUploadFactory = require('../middleware/imageUploads/imageUploadFactory');
const multerImageUpload = ImageUploadFactory.creating('multerImageUpload');

router.post('/slide', tokenControl, multerImageUpload.upload, slideValidator.insert, async (req, res) => {
    try {
        const result = await slideTransactions.insertAsync(Object.assign(req.body, { SlideImagePath: req.file.path.replace('public', '') }))
        res.json(result);
    } catch (error) {
        await multerImageUpload.remove('public' + req.file.path);
        res.status(error.status || 500).json({ message: error.message });
    }
});

router.put('/slide', tokenControl, multerImageUpload.upload, slideValidator.update, async (req, res) => {
    try {
        const result = await slideTransactions.updateAsync(Object.assign(req.body, req.file ? { SlideImagePath: req.file.path.replace('public', '') } : null))
        res.json(result);
    } catch (error) {
        await multerImageUpload.remove('public' + req.file.path);
        res.status(error.status || 500).json({ message: error.message });
    }
});

router.delete('/slide', tokenControl, slideValidator.delete, async (req, res) => {
    try {
        const slideFind = await slideTransactions.findAsync(req.body.SlideID);
        const result = await slideTransactions.deleteAsync(req.body.SlideID);
        await multerImageUpload.remove('public' + slideFind.SlideImagePath);
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
});

module.exports = router;