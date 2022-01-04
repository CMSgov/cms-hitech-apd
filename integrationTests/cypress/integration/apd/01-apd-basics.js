import ActivityPage from '../../page-objects/activity-page';
import BudgetPage from '../../page-objects/budget-page';
import ActivitySchedulePage from '../../page-objects/activity-schedule-page';
import ExportPage from '../../page-objects/export-page';
import ProposedBudgetPage from '../../page-objects/proposed-budget-page';

/// <reference types="cypress" />

// Tests performing basic APD tasks

/* eslint-disable no-return-assign */
/* eslint-disable prefer-arrow-callback */

describe('APD Basics', { tags: ['@apd', '@default'] }, () => {
  let apdUrl;
  const years = [];
  const pageTitles = [
    'APD Overview',
    'Key State Personnel',
    'Results of Previous Activities',
    'Activities',
    'Activity Schedule Summary',
    'Proposed Budget',
    'Assurances and Compliance',
    'Executive Summary',
    'Export and Submit'
  ];

  before(() => {
    cy.useStateStaff();

    cy.findByRole('button', { name: /Create new/i }).click();
    cy.wait(1000); // eslint-disable-line cypress/no-unnecessary-waiting
    cy.location('pathname').then(pathname => {
      apdUrl = pathname.replace('/apd-overview', '');
    });
  });

  beforeEach(() => {
    cy.visit(apdUrl);
  });

  describe('Create APD', () => {
    it('creates a new APD with current date and the first two years checked', () => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const today = new Date();

      cy.get('#apd-header-info').contains(
        `Created: ${today.toLocaleDateString('en-US', options)}`
      );

    cy.get('#apd-header-info').contains(`Created: ${  today.toLocaleDateString("en-US", options)}`);
  });

  it('changes the apd name', () => {
    cy.visit('/');
    cy.contains('Create new').click();

    const title1 = 'HITECH IAPD';
    const title2 = 'My Awesome eAPD';
    const title3 = 'Magnus Archive Project';

    cy.get('#apd-title-input').contains(`${title1}`)

    // Change name in APD Summary text box
    cy.focused()
      .should('have.attr', 'name', 'apd-name')
      .clear()
      .type(`${title2}`)
      .blur();

    cy.get('#apd-title-input')
      .contains(`${title2}`)
      .click();

    // Change name via APD Header
    cy.focused()
      .should('have.attr', 'id', 'apd-title-input')
      .clear()
      .type(`${title3}`)
      .blur();

    cy.get('#apd-title-input')
      .contains(`${title3}`);

    // Change name by clicking EDIT button
    cy.get('#title-edit-link')
      .click();

    cy.focused()
      .should('have.attr', 'id', 'apd-title-input')
      .clear()
      .type(`${title2}`)
      .blur();

      cy.get('#apd-title-input')
        .contains(`${title2}`);
      cy.get('[type="checkbox"][checked]').should('have.length', 2);
      cy.get('[type="checkbox"][checked]').each((_, index, list) =>
        years.push(list[index].value)
      );
    });
  });

  describe('Navigation', () => {
    it('confirms Continue buttons redirect to correct sections', () => {
      cy.wrap(pageTitles).each((title, index) => {
        cy.get('.ds-c-vertical-nav__item').contains(title).click();
        cy.get('.ds-h2').should('contain', title);

        if (index < pageTitles.length - 1) {
          cy.get('#continue-button').click();
          cy.get('.ds-h2').should('contain', pageTitles[index + 1]);
        }
      });
    });

    it('confirms Back buttons redirect to correct sections', () => {
      const reversePageTitles = pageTitles.reverse();

      cy.wrap(reversePageTitles).each((title, index) => {
        cy.get('.ds-c-vertical-nav__item').contains(title).click();
        cy.get('.ds-h2').should('contain', title);

        if (index < reversePageTitles.length - 1) {
          cy.get('#previous-button').click();
          cy.get('.ds-h2').should('contain', pageTitles[index + 1]);
        }
      });
    });

    it('confirms side nav buttons redirect to correct sections', () => {
      const pages = [
        { parent: 'APD Overview', label: '' },
        {
          parent: 'Key State Personnel',
          label: 'Key Personnel and Program Management'
        },
        {
          parent: 'Results of Previous Activities',
          label: 'Results of Previous Activities'
        },
        { parent: 'Activities', label: '' },
        { parent: 'Activity Schedule Summary', label: '' },
        { parent: 'Proposed Budget', label: 'Proposed Budget' },
        { parent: 'Assurances and Compliance', label: '' },
        { parent: 'Executive Summary', label: 'Executive Summary' },
        { parent: 'Export and Submit', label: '' }
      ];

      cy.wrap(pages).each(index => {
        if (index.label !== '') {
          // Expand nav menu option
          cy.get('.ds-c-vertical-nav__label--parent')
            .contains(index.parent)
            .then($el => {
              if ($el.attr('aria-expanded') === 'false') {
                // if it's not expanded, expand it
                cy.wrap($el).click();
              }

              // Click on nav submenu button
              cy.get('a.ds-c-vertical-nav__label')
                .contains(index.label)
                .click();
            });
        } else {
          cy.get('a.ds-c-vertical-nav__label').contains(index.parent).click();
        }

        cy.get('.ds-h2').should('contain', index.parent);
      });
    });

    it('confirms anchor links redirect to correct sections', () => {
      const pageWithAnchors = [
        {
          parent: 'Key State Personnel',
          label: 'Key Personnel and Program Management',
          subnav: '#apd-state-profile-key-personnel'
        },
        {
          parent: 'Results of Previous Activities',
          label: 'Prior Activities Overview',
          subnav: ['#prev-activities-outline', '#prev-activities-table']
        },
        {
          parent: 'Proposed Budget',
          label: 'Summary Budget by Activity',
          subnav: [
            '#summary-schedule-by-activity-table',
            '#budget-summary-table',
            '#budget-federal-by-quarter',
            '#budget-incentive-by-quarter'
          ]
        },
        {
          parent: 'Executive Summary',
          label: 'Activities Summary',
          subnav: [
            '#executive-summary-summary',
            '#executive-summary-budget-table'
          ]
        }
      ];

      cy.wrap(pageWithAnchors).each(index => {
        const { subnav } = index;

        cy.get('.ds-c-vertical-nav__label--parent')
          .contains(index.parent)
          .then($el => {
            if ($el.attr('aria-expanded') === 'false') {
              // if it's not expanded, expand it
              cy.wrap($el).click();
            }

            // Click on anchor link
            cy.get('a.ds-c-vertical-nav__label').contains(index.label).click();
          });

        if (Array.isArray(subnav)) {
          cy.wrap(subnav).each(sub => {
            cy.get(sub)
              .then(element => element[0].offsetTop)
              .then(() => cy.window().its('scrollY').should('be.gt', 0))
              .then(offset => cy.window().its('scrollY').should('eq', offset));
          });
        } else {
          cy.get(subnav)
            .then(element => element[0].offsetTop)
            .then(() => cy.window().its('scrollY').should('be.gt', 0))
            .then(offset => cy.window().its('scrollY').should('eq', offset));
        }
      });
    });

    it('should go to the Activity Overview page when edit is clicked in Executive Summary', () => {
      cy.goToExecutiveSummary();

      cy.get('#executive-summary-summary')
        .parent()
        .contains('div', 'Activity 1: Program Administration')
        .parent()
        .parent()
        .findByRole('button', { name: 'Edit' })
        .click();

      cy.findByRole('heading', {
        name: /^Activity 1:/i,
        level: 2
      }).should('exist');
      cy.findByRole('heading', { name: /Activity Overview/i }).should('exist');
    });
  });

  describe('Subforms', () => {
    let activityPage;
    let budgetPage;
    let schedulePage;
    let exportPage;
    let proposedBudgetPage;

    before(() => {
      activityPage = new ActivityPage();
      budgetPage = new BudgetPage();
      schedulePage = new ActivitySchedulePage();
      exportPage = new ExportPage();
      proposedBudgetPage = new ProposedBudgetPage();
    });

    it('should handle entering data in Key State Personnel', () => {
      cy.goToKeyStatePersonnel();
      cy.findByRole('button', { name: /Add Primary Contact/i }).click();
      cy.findByRole('button', { name: /Done/i }).click();

      // Get div for the element containing user data as an alias
      cy.get('.form-and-review-list')
        .findByRole('heading', { name: /1.*/i })
        .parent()
        .parent()
        .as('primaryContactVals');
      // Check for default values
      cy.get('@primaryContactVals')
        .findByRole('heading', {
          name: /Primary Point of Contact name not specified/i
        })
        .should('exist');
      cy.get('@primaryContactVals')
        .find('li')
        .should($lis => {
          expect($lis).to.have.length(2);
          expect($lis.eq(0)).to.contain('Primary APD Point of Contact');
          expect($lis.eq(1)).to.contain('Role not specified');
        });
      // Protects against edge case of having '$' in name or role
      cy.get('@primaryContactVals')
        .contains('Total cost:')
        .next()
        .shouldHaveValue(0);

      cy.get('@primaryContactVals').contains('Delete').should('not.exist');
      cy.get('@primaryContactVals').contains('Edit').should('exist');

      cy.findByRole('button', { name: /Add Key Personnel/i }).click();
      cy.findByRole('button', { name: /Done/i }).click();

      // Check for default values
      cy.get('.form-and-review-list')
        .findByRole('heading', { name: /2.*/i })
        .parent()
        .parent()
        .as('personnelVals');
      cy.get('@personnelVals')
        .findByRole('heading', { name: /Key Personnel name not specified/i })
        .should('exist');
      cy.get('@personnelVals')
        .find('li')
        .should($lis => {
          expect($lis).to.have.length(1);
          expect($lis.eq(0)).to.contain('Role not specified');
        });
      cy.get('@personnelVals')
        .contains('Total cost:')
        .next()
        .shouldHaveValue(0);

      cy.get('@personnelVals').contains('Delete').should('exist');
      cy.get('@personnelVals').contains('Edit').should('exist');

      cy.findByRole('button', { name: /Add Key Personnel/i }).click();
      // Have to force check; cypress does not think radio buttons are visible
      cy.get('input[type="radio"][value="yes"]')
        .scrollIntoView()
        .check({ force: true });
      cy.findByRole('button', { name: /Done/i }).click();

      // Check for default values
      cy.get('.form-and-review-list')
        .findByRole('heading', { name: /3.*/i })
        .parent()
        .parent()
        .as('personnelVals');
      cy.get('@personnelVals')
        .findByRole('heading', { name: /Key Personnel name not specified/i })
        .should('exist');
      cy.get('@personnelVals')
        .find('li')
        .should($lis => {
          expect($lis).to.have.length(1);
          expect($lis.eq(0)).to.contain('Role not specified');
        });

      // Check that FFY, FTE, and Total cost for each applicable year is 0.
      years.forEach(year => {
        cy.get('@personnelVals').should(
          'contain',
          `FFY ${year} Cost: $0 | FTE: 0 | Total: $0`
        );
      });

      cy.get('@personnelVals').contains('Delete').should('exist');
      cy.get('@personnelVals').contains('Edit').should('exist');
    });

    it('should handle entering data in Activity Dashboard', () => {
      cy.goToActivityDashboard();

      // Testing add activity button at end of Activitiy
      cy.contains('Add Activity').click();
      cy.contains('Activity 2').should('exist');
      cy.contains('Delete').should('exist');
      cy.contains('Delete').click();
      cy.findByRole('button', { name: /Delete Activity/i }).click();
      cy.waitForSave();
      cy.contains('Activity 2').should('not.exist');
    });

    it('should handle enter data in Outcomes and Milestones', () => {
      cy.goToOutcomesAndMilestones(0);

      cy.findByRole('button', { name: /Add Outcome/i }).click();

      activityPage.checkTextField('ds-c-field', '', 0); // Outcome
      activityPage.checkTextField('ds-c-field', '', 1); // Metric

      cy.findByRole('button', { name: /Done/i }).click();

      activityPage.checkOutcomeOutput({
        outcome: 'Outcome not specified',
        metrics: ['Metric not specified']
      });

      cy.contains('Edit').click();
      activityPage.checkMetricFunctionality();

      cy.findByRole('button', { name: /Add Milestone/i }).click();
      activityPage.checkInputField('Name', '');
      activityPage.checkDate('Target completion date');
      cy.findByRole('button', { name: /Done/i }).click();

      activityPage.checkMilestoneOutput({
        milestone: 'Milestone not specified',
        targetDate: 'Date not specified'
      });
    });

    it('should handle entering data inState Staff and Expenses', () => {
      cy.goToStateStaffAndExpenses(0);

      cy.findByRole('button', { name: /Add State Staff/i }).click();

      activityPage.checkInputField('Personnel title', '');
      activityPage.checkInputField('Description', '');
      activityPage.checkStateStaffFFY({
        years,
        expectedValue: years.map(() => ({
          cost: '',
          fte: '',
          total: 0
        }))
      });

      cy.findByRole('button', { name: /Done/i }).click();

      activityPage.checkStateStaffOutput({
        name: 'Personnel title not specified',
        years,
        cost: 0,
        fte: 0
      });

      cy.findByRole('button', { name: /Add State Expense/i }).click();
      activityPage.checkInputField('Description', '');
      activityPage.checkFFYinputCostFields({
        years,
        FFYcosts: years.map(() => '')
      });
      cy.findByRole('button', { name: /Done/i }).click();

      activityPage.checkOtherStateExpensesOutput({
        category: 'Category not specified',
        years,
        FFYcosts: [0, 0]
      });
    });

    it('should handle entering data in Private Contractor Costs', () => {
      cy.goToPrivateContractorCosts(0);

      cy.findByRole('button', { name: /Add Contractor/i }).click();

      activityPage.checkTextField('ds-c-field', '');
      activityPage.checkTinyMCE('contractor-description-field-0', '');
      activityPage.checkDate('Contract start date');
      activityPage.checkDate('Contract end date');
      activityPage.checkTextField(
        'ds-c-field ds-c-field--currency ds-c-field--medium',
        '',
        0
      );
      cy.get('[type="radio"][checked]').should('have.value', 'no');
      activityPage.checkFFYinputCostFields({
        years,
        FFYcosts: years.map(() => '')
      });

      cy.findByRole('button', { name: /Done/i }).click();

      activityPage.checkPrivateContractorOutput({
        name: 'Private Contractor or Vendor Name not specified',
        description:
          'Procurement Methodology and Description of Services not specified',
        dateRange: 'Date not specified - Date not specified',
        totalCosts: 0,
        years,
        FFYcosts: [0, 0]
      });
    });

    it('should handle entering data in Budget and FFP', () => {
      cy.goToBudgetAndFFP(0);

      cy.then(() => {
        years.forEach(year => {
          cy.contains(`Budget for FFY ${year}`)
            .parent()
            .parent()
            .within(() => {
              budgetPage.checkSplitFunctionality();

              cy.get('[class="ds-c-field"]').select('75-25');
              budgetPage.checkCostSplitTable({
                federalSharePercentage: 0.75,
                federalShareAmount: 0,
                stateSharePercentage: 0.25,
                stateShareAmount: 0,
                totalComputableMedicaidCost: 0
              });

              cy.get('[class="ds-c-field"]').select('50-50');
              budgetPage.checkCostSplitTable({
                federalSharePercentage: 0.5,
                federalShareAmount: 0,
                stateSharePercentage: 0.5,
                stateShareAmount: 0,
                totalComputableMedicaidCost: 0
              });

              cy.get('[class="ds-c-field"]').select('90-10');
              budgetPage.checkCostSplitTable({
                federalSharePercentage: 0.9,
                federalShareAmount: 0,
                stateSharePercentage: 0.1,
                stateShareAmount: 0,
                totalComputableMedicaidCost: 0
              });
            });
        });
      });

      cy.then(() => {
        years.forEach(year => {
          cy.contains(`Activity 1 Budget for FFY ${year}`)
            .parent()
            .within(() => {
              cy.contains('State Staff')
                .parent()
                .next()
                .should('have.text', 'Not specified (APD Key Personnel)$0')
                .next()
                .should('have.text', 'Not specified (APD Key Personnel)$0')
                .next()
                .should(
                  'have.text',
                  'Not specified (APD Key Personnel)$0×0 FTE=$0'
                )
                .next()
                .should('have.text', 'Personnel title not specified$0× FTE=$0')
                .next()
                .next()
                .next()
                .next()
                .should('have.text', 'Category Not Selected$0')
                .next()
                .next()
                .next()
                .next()
                .should(
                  'have.text',
                  'Private Contractor or Vendor Name not specified$0'
                );
            });
        });
      });
    });

    it('should handle entering data in Activity Schedule Summary', () => {
      cy.goToActivityScheduleSummary();
      schedulePage
        .getAllActivityScheduleMilestoneTables()
        .should('have.length', 1);

      // Activity 1 has index 0
      schedulePage
        .getActivityScheduleMilestoneTableName(0)
        .should('eq', 'Activity 1: Program Administration Milestones');

      // Get the first milestone for Activity 1
      schedulePage.getAllActivityScheduleMilestones(0).should('have.length', 1);
      schedulePage
        .getActivityScheduleMilestoneName(0, 0)
        .should('eq', 'Milestone not specified');
    });

    it('should handle entering data in Proposed Budget', () => {
      cy.goToProposedBudget();

      cy.then(() => {
        years.forEach(year => {
          proposedBudgetPage
            .getBreakdownByFFYAndActivityAndExpense({
              ffy: year,
              index: 0,
              expense: 'State Staff'
            })
            .as('stateStaff');
          cy.get('@stateStaff')
            .eq(0)
            .should('have.text', 'Not specified (APD Key Personnel)$0');
          cy.get('@stateStaff')
            .eq(1)
            .should('have.text', 'Not specified (APD Key Personnel)$0');
          cy.get('@stateStaff')
            .eq(2)
            .should(
              'have.text',
              'Not specified (APD Key Personnel)$0×0 FTE=$0'
            );
          cy.get('@stateStaff')
            .eq(3)
            .should('have.text', 'Personnel title not specified$0× FTE=$0');

          proposedBudgetPage
            .getBreakdownByFFYAndActivityAndExpense({
              ffy: year,
              index: 0,
              expense: 'Other State Expenses'
            })
            .eq(0)
            .should('have.text', 'Category Not Selected$0');

          proposedBudgetPage
            .getBreakdownByFFYAndActivityAndExpense({
              ffy: year,
              index: 0,
              expense: 'Private Contractor'
            })
            .eq(0)
            .should(
              'have.text',
              'Private Contractor or Vendor Name not specified$0'
            );
        });
      });
    });

    it('should display the correct data in Export views', () => {
      cy.goToExportView();

      cy.findByRole('heading', { name: /Key State Personnel/i })
        .parent()
        .as('personnel');

      // Check text data for the first two personnel
      cy.get('@personnel')
        .findByRole('heading', {
          name: /Key Personnel and Program Management/i
        })
        .next()
        .find('ul')
        .first()
        .should(
          'have.text',
          '1. Primary Point of Contact name not specified' +
            'Primary APD Point of Contact' +
            'Role not specified' +
            'Email: ' +
            'Total cost: $0'
        )
        .next()
        .should(
          'have.text',
          '2. Key Personnel name not specified' +
            'Role not specified' +
            'Email: ' +
            'Total cost: $0'
        );

      // Create string to check for personnel who is chargeable for the project for certain years.
      let str = '3. Key Personnel name not specifiedRole not specifiedEmail: ';
      str += years
        .map(year => `FFY ${year} Cost: $0 | FTE: 0 | Total: $0`)
        .join('');

      cy.get('@personnel')
        .findByRole('heading', {
          name: /Key Personnel and Program Management/i
        })
        .next()
        .find('ul')
        .eq(2)
        .should('have.text', str);

      cy.findByRole('heading', {
        name: /Activity 1: Program AdministrationOutcomes and Metrics/i
      })
        .next()
        .next()
        .should('have.text', 'Outcome:  Outcome not specified')
        .next()
        .should('have.text', 'Metrics: 1. Metric not specified')
        .next()
        .next()
        .next()
        .should('have.text', '1. Milestone not specified')
        .next()
        .should('have.text', 'Target completion date:  Date not specified');

      cy.findByRole('heading', {
        name: /Activity 1: Program AdministrationState staff/i
      })
        .next()
        .should('have.text', '1. Personnel title not specified')
        .next()
        .next()
        .should(
          'have.text',
          years
            .map(year => `FFY ${year} Cost: $0 | FTEs: 0 | Total: $0`)
            .join('')
        );

      cy.findByRole('heading', {
        name: /Activity 1: Program AdministrationOther state expenses/i
      })
        .next()
        .should('have.text', '1. Category Not Selected')
        .next()
        .next()
        .should(
          'have.text',
          years.map(year => `FFY ${year} Cost: $0`).join('')
        );

      const privateContractorCosts = years
        .map(year => `FFY ${year} Cost: $0`)
        .join('');
      cy.findByRole('heading', {
        name: /Activity 1: Program AdministrationPrivate Contractor Costs/i
      })
        .next()
        .should(
          'have.text',
          '1. Private Contractor or Vendor Name not specified'
        )
        .next()
        .should(
          'have.text',
          'Procurement Methodology and Description of Services'
        )
        .next()
        .should(
          'have.text',
          'Procurement Methodology and Description of Services not specified'
        )
        .next()
        .should(
          'have.text',
          `Full Contract Term: Date not specified - Date not specifiedTotal Contract Cost: $0${privateContractorCosts}`
        );

      cy.then(() => {
        years.forEach(year => {
          cy.contains(`Activity 1 Budget for FFY ${year}`)
            .parent()
            .within(() => {
              cy.contains('State Staff')
                .parent()
                .next()
                .should('have.text', 'Not specified (APD Key Personnel)$0')
                .next()
                .should('have.text', 'Not specified (APD Key Personnel)$0')
                .next()
                .should(
                  'have.text',
                  'Not specified (APD Key Personnel)$0×0 FTE=$0'
                )
                .next()
                .should('have.text', 'Personnel title not specified$0× FTE=$0')
                .next()
                .next()
                .next()
                .next()
                .should('have.text', 'Category Not Selected$0')
                .next()
                .next()
                .next()
                .next()
                .should(
                  'have.text',
                  'Private Contractor or Vendor Name not specified$0'
                );
            });
        });
      });

      exportPage
        .getAllActivityScheduleMilestoneTables()
        .should('have.length', 1);
      // Activity 1 has index 0
      exportPage
        .getActivityScheduleMilestoneTableName(0)
        .should('eq', 'Activity 1: Program Administration Milestones');
      // Get the first milestone for Activity 1
      exportPage.getAllActivityScheduleMilestones(0).should('have.length', 1);
      exportPage
        .getActivityScheduleMilestoneName(0, 0)
        .should('eq', 'Milestone not specified');

      cy.then(() => {
        years.forEach(year => {
          proposedBudgetPage
            .getBreakdownByFFYAndActivityAndExpense({
              ffy: year,
              index: 0,
              expense: 'State Staff'
            })
            .as('stateStaff');
          cy.get('@stateStaff')
            .eq(0)
            .should('have.text', 'Not specified (APD Key Personnel)$0');
          cy.get('@stateStaff')
            .eq(1)
            .should('have.text', 'Not specified (APD Key Personnel)$0');
          cy.get('@stateStaff')
            .eq(2)
            .should(
              'have.text',
              'Not specified (APD Key Personnel)$0×0 FTE=$0'
            );
          cy.get('@stateStaff')
            .eq(3)
            .should('have.text', 'Personnel title not specified$0× FTE=$0');

          proposedBudgetPage
            .getBreakdownByFFYAndActivityAndExpense({
              ffy: year,
              index: 0,
              expense: 'Other State Expenses'
            })
            .eq(0)
            .should('have.text', 'Category Not Selected$0');

          proposedBudgetPage
            .getBreakdownByFFYAndActivityAndExpense({
              ffy: year,
              index: 0,
              expense: 'Private Contractor'
            })
            .eq(0)
            .should(
              'have.text',
              'Private Contractor or Vendor Name not specified$0'
            );
        });
      });
    });

    it('should handle deleting subform values', () => {
      cy.goToKeyStatePersonnel();

      const deleteKeyPersonnel = name => {
        cy.get('.form-and-review-list')
          .findByRole('heading', { name })
          .parent()
          .parent()
          .contains('Delete')
          .click();
        cy.contains('Delete Key Personnel?').should('exist');
        cy.contains('Cancel').click();
        cy.contains('Delete Key Personnel?').should('not.exist');
        cy.get('.form-and-review-list')
          .findByRole('heading', { name })
          .should('exist');

        cy.get('.form-and-review-list')
          .findByRole('heading', { name })
          .parent()
          .parent()
          .contains('Delete')
          .click();
        cy.get('[class="ds-c-button ds-c-button--danger"]').click();
        cy.waitForSave();
        cy.contains('Delete Key Personnel?').should('not.exist');

        cy.get('.form-and-review-list')
          .findByRole('heading', { name })
          .should('not.exist');
      };

      deleteKeyPersonnel(/3.*/i);
      deleteKeyPersonnel(/2.*/i);

      cy.get('.form-and-review-list')
        .findByRole('heading', { name: /1.*/i })
        .should('exist');
      cy.get('.form-and-review-list')
        .findByRole('heading', { name: /2.*/i })
        .should('not.exist');
      cy.get('.form-and-review-list')
        .findByRole('heading', { name: /3.*/i })
        .should('not.exist');

      cy.goToOutcomesAndMilestones(0);

      activityPage.checkDeleteButton(
        'Outcomes have not been added for this activity.',
        'Delete Outcome and Metrics?',
        'Outcome not specified'
      );

      activityPage.checkDeleteButton(
        'Milestones have not been added for this activity.',
        'Delete Milestone?',
        'Milestone not specified'
      );
      cy.goToStateStaffAndExpenses(0);

      activityPage.checkDeleteButton(
        'State staff have not been added for this activity.',
        'Delete State Staff Expenses?',
        'Personnel title not specified'
      );

      activityPage.checkDeleteButton(
        'Other state expenses have not been added for this activity.',
        'Delete Other State Expense?',
        'Category not specified'
      );

      cy.goToPrivateContractorCosts(0);

      activityPage.checkDeleteButton(
        'Private contractors have not been added for this activity',
        'Delete Private Contractor?',
        'Private Contractor or Vendor Name not specified'
      );
    });
  });

  describe('Delete APD', () => {
    it('deletes the APD', () => {
      cy.useStateStaff();

      cy.get(`a[href='${apdUrl}']`).should('exist');

      cy.get(`a[href='${apdUrl}']`)
        .parent()
        .parent()
        .parent()
        .contains('Delete')
        .click();

      cy.get('.ds-c-button--danger').click();

      cy.get(`a[href='${apdUrl}']`).should('not.exist');
    });
  });
});
