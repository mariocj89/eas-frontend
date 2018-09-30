/* eslint-disable func-names, prefer-arrow-callback */

// TODO Mock GA, Facebook

describe('Number Draw Page', () => {
  beforeEach(() => {
    cy.server();
    cy.mockFixture('RandomNumber');
  });

  it('Google Analytics pageview event is sent', () => {
    cy.mockGA();
    cy.visit('/number');

    cy.get('@ga')
      .should('be.calledWith', 'create', 'UA-XXXXX-Y')
      .and('be.calledWith', 'send', { hitType: 'pageview', page: '/number' });
  });

  it('Results are shown', function() {
    cy.visit('/number');
    cy.getComponent('SubmitDrawButton').click();
    cy.mockedRequestWait('POST', '/api/random_number');
    cy.mockedRequestWait('POST', '/api/random_number/6ce5042f-f931-4a79-a716-dfadccc978d0/toss');
    cy.getComponent('RandomNumberResult__result').should('be.visible');
  });

  it('Fields have the right default values', function() {
    cy.visit('/number');
    cy.getComponent('RandomNumber__from-field-input').should('have.value', '1');
    cy.getComponent('RandomNumber__to-field-input').should('have.value', '10');
    cy.getComponent('RandomNumber__number-of-results-field-input').should('have.value', '1');
    cy.getComponent('RandomNumber__allow-repeated-field-input').should('not.exist');
  });

  it('Request sent contains the right data', function() {
    cy.visit('/number');
    cy.getComponent('RandomNumber__from-field-input')
      .clear()
      .type(3);
    cy.getComponent('RandomNumber__to-field-input')
      .clear()
      .type(100);
    cy.getComponent('RandomNumber__number-of-results-field-input')
      .clear()
      .type(2);
    cy.getComponent('SubmitDrawButton').click();

    cy.mockedRequestWait('POST', '/api/random_number')
      .its('requestBody')
      .should('deep.eq', {
        allow_repeated_results: false,
        number_of_results: 2,
        range_max: 100,
        range_min: 3,
      });
  });

  it('Changing data after toss should create a new draw', function() {
    cy.visit('/number');
    cy.getComponent('SubmitDrawButton').click();
    cy.mockedRequestWait('POST', '/api/random_number')
      .its('requestBody')
      .should('contain', {
        number_of_results: 1,
      });
    cy.mockedRequestWait('POST', '/api/random_number/6ce5042f-f931-4a79-a716-dfadccc978d0/toss');
    cy.getComponent('RandomNumberResult__result').should('be.visible');
    cy.getComponent('RandomNumber__number-of-results-field-input')
      .clear()
      .type(3);
    cy.getComponent('SubmitDrawButton').click();
    cy.mockedRequestWait('POST', '/api/random_number')
      .its('requestBody')
      .should('contain', {
        number_of_results: 3,
      });
    cy.mockedRequestWait('POST', '/api/random_number/6ce5042f-f931-4a79-a716-dfadccc978d0/toss');
  });

  describe('Invalid configurations', function() {
    it('Should show error when any required field is empty', function() {
      cy.visit('/number');
      cy.getComponent('RandomNumber__from-field').within(() => {
        cy.getComponent('RandomNumber__from-field-input').clear();
        cy.getError().should('be.visible');
        cy.getComponent('RandomNumber__from-field-input').type(2);
        cy.getError().should('not.exist');
      });

      cy.getComponent('RandomNumber__to-field').within(() => {
        cy.getComponent('RandomNumber__to-field-input').clear();
        cy.getError().should('be.visible');
        cy.getComponent('RandomNumber__to-field-input').type(10);
        cy.getError().should('not.exist');
      });

      cy.getComponent('RandomNumber__number-of-results-field').within(() => {
        cy.getComponent('RandomNumber__number-of-results-field-input').clear();
        cy.getError().should('be.visible');
        cy.getComponent('RandomNumber__number-of-results-field-input').type(2);
        cy.getError().should('not.exist');
      });
    });

    it('Should show error when range is invalid', function() {
      cy.visit('/number');
      cy.getComponent('RandomNumber__from-field-input')
        .clear()
        .type(12);
      cy.getComponent('SubmitDrawButton').click();
      cy.getComponent('ValidationFeedback').should('be.visible');
    });

    it('Should show error when range is too small', function() {
      cy.visit('/number');
      cy.getComponent('RandomNumber__number-of-results-field-input')
        .clear()
        .type(12);
      cy.getComponent('SubmitDrawButton').click();
      cy.getComponent('ValidationFeedback').should('be.visible');
      cy.getComponent('RandomNumber__allow-repeated-field-input').check();
      cy.getComponent('ValidationFeedback').should('not.exist');
    });
  });
});
