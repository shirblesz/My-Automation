/// <reference types="Cypress" />
/**
 * Password Fields
 * 
 * As an Admin
 * I want to show a field of customer's password in the registration form
 * So that the guest can provide their password
 * 
 * @see https://studio.cucumber.io/projects/192706/test-plan/folders/1438669
 */


describe('Password Field', () => {
    beforeEach(function () {

        cy.fixture('builtinfields').then(function (data) {

            this.data = data;
        })

        cy.resetTheOptions()
    })
    it('The customer should create a new password', () => {
        //Given Admin user on the Wholesale Lead > Built In Fields ssetting page.
        cy.navigatesToWholesaleLeadSetting("builtin")

        //When The Password field sets to Enabled.
        cy.setBuiltInCheckbox('passwordEnabled', 'checked')

        //and The Password field sets to Required.
        cy.setBuiltInCheckbox('passwordRequired', 'checked')
        cy.get('[name="save"]').click()
        
        //and As a guest visit to Wholesale Registration page.
        cy.goToWholesaleRegistrationPage()

        //and Click on register button.
        cy.get('#wwlc-register').click()

        //Then This field is required error message appears under its field. 
        cy.errorMessage('passwordField', 'visible')

        //When Input the Password field with Test4utomation@123
        cy.get('#wwlc_password').type('Test4utomation@123')

        //and Click on register button.
        cy.get('#wwlc-register').click()

        //Then The error message should be invisible on the Password field set.
        cy.errorMessage('passwordField', 'invisible')

    })
    it('The password placeholder should be visible', function() {
        //Given Admin user on the Wholesale Lead > Built In Fields ssetting page.
        cy.navigatesToWholesaleLeadSetting("builtin")

        //When The Password field sets to Enabled.
        cy.setBuiltInCheckbox('passwordEnabled', 'checked')

        //and Input the Password - Placeholder field with Password placeholder.
        cy.setBuiltInFields('passwordPlaceholder', this.data.userpassword.placeholder)

        //and As a guest visit to Wholesale Registration page.
        cy.goToWholesaleRegistrationPage()

        //Then The Password placeholder should be visible on the Password field.
        cy.assertSinglePlaceholder('Password placeholder')

    })
    it('The password field should be ordered based on order value', function() {
        //Given Admin user on the Wholesale Lead > Built In Fields setting page.
        cy.navigatesToWholesaleLeadSetting("builtin")

        //When The Password field sets to Enabled.
        cy.setBuiltInCheckbox('passwordEnabled', 'checked')

        //and Input the Password - Order field with 0.
        cy.setBuiltInFields('passwordOrder', this.data.userpassword.order)

        //and As a guest visit to Wholesale Registration page.
        cy.goToWholesaleRegistrationPage()

        //Then The Password field should be located in the first row.
        cy.get('#wwlc-registration-form').find('.wwlc_form_field').first()
            .should('have.id', 'wwlc_password')

    })
    it('The customer should fill out the confirm password field', () => {
        //Given Admin user on the Wholesale Lead > Built In Fields ssetting page.
        cy.navigatesToWholesaleLeadSetting("builtin")

        //When The Password field sets to Enabled.
        cy.setBuiltInCheckbox('passwordEnabled', 'checked')
        
        //and The Add Password Confirmation field sets to Enabled.
        cy.setBuiltInCheckbox('confirmPasswordEnabled', 'checked')
        cy.get('[name="save"]').click()

        //and As a guest visit to Wholesale Registration page.
        cy.goToWholesaleRegistrationPage()
        
        //and Input the required field with correct data.
        cy.get('#first_name').type('Customer')
        cy.get('#last_name').type('Account')
        cy.get('#user_email').type('customer@rymera.test')
        cy.get('#wwlc_password').type('Test4utomation@123')

        //and Click on register button.
        cy.get('#wwlc-register').click()

        //Then Password does not match the confirm password error message appears under its field. 
        cy.get('#wwlc_password_confirm').siblings('span.inline-error').should('have.text', 'Password does not match the confirm password.')

    })
    it("The confirmation password should match with password", () => {
        //Given Admin user on the Wholesale Lead > Built In Fields ssetting page.
        cy.navigatesToWholesaleLeadSetting("builtin")

        //When The Password field sets to Enabled.
        cy.setBuiltInCheckbox('passwordEnabled', 'checked')
        
        //and The Add Password Confirmation field sets to Enabled.
        cy.setBuiltInCheckbox('confirmPasswordEnabled', 'checked')
        cy.get('[name="save"]').click()

        //and As a guest visit to Wholesale Registration page.
        cy.goToWholesaleRegistrationPage()
        
        //and Input the password and Confirm password field with different data.
        cy.get('#wwlc_password').type('Test4utomation@123')
        cy.get('#wwlc_password_confirm').type('TestAutomation@123')

        //and Click on register button.
        cy.get('#wwlc-register').click()

        //Then Mismatch error message appears under its field. 
        cy.get('#wwlc-password-strength').should('have.text', 'Mismatch')

    })
    it('The password field is not required to fill out', () => {
        //Given Admin user on the Wholesale Lead > Built In Fields ssetting page.
        cy.navigatesToWholesaleLeadSetting("builtin")

        //When The Password field sets to Enabled.
        cy.setBuiltInCheckbox('passwordEnabled', 'checked')
        
        //and The Password field sets to not Required.
        cy.setBuiltInCheckbox('passwordRequired', 'unchecked')
        
        //and As a guest visit to Wholesale Registration page.
        cy.goToWholesaleRegistrationPage()
        
        //Then The asterisk/required icon should be invisible on the Password label.
        cy.get('#wwlc_password').find('data-required').should('not.be.visible')
        
    })
    it('The password field should not display on the registration page', () => {
        //Given Admin user on the Wholesale Lead > Built In Fields ssetting page.
        cy.navigatesToWholesaleLeadSetting("builtin")

        //When The Password field sets to Disabled.
        cy.setBuiltInCheckbox('passwordEnabled', 'unchecked')
        
        //and As a guest visit to Wholesale Registration page.
        cy.goToWholesaleRegistrationPage()

        //Then The Password field should be invisible on the registration page.
        cy.get('#wwlc_password').should('not.be.visible')
    })

})


