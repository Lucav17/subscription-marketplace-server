const StoreAuthenticationController = require('./controllers/StoreController'),
    ConsumerAuthenticationController = require('./controllers/ConsumerController'),
    express = require('express');


module.exports = function (app) {
    // Initializing route groups
    const apiRoutes = express.Router(),
        consumerRoutes = express.Router(),
        storeAuthRoutes = express.Router();

   
    //SET THE BASE ROUTE FOR ALL STORE ROUTES
    apiRoutes.use('/store/auth', storeAuthRoutes);
    // Registration route for all stores
    storeAuthRoutes.post('/register', StoreAuthenticationController.register);
    // Log in route for all Stores
    StoreAuthRoutes.post('/login', StoreAuthenticationController.login);

    //SET THE BASE ROUTE FOR ALL CONSUMER ROUTES
    apiRoutes.use('/customer/auth', consumerRoutes);
    // Registation route for consumers
    consumerRoutes.post('/register', ConsumerAuthenticationController.register);
    // Log in route for consumers
    consumerRoutes.post('/login', ConsumerAuthenticationController.login)

    // Set url for API group routes
    app.use('/api/v1/', apiRoutes);





};