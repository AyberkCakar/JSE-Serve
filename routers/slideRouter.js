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

module.exports = router;