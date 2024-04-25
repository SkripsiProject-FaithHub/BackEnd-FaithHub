const app = require('./bin/app/server');
// const logger = require('./bin/helpers/utils/logger');
const PORT = process.env.port || 9001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  
  module.exports = app;