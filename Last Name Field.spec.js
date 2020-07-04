/// <reference types="Cypress" />
/**
 * Last Name Fields
 * 
 * As an Admin
 * I want to show a field of last name in the registration form
 * So that the guest can provide their last name
 * 
 * @see https://studio.cucumber.io/projects/192706/test-plan/folders/1438567
 */


describe('Last Name Field', () => {
    beforeEach(function() {

        cy.fixture('builtinfields').then(function(data) {

            this.data = data;
        })

        cy.resetTheOptions()
    })
    it('The last name placeholder should be visible', function() {
        //Given Admin user on the Wholesale Lead > Built In Fields ssetting page.
        cy.navigatesToWholesaleLeadSetting("builtin")

        //When Input the Last Name - Placeholder field with Last Name placeholder.
        cy.setBuiltInFields('lastNamePlaceholder', this.data.last_name.placeholder)

        //and As a guest visit to Wholesale Registration page.
        cy.goToWholesaleRegistrationPage()

        //Then The Last Name placeholder should be visible on the Last Name field.
        cy.get('#last_name').invoke('attr', 'placeholder').then(function (ph) {
            const phText = ph.includes('Last Name placeholder')
            expect(phText).to.be.true
            cy.log(ph)
        })

    })
    it('The last name field should be ordered based on order value', function() {
        //Given Admin user on the Wholesale Lead > Built In Fields ssetting page.
        cy.navigatesToWholesaleLeadSetting("builtin")

        //When Input the Last Name - Order field with 0.
        cy.setBuiltInFields('lastNameOrder', this.data.last_name.order)

        //and As a guest visit to Wholesale Registration page.
        cy.goToWholesaleRegistrationPage()

        //Then The Last Name field should be located in the first row.
        cy.get('#wwlc-registration-form').find('.wwlc_form_field').first()
            .should('have.id', 'last_name')
    })
   
})


