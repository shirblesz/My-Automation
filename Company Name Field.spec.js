/// <reference types="Cypress" />
/**
 * Company Name Fields
 * 
 * As an Admin
 * I want to show a field of company name in the registration form
 * So that the customers can provide their company name
 * 
 * @see https://studio.cucumber.io/projects/192706/test-plan/folders/1470101
 */


describe('Company Name Field', () => {
    beforeEach(function () {

        cy.fixture('builtinfields').then(function (data) {

            this.data = data;
        })

        cy.resetTheOptions()
    })
    
    it('The customer should enter the company name', () => {
        //Given Admin user on the Wholesale Lead > Built In Fields ssetting page.
        cy.navigatesToWholesaleLeadSetting("builtin")

        //When The Company Name field sets to Enabled.
        cy.setBuiltInCheckbox('companyNameEnabled', 'checked')

        //and The Company Name field sets to Required.
        cy.setBuiltInCheckbox('companyNameRequired', 'checked')
        cy.get('[name="save"]').click()
        
        //and As a guest visit to Wholesale Registration page.
        cy.goToWholesaleRegistrationPage()

        //and Click on register button.
        cy.get('#wwlc-register').click()

        //Then This field is required error message appears under its field. 
        cy.errorMessage('companyName', 'visible')
        
        //When Input the Company Name field with Rymera
        cy.get('#wwlc_company_name').type('Rymera')

        //and Click on register button.
        cy.get('#wwlc-register').click()

        //Then The error message should be invisible on the Company Name field set.
        cy.errorMessage('companyName', 'invisible')

    })
    it('The company placeholder should be visible', function() {
        //Given Admin user on the Wholesale Lead > Built In Fields ssetting page.
        cy.navigatesToWholesaleLeadSetting("builtin")

        //When The Company Name field sets to Enabled.
        cy.setBuiltInCheckbox('companyNameEnabled', 'checked')

        //and Input the Company Name - Placeholder field with Company placeholder.
        cy.setBuiltInFields('companyNamePlaceholder', this.data.company.placeholder)

        //and As a guest visit to Wholesale Registration page.
        cy.goToWholesaleRegistrationPage()

        //Then The Company placeholder should be visible on the Company Name field.
        cy.assertSinglePlaceholder('Company placeholder')

    })
    it('The company field should be ordered based on order value', function() {
        //Given Admin user on the Wholesale Lead > Built In Fields setting page.
        cy.navigatesToWholesaleLeadSetting("builtin")

        //When The Company Name field sets to Enabled.
        cy.setBuiltInCheckbox('companyNameEnabled', 'checked')

        //and Input the Company Name - Order field with 0.
        cy.setBuiltInFields('companyNameOrder', this.data.company.order)

        //and As a guest visit to Wholesale Registration page.
        cy.goToWholesaleRegistrationPage()

        //Then The Company Name field should be located in the first row.
        cy.get('#wwlc-registration-form').find('.wwlc_form_field').first()
            .should('have.id', 'wwlc_company_name')

    })
    it('The company field is not required to fill out', () => {
        //Given Admin user on the Wholesale Lead > Built In Fields setting page.
        cy.navigatesToWholesaleLeadSetting("builtin")

        //When The Company Name field sets to Enabled.
        cy.setBuiltInCheckbox('companyNameEnabled', 'checked')

        //and The Company Name field sets to not Required.
        cy.setBuiltInCheckbox('companyNameRequired', 'unchecked')
        cy.get('[name="save"]').click()

        //and As a guest visit to Wholesale Registration page.
        cy.goToWholesaleRegistrationPage()
        
        //Then The optional text should be visible on the Company Name field set.
        cy.get('#wwlc_company_name_field > label > .optional').should('be.visible')

    })
    it('The company field should not display on the registration page', () => {
        //Given Admin user on the Wholesale Lead > Built In Fields setting page.
        cy.navigatesToWholesaleLeadSetting("builtin")

        //When The Company Name field sets to Disabled.
        cy.setBuiltInCheckbox('companyNameEnabled', 'unchecked')
        cy.get('[name="save"]').click()

        //and As a guest visit to Wholesale Registration page.
        cy.goToWholesaleRegistrationPage()
        
        //Then The Company Name field should be invisible on the registration page.
        cy.get('#wwlc_company_name').should('not.be.visible')

    })

})


