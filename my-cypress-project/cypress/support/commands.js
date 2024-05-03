Cypress.Commands.add('uploadFile', { prevSubject: true }, async (subject, fixturePath, mimeType) => {
  const content = await cy.fixture(fixturePath, 'base64');
  const blob = await Cypress.Blob.base64StringToBlob(content, mimeType);
  const testfile = new File([blob], fixturePath, { type: mimeType });
  const dataTransfer = new DataTransfer();
  const fileInput = subject[0];

  dataTransfer.items.add(testfile);
  fileInput.files = dataTransfer.files;

  cy.wrap(subject).trigger('change', { force: true });
});
import 'cypress-file-upload'
import './helper'
require('@cypress/xpath');
Cypress.Commands.add('listFiles', () => {
  return cy.task('listFiles');
});
module.exports = (on, config) => {
  on('task', {
    fsCopyFile({ path, newPath, mode }) {
    }
  });
};

