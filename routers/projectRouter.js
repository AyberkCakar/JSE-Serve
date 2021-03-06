const router = require('express')();
const TransactionsFactory = require('../database/transactionFactory');
const { validators, verifyToken, authorization } = require('../middleware');
const projectTransactions = TransactionsFactory.creating('projectTransactions');
const projectValidator = validators.projectValidator;
const tokenControl = verifyToken.tokenControl;
const authControl = authorization.authControl;
const HttpStatusCode = require('http-status-codes');

router.post('/project', tokenControl, authControl, projectValidator.insert, async (req, res) => {
    try {
        const result = await projectTransactions.insertAsync(req.body);
        res.json(result);
    } catch (error) {
        res.status(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR).send(error.message);
    }
});

router.put('/project', tokenControl, authControl, projectValidator.update, async (req, res) => {
    try {
        const result = await projectTransactions.updateAsync(req.body);
        res.json(result);
    } catch (error) {
        res.status(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR).send(error.message);
    }
});

router.delete('/project', tokenControl, authControl, projectValidator.delete, async (req, res) => {
    try {
        const result = await projectTransactions.deleteAsync(req.body.ProjectID);
        res.json(result);
    } catch (error) {
        res.status(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR).send(error.message);
    }
});

router.get('/project', projectValidator.list, async (req, res) => {
    try {
        const result = await projectTransactions.listAsync(req.body);
        res.json(result);
    } catch (error) {
        res.status(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR).send(error.message);
    }
});

router.get('/project/:ProjectID', projectValidator.find, async (req, res) => {
    try {
        const result = await projectTransactions.findAsync(req.params.ProjectID);
        res.json(result);
    } catch (error) {
        res.status(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR).send(error.message);
    }
});

module.exports = router;