import './helper';
require('@cypress/xpath');
import 'cypress-file-upload';
module.exports = (on, config) => {
  // Register 'task' event
  on('task', {
    // Define 'listFiles' task
    listFiles() {
      // your code to list files goes here
    }
  });
};

  

