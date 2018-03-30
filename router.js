const StoreAuthenticationController = require('./controllers/StoreController'),
    ConsumerAuthenticationController = require('./controllers/ConsumerController'),
    AWSController = require('./controllers/AWSController'),
    express = require('express'),
    multipart = require('connect-multiparty'),
    multipartMiddleware = multipart();


module.exports = function (app) {
    // Initializing route groups
    const apiRoutes = express.Router(),
        consumerRoutes = express.Router(),
        storeAuthRoutes = express.Router(),
        awsRoutes = express.Router();

   
    //SET THE BASE ROUTE FOR ALL STORE ROUTES
    apiRoutes.use('/store/auth', storeAuthRoutes);
    // Registration route for all stores
    storeAuthRoutes.post('/register', StoreAuthenticationController.register);
    // Log in route for all Stores
    storeAuthRoutes.post('/login', StoreAuthenticationController.login);

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