/* eslint-disable import/prefer-default-export */

import ActivityPage from '../../../page-objects/activity-page';

const { _ } = Cypress;

export const checkDefaultActivity = years => {
  let activityPage;

  let defaultData;

  before(() => {
    cy.fixture('default-activity-template.json').then(data => {
      defaultData = data;
    });
    activityPage = new ActivityPage();
  });

  describe('Check default activity values and check in export view', () => {
    it('Check default activity values and check in export view', () => {
      // Check Activity Dashboard
      cy.goToActivityDashboard();

      cy.url().should('include', '/activities');
      cy.findByRole('heading', { name: /Activities/i, level: 2 }).should(
        'exist'
      );

      cy.contains('Activity 1: Program Administration (HIT)').should('exist');
      cy.contains('Activity 2').should('not.exist');

      cy.contains('Delete').should('not.exist');

      cy.get('#activities')
        .contains('Edit')
        .should('exist')
        .contains('Edit')
        .click();

      cy.url().should('contain', '/activity/0/overview');

      cy.waitForSave();

      // Check Activity Overview
      cy.findByRole('heading', { name: /Activity Overview/i }).should('exist');

      activityPage.checkDate('Start date');
      activityPage.checkDate('End date');

      activityPage.checkTinyMCE('activity-short-overview-field', '');
      activityPage.checkTinyMCE('activity-description-field', '');
      activityPage.checkTinyMCE('activity-alternatives-field', '');
      activityPage.checkTinyMCE('standards-and-conditions-supports-field', '');
      activityPage.checkTextField('ds-c-field visibility--screen', '');

      cy.waitForSave();
      cy.get('[id="continue-button"]').click();

      // Check Outcomes and Milestones
      cy.findByRole('heading', {
        name: /Outcomes and Metrics/i,
        level: 3
      }).should('exist');

      cy.contains('Add at least one outcome for this activity.').should(
        'exist'
      );
      cy.contains('Add milestone(s) for this activity.').should('exist');

      cy.waitForSave();
      cy.get('[id="continue-button"]').click();

      // Check State Staff and Other State Expenses
      cy.findByRole('heading', {
        name: /State Staff and Expenses/i,
        level: 3
      }).should('exist');

      cy.contains('State staff have not been added for this activity.').should(
        'exist'
      );

      cy.waitForSave();
      cy.get('[id="continue-button"]').click();

      // Check Private Contractor Costs
      cy.findByRole('heading', {
        name: /Private Contractor Costs/i,
        level: 3
      }).should('exist');

      cy.contains(
        'Private contractors have not been added for this activity.'
      ).should('exist');

      cy.waitForSave();
      cy.get('[id="continue-button"]').click();

      // Check Default Cost Allocation and Other Funding
      cy.findByRole('heading', {
        name: /^Activity 1:/i,
        level: 2
      }).should('exist');
      cy.findByRole('heading', { name: /Cost Allocation/i, level: 3 }).should(
        'exist'
      );
      cy.wait(1000); // eslint-disable-line cypress/no-unnecessary-waiting
      activityPage.checkTinyMCE('cost-allocation-methodology-field', '');

      // cy.then(() => {
      _.forEach(years, (year, i) => {
        activityPage.checkTinyMCE(
          `cost-allocation-narrative-${year}-other-sources-field`,
          ''
        );
        activityPage.checkTextField('ds-c-field ds-c-field--currency', 0, i);

        cy.get('[class="budget-table activity-budget-table"]')
          .eq(i)
          .then(table => {
            cy.get(table)
              .getActivityTable()
              .then(tableData => {
                // _.forEach(defaultData.costAllocationTables, data => {
                //   _.forEach(data, elem => {
                //     expect(tableData).to.deep.include(elem);
                //   });
                // });
                cy.log(JSON.stringify(tableData));
              });
          });
      });
      // });

      cy.waitForSave();
      cy.get('[id="continue-button"]').click();

      // Check Budget and FFP
    });
  });
};
