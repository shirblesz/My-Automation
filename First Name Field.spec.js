/// <reference types="Cypress" />
/**
 * First Name Fields
 * 
 * As an Admin
 * I want to show a field of first name in the registration form
 * So that the guest can provide their first name
 * 
 * @see https://studio.cucumber.io/projects/192706/test-plan/folders/1438566
 */


describe('First Name Field', () => {
    beforeEach(function() {

        cy.fixture('builtinfields').then(function(data) {

            this.data = data;
        })

        cy.resetTheOptions()
    })
    it('First name placeholder should be visible', function() {
        //Given Admin user on the Wholesale Lead > Built In Fields ssetting page.
        cy.navigatesToWholesaleLeadSetting("builtin")

        //When Input the First Name - Placeholder field with First Name placeholder.
        cy.setBuiltInFields('firstNamePlaceholder',this.data.first_name.placeholder)

        //and As a guest visit to Wholesale Registration Page.
        cy.goToWholesaleRegistrationPage()

        //Then The First Name placeholder should be visible on the First Name field.
        cy.assertSinglePlaceholder('First Name placeholder')

    })
    it('First name field should be ordered based on order value', function() {
        //Given Admin user on the Wholesale Lead > Built In Fields ssetting page.
        cy.navigatesToWholesaleLeadSetting("builtin")

        //When Input the First Name - Order field with 99.
        cy.setBuiltInFields('firstNameOrder',this.data.first_name.order)

        //and As a guest visit to Wholesale Registration Page.
        cy.goToWholesaleRegistrationPage()

        //Then The First Name field should be located in the last row.
        cy.get('#wwlc-registration-form').find('.wwlc_form_field').last()
            .should('have.id', 'first_name')
    })
    
})


