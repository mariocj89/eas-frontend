describe('FacebookRaffle', () => {
  beforeEach(() => {
    cy.server();
    cy.mockFixture('FacebookRaffle');
  });

  describe('Creation page', () => {
    it.skip('Google Analytics pageview event is sent', () => {
      cy.mockGA();
      cy.visit('/raffle');

      cy.get('@ga')
        .should('be.calledWith', 'create', 'UA-XXXXX-Y')
        .and('be.calledWith', 'send', { hitType: 'pageview', page: '/raffle' });
    });

    it('It should be possible to create a raffle', () => {
      cy.mockGA();
      cy.visit('/facebook');

      // Attempt to submit step without inputting any prize should show error
      cy.getComponent('WizardForm__next-button').click();
      cy.getComponent('Raffle__prizes-field').within(() => {
        cy.getError().should('be.visible');
      });

      cy.getComponent('Raffle__prizes-field-input').type('Prize 1,');

      // Go to General Details step
      cy.getComponent('WizardForm__next-button').click();
      // Trying to leave the title empry should error
      cy.getComponent('PublicDetails__title-field-input').clear();
      cy.getComponent('WizardForm__next-button').click();
      cy.getComponent('PublicDetails__title-field').within(() => {
        cy.getError().should('be.visible');
      });

      // Fill the title and its error should recover
      cy.getComponent('PublicDetails__title-field-input')
        .clear()
        .type('The title');
      cy.getComponent('PublicDetails__title-field').within(() => {
        cy.getError().should('not.exist');
      });

      // Fill the description
      cy.getComponent('PublicDetails__description-field-input')
        .clear()
        .type('A cool description');
      cy.getComponent('PublicDetails__description-field').within(() => {
        cy.getError().should('not.exist');
      });

      // Go to "Select date" step
      cy.getComponent('WizardForm__next-button').click();

      // Submit form
      cy.getComponent('WizardForm__next-button').click();

      cy.mockedRequestWait('POST', '/api/raffle')
        .its('requestBody')
        .should('deep.eq', {
          title: 'The title',
          description: 'A cool description',
          participants: [{ name: 'participant1', facebook_id: '000000' }],
          prizes: [{ name: 'Prize 1' }],
        });
      cy.mockedRequestWait('POST', '/api/raffle/29080f6b-b3e4-412c-8008-7e26081ea17c/toss');
      cy.get('@ga').should('be.calledWith', 'send', {
        hitType: 'event',
        eventCategory: 'Facebook',
        eventAction: 'Publish',
        eventLabel: 'b29f44c2-1022-408a-925f-63e5f77a12ad',
      });
      cy.location('pathname').should('eq', '/facebook/b29f44c2-1022-408a-925f-63e5f77a12ad');
    });
  });
  describe('Published Facebook Raffle page', () => {
    // it('Should send GA pageview', () => {
    //   cy.mockGA();
    //   cy.visit('/raffle/29080f6b-b3e4-412c-8008-7e26081ea17c');
    //   cy.get('@ga')
    //     .should('be.calledWith', 'create', 'UA-XXXXX-Y')
    //     .and('be.calledWith', 'send', {
    //       hitType: 'pageview',
    //       page: '/raffle/29080f6b-b3e4-412c-8008-7e26081ea17c',
    //     });
    // });
    it.only('Should show the countdown if there are not results yet', () => {
      const now = new Date();
      now.setHours(now.getHours() + 1);
      const dateInFuture = now.toISOString();
      cy.route({
        method: 'GET',
        url: '/api/raffle/b29f44c2-1022-408a-925f-63e5f77a12ad',
        status: 200,
        response: {
          id: '79a8d152-d965-465c-90fd-ceb86efc39cb',
          created_at: '2018-10-28T12:10:49.409170Z',
          updated_at: '2018-10-28T12:10:49.409296Z',
          title: 'This is the title',
          description: "That's a nice description",
          results: [
            {
              created_at: '2018-10-28T12:10:49.469348Z',
              value: null,
              schedule_date: dateInFuture,
            },
          ],
          metadata: [],
          private_id: '86a7eae4-5cfc-497b-a30e-48e2f77836ce',
          prizes: [
            {
              id: 'b5e9426c-fdc7-49e3-a11f-3ee87c7f77ec',
              created_at: '2018-10-28T12:10:49.425183Z',
              name: 'Prize one',
              url: null,
            },
          ],
          participants: [
            {
              id: '2b020a30-49eb-4909-8caf-b1672807cdaf',
              created_at: '2018-10-28T12:10:49.426936Z',
              name: 'Participant 1',
              facebook_id: null,
            },
          ],
        },
      }).as('request');
      cy.visit('/facebook/b29f44c2-1022-408a-925f-63e5f77a12ad');
      cy.wait('@request');
      cy.getComponent('Countdown').should('be.visible');
      cy.getComponent('FacebookLoginButton').click();
    });
    it('Should show results and the raffle details', () => {
      cy.visit('/raffle/29080f6b-b3e4-412c-8008-7e26081ea17c');
      cy.mockedRequestWait('GET', '/api/raffle/29080f6b-b3e4-412c-8008-7e26081ea17c');
      cy.getComponent('PublishedRafflePage__Title').contains('This is the title');
      cy.getComponent('WinnerChip').should('have.length', 1);

      // Non winners should not be shown
      cy.contains('Participant 1').should('not.exist');
    });
  });
});
