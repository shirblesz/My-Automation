/// <reference types="Cypress" />
/**
 * Phone Field
 * 
 * As an Admin
 * I want to show a field for phone number in the registration form
 * So that the guest can provide their phone number
 * 
 * @see https://studio.cucumber.io/projects/192706/test-plan/folders/1502443
 */


describe('Phone Number Field', () => {
    beforeEach(function () {

        cy.fixture('builtinfields').then(function (data) {

            this.data = data;
        })

        cy.resetTheOptions()
    })

    it('The customer should fill out the phone field', () => {
        //Given Admin user on the Wholesale Lead > Built In Fields ssetting page.
        cy.navigatesToWholesaleLeadSetting("builtin")

        //When The Phone field sets to Required.
        cy.setBuiltInCheckbox('phoneRequired', 'checked')
        cy.get('[name="save"]').click()

        //and As a guest visit to Wholesale Registration page.
        cy.goToWholesaleRegistrationPage()

        //and Click on register button.
        cy.get('#wwlc-register').click()

        //Then This field is required error message appears under its field. 
        cy.errorMessage('phone', 'visible')

        //When Input the Phone field with 021-987654
        cy.get('#wwlc_phone').type('021-987654')

        //and Click on register button.
        cy.get('#wwlc-register').click()
        
        //Then The error message should be invisible on the Phone field set.
        cy.errorMessage('phone', 'invisible')

    })
    it('The phone placeholder should be visible', function() {
        //Given Admin user on the Wholesale Lead > Built In Fields ssetting page.
        cy.navigatesToWholesaleLeadSetting("builtin")

        //When Input the Phone - Placeholder field with Phone placeholder.
        cy.setBuiltInFields('phonePlaceholder', this.data.phone.placeholder)

        //and As a guest visit to Wholesale Registration page.
        cy.goToWholesaleRegistrationPage()

        //Then The Phone placeholder should be visible on the Phone field.
        cy.assertSinglePlaceholder('Phone placeholder')

    })
    it('The phone field should be ordered based on order value', function() {
        //Given Admin user on the Wholesale Lead > Built In Fields setting page.
        cy.navigatesToWholesaleLeadSetting("builtin")

        //When Input the Phone - Order field with 0.
        cy.setBuiltInFields('phoneOrder', this.data.phone.order)

        //and As a guest visit to Wholesale Registration page.
        cy.goToWholesaleRegistrationPage()

        //Then The Password field should be located in the first row.
        cy.get('#wwlc-registration-form').find('.wwlc_form_field').first()
             .should('have.id', 'wwlc_phone')

    })
    it('The phone has mask or pattern', () => {
        //Given Admin user on the Wholesale Lead > Built In Fields setting page.
        cy.navigatesToWholesaleLeadSetting("builtin")

        //When Select The phone field with certain pattern
        cy.selectPhonePattern('(000) 000-0000')

        //and As a guest visit to Wholesale Registration page.
        cy.goToWholesaleRegistrationPage()
        
        //and Input the Phone field with 1234567
        cy.get('#wwlc_phone').type('1234567')

        //and Click on register button.
        cy.get('#wwlc-register').click()

        //Then The error message should be visible on the Phone field set.
        cy.get('#wwlc_phone_field > .inline-error').should('have.text', 'Please enter a valid phone number')

    })
    it('The phone is not required to fill out', () => {
        //Given Admin user on the Wholesale Lead > Built In Fields ssetting page.
        cy.navigatesToWholesaleLeadSetting("builtin")

        //When The Phone field sets to not Required.
        cy.setBuiltInCheckbox('phoneRequired', 'unchecked')
        cy.get('[name="save"]').click()

        //and As a guest visit to Wholesale Registration page.
        cy.goToWholesaleRegistrationPage()

        //and Click on register button.
        cy.get('#wwlc-register').click()

        //Then The optional text should be visible on the Phone label.
        cy.get('#wwlc_phone_field > label > .optional').should('be.visible')
        
    })
})


