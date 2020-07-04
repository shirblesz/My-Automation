/// <reference types="Cypress" />
/**
 * Email Fields
 * 
 * As an Admin
 * I want to show a field of email in the registration form
 * So that the guest can provide their email
 * 
 * @see https://studio.cucumber.io/projects/192706/test-plan/folders/1438620
 */


describe('Email Field', () => {
    beforeEach(function() {

        cy.fixture('builtinfields').then(function(data) {

            this.data = data;
        })

        cy.resetTheOptions()
    })
    it('The email address placeholder should be visible', function() {
        //Given Admin user on the Wholesale Lead > Built In Fields ssetting page.
        cy.navigatesToWholesaleLeadSetting("builtin")
        
        //When Input the Email - Placeholder field with Email placeholder.
        cy.setBuiltInFields('emailPlaceholder', this.data.email.placeholder)

        //and As a guest visit to Wholesale Registration page.
        cy.goToWholesaleRegistrationPage()

        //Then The Email placeholder should be visible on the Email field.
        cy.assertSinglePlaceholder('Email placeholder')

    })
    it('The email address field should be ordered based on order value', function() {
        //Given Admin user on the Wholesale Lead > Built In Fields ssetting page.
        cy.navigatesToWholesaleLeadSetting("builtin")

        //When Input the Email - Order field with 0.
        cy.setBuiltInFields('emailOrder', this.data.email.order)

        //and As a guest visit to Wholesale Registration page.
        cy.goToWholesaleRegistrationPage()

        //Then The Email field should be located in the first row.
        cy.get('#wwlc-registration-form').find('.wwlc_form_field').first()
            .should('have.id', 'user_email')
    })
    
})


