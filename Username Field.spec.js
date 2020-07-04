/// <reference types="Cypress" />
/**
 * Username Fields
 * 
 * As an Admin
 * I want to show a field of username in the registration form
 * So that the guest can provide their username
 * 
 * @see https://studio.cucumber.io/projects/192706/test-plan/folders/1438654
 */


describe('Username Field', () => {
    beforeEach(function () {

        cy.fixture('builtinfields').then(function (data) {

            this.data = data;
        })

        cy.resetTheOptions()
    })
    it('The username placeholder should be visible', function () {
        //Given Admin user on the Wholesale Lead > Built In Fields ssetting page.
        cy.navigatesToWholesaleLeadSetting("builtin")

        //When The Username field sets to Enabled.
        cy.setBuiltInCheckbox('usernameEnabled', 'checked')

        //and Input the Username - Placeholder field with Username Placeholder.
        cy.setBuiltInFields('usernamePlaceholder', this.data.username.placeholder)

        //and As a guest visit to Wholesale Registration page.
        cy.goToWholesaleRegistrationPage()

        //Then The Username Placeholder should be visible on the Username field.
        cy.assertSinglePlaceholder('Username placeholder')
        

    })
    it('The customer should create a new username', () => {
        //Given Admin user on the Wholesale Lead > Built In Fields ssetting page.
        cy.navigatesToWholesaleLeadSetting("builtin")

        //When The Username field sets to Enabled.
        cy.setBuiltInCheckbox('usernameEnabled', 'checked')
        cy.get('[name="save"]').click()
        
        //and As a guest visit to Wholesale Registration page.
        cy.goToWholesaleRegistrationPage()

        //and Click on register button.
        cy.get('#wwlc-register').click()

        //Then This field is required error message appears under its field. 
        cy.errorMessage('usernameField', 'visible')

        //When Input the Username field with customer
        cy.get('#wwlc_username').type('customer')

        //and Click on register button.
        cy.get('#wwlc-register').click()

        //Then The error message should be invisible on the Username field set.
        cy.errorMessage('usernameField', 'invisible')

    })
    it('The username field should be ordered based on order value', function () {
        //Given Admin user on the Wholesale Lead > Built In Fields ssetting page.
        cy.navigatesToWholesaleLeadSetting("builtin")

        //When The Username field sets to Enabled.
        cy.setBuiltInCheckbox('usernameEnabled', 'checked')

        //and Input the Username - Order field with 0.
        cy.setBuiltInFields('usernameOrder', this.data.username.order)

        //and As a guest visit to Wholesale Registration page.
        cy.goToWholesaleRegistrationPage()

        //Then The Username field should be located in the first row.
        cy.get('#wwlc-registration-form').find('.wwlc_form_field').first()
            .should('have.id', 'wwlc_username')

    })
    
    it('The username field should not display on the registration page', () => {
        //Given Admin user on the Wholesale Lead > Built In Fields ssetting page.
        cy.navigatesToWholesaleLeadSetting("builtin")

        //When The Username field sets to Disabled.
        cy.setBuiltInCheckbox('usernameEnabled', 'unchecked')

        //and As a guest visit to Wholesale Registration page.
        cy.goToWholesaleRegistrationPage()

        //Then The Username field should be invisible on the registration page.
        cy.get('#wwlc_username').should('not.be.visible')

    })
})


