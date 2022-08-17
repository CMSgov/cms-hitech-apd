// <reference types="cypress" />
import { testKeyStatePersonnelWithData } from '../../helpers/apd/key-state-personnel';
import { testProposedBudgetWithData } from '../../helpers/apd/proposed-budget';
import { addHITActivity } from '../../helpers/apd/activity/add-HIT-activity';
import { addHIEActivity } from '../../helpers/apd/activity/add-HIE-activity';
import { addMMISActivity } from '../../helpers/apd/activity/add-MMIS-activity';
import { checkBudgetAndFFP } from '../../helpers/apd/budget-checks';

// Tests an APD by adding data and checking the results
describe('APD with Data', { tags: ['@apd', '@data', '@slow'] }, () => {
  let apdUrl;
  let apdId;
  let budgetData;
  const years = [];

  /* eslint-disable-next-line prefer-arrow-callback, func-names */
  before(function () {
    cy.useStateStaff();

    cy.findByRole('button', { name: /Create new/i }).click();
    cy.findByRole(
      'heading',
      { name: /APD Overview/i },
      { timeout: 100000 }
    ).should('exist');
    cy.location('pathname').then(pathname => {
      apdUrl = pathname.replace('/apd-overview', '');
      apdId = apdUrl.split('/').pop();
    });

    cy.get('[type="checkbox"][checked]').each((_, index, list) =>
      years.push(list[index].value)
    );

    cy.fixture('budget-checks-test.json').then(data => {
      budgetData = data;
    });
  });

  beforeEach(() => {
    cy.visit(apdUrl);
  });

  // after(() => {
  //   cy.deleteAPD(apdId);
  // });

  describe('Budget Checks', () => {
    it.only('Checks Key State Personnel', () => {
      cy.goToKeyStatePersonnel();
      cy.url().should('include', '/state-profile');

      cy.fixture('users').then(userData => {
        cy.findByRole('button', { name: /Add Primary Contact/i }).click();

        cy.get('[data-cy="key-person-0__name"]').clear().type(userData[1].name);

        cy.get('[data-cy="key-person-0__email"]')
          .clear()
          .type(userData[1].email);

        cy.get('[data-cy="key-person-0__position"]')
          .clear()
          .type(userData[1].username);

        cy.get('input[type="radio"][value="no"]').check({ force: true }).blur();
        cy.findByRole('button', { name: /Save/i }).click();
      });

      checkBudgetAndFFP(years, budgetData.afterKeyPersonnelNoCosts, 0);

      cy.goToKeyStatePersonnel();
      cy.url().should('include', '/state-profile');

      cy.findByRole('button', { name: /Add Key Personnel/i }).click();

      cy.fixture('users').then(userData => {
        cy.get('[data-cy="key-person-1__name"]').clear().type(userData[3].name);

        cy.get('[data-cy="key-person-1__email"]')
          .clear()
          .type(userData[3].email);

        cy.get('[data-cy="key-person-1__position"]')
          .clear()
          .type(userData[3].username);

        cy.get('input[type="radio"][value="yes"]')
          .check({ force: true })
          .blur();

        cy.get('[data-cy="key-person-1-0__cost"]').type('100000');
        cy.get('[data-cy="key-person-1-0__fte"]').type('0.5');
        cy.get('[data-cy="key-person-1-1__cost"]').type('100000');
        cy.get('[data-cy="key-person-1-1__fte"]').type('0.5').blur();

        cy.findByRole('button', { name: /Save/i }).click();
      });

      checkBudgetAndFFP(years, budgetData.afterKeyPersonnelWithCosts, 0);
    });

    // describe('Activities', () => {
    //   describe('Add HIT Activity', () => {
    //     addHITActivity(years);
    //   });

    //   describe('Add HIE Activity', () => {
    //     addHIEActivity(years);
    //   });

    //   describe('Add MMIS Activity', () => {
    //     addMMISActivity(years);
    //   });
    // });

    // describe('Proposed Budget', () => {
    //   testProposedBudgetWithData(years);
    // });
  });
});

/* Notes:
dont reuse exact functions, but take code from them
just check subtotals in budget and ffp, check more subtotlas in proposed budget
command for navigating to the budget and ffp page? and proposed budget?
one function is add activity, choose funding type, choose fed state split
*/
