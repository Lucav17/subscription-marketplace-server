const StoreController = require('./controllers/StoreController'),
    ConsumerAuthenticationController = require('./controllers/ConsumerController'),
    AWSController = require('./controllers/AWSController'),
    express = require('express'),
    multipart = require('connect-multiparty'),
    multipartMiddleware = multipart();


module.exports = function (app) {
    // Initializing route groups
    const apiRoutes = express.Router(),
        consumerRoutes = express.Router(),
        storeRoutes = express.Router(),
        awsRoutes = express.Router();

   
    //SET THE BASE ROUTE FOR ALL STORE ROUTES
    apiRoutes.use('/store/', storeRoutes);
    // Registration route for all stores
    storeRoutes.post('/auth/register', StoreController.register);
    // Log in route for all Stores
    storeRoutes.post('/auth/login', StoreController.login);
    // Update email, password, basic owner information
    storeRoutes.put('/account/details', StoreController.updateAccount);
    // Update store information
    storeRoutes.put('/account/store/details', StoreController.updateStoreInformation);

    //SET THE BASE ROUTE FOR ALL CONSUMER ROUTES
    apiRoutes.use('/customer/auth', consumerRoutes);
    // Registation route for consumers
    consumerRoutes.post('/register', ConsumerAuthenticationController.register);
    // Log in route for consumers
    consumerRoutes.post('/login', ConsumerAuthenticationController.login)

    //SET THE BASE URL FOR S3 MANAGEMENT
    apiRoutes.use('/aws', awsRoutes);
    //Upload a photo to S3
    awsRoutes.post('/upload',multipartMiddleware, AWSController.upload);
    //Delete a photo from S3
    awsRoutes.delete('/delete', AWSController.deletePhoto);

    // Set url for API group routes
    app.use('/api/v1', apiRoutes);





};