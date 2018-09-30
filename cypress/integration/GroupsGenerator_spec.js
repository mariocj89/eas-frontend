/* eslint-disable func-names, prefer-arrow-callback */

describe('Groups Generator Draw Page', () => {
  beforeEach(() => {
    cy.server();
    cy.mockFixture('GroupsGenerator');
  });

  it('Google Analytics pageview event is sent', () => {
    cy.mockGA();
    cy.visit('/groups');

    cy.get('@ga')
      .should('be.calledWith', 'create', 'UA-XXXXX-Y')
      .and('be.calledWith', 'send', { hitType: 'pageview', page: '/groups' });
  });

  it('Fields have the right default values', function() {
    cy.visit('/groups');

    cy.getComponent('GroupsGenerator__participants-field-input').should('have.value', '');
    cy.getComponent('GroupsGenerator__number-of-groups-field-input').should('have.value', '2');
    cy.getComponent('MultiValueDisplay__chip').should('not.exist');
  });

  it('Request sent contains the right data and results are shown', function() {
    cy.visit('/groups');
    cy.getComponent('GroupsGenerator__participants-field-input').type('you, me, him, her,');
    cy.getComponent('GroupsGenerator__number-of-groups-field-input')
      .clear()
      .type(4);
    cy.getComponent('SubmitDrawButton').click();

    cy.mockedRequestWait('POST', '/api/groups')
      .its('requestBody')
      .should('deep.eq', {
        participants: [{ name: 'you' }, { name: 'me' }, { name: 'him' }, { name: 'her' }],
        number_of_groups: 4,
      });

    cy.mockedRequestWait('POST', '/api/groups/43c357b7-91ec-448a-a4bf-ac059cc3a374/toss');
    cy.getComponent('GroupsGeneratorResult__result').should('be.visible');
  });

  it('Changing data after toss should create a new draw', function() {
    cy.visit('/groups');
    cy.getComponent('GroupsGenerator__participants-field-input').type('one, two,');
    cy.getComponent('SubmitDrawButton').click();
    cy.mockedRequestWait('POST', '/api/groups')
      .its('requestBody.participants')
      .should('deep.eq', [{ name: 'one' }, { name: 'two' }]);
    cy.mockedRequestWait('POST', '/api/groups/43c357b7-91ec-448a-a4bf-ac059cc3a374/toss');
    cy.getComponent('GroupsGeneratorResult__result').should('be.visible');
    cy.getComponent('GroupsGenerator__participants-field-input').type('three,');
    cy.getComponent('SubmitDrawButton').click();

    // A new draw should be created and tossed
    cy.mockedRequestWait('POST', '/api/groups')
      .its('requestBody.participants')
      .should('deep.eq', [{ name: 'one' }, { name: 'two' }, { name: 'three' }]);
    cy.mockedRequestWait('POST', '/api/groups/43c357b7-91ec-448a-a4bf-ac059cc3a374/toss');
  });

  describe('Invalid configurations', function() {
    it('Should show error when any required field is empty', function() {
      cy.visit('/groups');
      cy.getComponent('GroupsGenerator__participants-field').within(() => {
        cy.getComponent('GroupsGenerator__participants-field-input').type('one,');
        cy.getError().should('not.exist');
        cy.get('[class*="delete"]').click();
        cy.getComponent('GroupsGenerator__participants-field-input').clear();
        cy.getError().should('be.visible');

        // It should recover from not enough
        cy.getComponent('GroupsGenerator__participants-field-input').type('one,');
        cy.getError().should('not.exist');
      });

      cy.getComponent('GroupsGenerator__number-of-groups-field').within(() => {
        cy.getComponent('GroupsGenerator__number-of-groups-field-input').clear();
        cy.getError().should('be.visible');

        cy.getComponent('GroupsGenerator__number-of-groups-field-input')
          .clear()
          .type(0);
        cy.getError().should('be.visible');

        cy.getComponent('GroupsGenerator__number-of-groups-field-input')
          .clear()
          .type(2);
        cy.getError().should('not.exist');
      });
    });

    it('Should recover from not enough participants for N groups', function() {
      cy.visit('/groups');
      cy.getComponent('SubmitDrawButton').click();
      cy.getComponent('ValidationFeedback').should('be.visible');
      cy.getComponent('GroupsGenerator__participants-field-input').type('one, two,');
      cy.getComponent('ValidationFeedback').should('not.exist');
    });
  });
});
