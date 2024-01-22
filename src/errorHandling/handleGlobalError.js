const setupGlobalErrorHandling = (app) => {
      // This will ensure the app will never crash
      // it is global error handling if no route matches or any internal issue happens
      // this middleware will execute
      
      app.all("*", (req, res, next) => {
        const error = new Error(`The requested URL is invalid: ${req.url}`);
        error.status = 404;
        next(error);
      });
      
    // next() indicates subsequent funtion in this case, it's app.use(..)
      app.use((err, req, res, next) => {
        res.status(err.status || 500).json({ message: err.message });
      });
    }
    
    module.exports = setupGlobalErrorHandling;
    