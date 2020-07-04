
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })


import CustomSetting from "./actionWords/CustomSetting";
import 'cypress-file-upload';


const customField = new CustomSetting();

Cypress.Commands.add('navigatesToWholesaleLeadSetting', (pageEditor = 'general') => {
  cy.wpLogin('admin', 'admin123')
  cy.log(`The user navigates to a new "${pageEditor}" editor`)

  let pageTypeMapping = {
    "builtin" : "wwlc_setting_fields_section",
    "custom"  : "wwlc_setting_custom_fields_section",
    "email"   : "wwlc_setting_email_section",
    "security": "wwlc_settings_security_section",
    "help"    : "wwlc_settings_help_section"
  }

  //transform nice name into correct page directory
  if (pageEditor.toLowerCase() in pageTypeMapping) pageEditor = pageTypeMapping[pageEditor]

  if (pageEditor == 'general') {
    cy.visit('wp-admin/admin.php?page=wc-settings&tab=wwlc_settings')
  } else {
    cy.visit(`wp-admin/admin.php?page=wc-settings&tab=wwlc_settings&section=${pageEditor}`)
  }
})

Cypress.Commands.add("visitBackendPage", (settingLocation) => {
  cy.fixture('users').then(function (data) {
    cy.wordPressLogin(data["admin"]["username"], data["admin"]["password"])
  })
  cy.wooCommerceNavigateToSettingsPage(`WooCommerce > Settings > Wholesale Lead > ${settingLocation}`)
})


Cypress.Commands.add("goToUsersPage", () => {
  cy.wordPressLogin('admin', 'admin123')
  cy.visit('wp-admin/users.php')
})

Cypress.Commands.add("goToWholesaleRegistrationPage", () => {
  cy.wordPressLogout()
  cy.visit('wholesale-registration-page')
})

Cypress.Commands.add("goToWholesaleLoginPage", () => {
  cy.wordPressLogout()
  cy.visit('shop')
  cy.contains('Wholesale Log In Page').click()
  Cypress.on('uncaught:exception', (err, runnable) => { return false })
})

Cypress.Commands.add("wpLogin", (wUserLogin, wUserPass) => {
  cy.visit('wp-admin/')
  cy.wait(150)
  cy.get('#user_login').type(`${wUserLogin}`)
  cy.get('#user_pass').type(`${wUserPass}`)
  cy.get('#wp-submit').click()
  Cypress.on('uncaught:exception', (err, runnable) => { return false })
})

Cypress.Commands.add("getNewUser", (firstName, lastName, emailAccount) => {
  cy.get('#first_name').type(`${firstName}`)
  cy.get('#last_name').type(`${lastName}`)
  cy.get('#user_email').type(`${emailAccount}`)
  cy.get('#wwlc-register').click()
})

Cypress.Commands.add("deleteNewUsers", () => {
  cy.request({
    method: 'POST',
    url: 'http://localhost/regression/wp-json/cypress-helper-plugin/v1/user/delete',
    form: true,
    //failOnStatusCode: false,
    body: {
      "users": ['test@rymera.test', 'test1@rymera.test'],
    }
  }).then((response) => {
    cy.log(response.body)
  })

})

Cypress.Commands.add("resetTheOptions", () => {
  cy.request({
    method: 'POST',
    url: 'http://localhost/regression/wp-json/cypress-helper-plugin/v1/clean/option',
    form: true,
    //failOnStatusCode: false,
    body: {
      'delete': ['wwlc_fields_first_name_field_order', 'wwlc_fields_first_name_field_placeholder', 'wwlc_fields_last_name_field_order',
        'wwlc_fields_last_name_field_placeholder', 'wwlc_fields_phone_field_order', 'wwlc_fields_phone_field_placeholder', 'wwlc_fields_phone_mask_pattern',
        'wwlc_fields_email_field_order', 'wwlc_fields_email_field_placeholder', 'wwlc_fields_username_order', 'wwlc_fields_username_placeholder', 'wwlc_fields_company_name_field_order',
        'wwlc_fields_company_field_placeholder', 'wwlc_fields_address_field_order', 'wwlc_fields_password_field_order', 'wwlc_fields_password_field_placeholder', 
        'wwlc_option_registration_form_custom_fields', 'wwlc_fields_enable_confirm_password_field'],
      'update': [
        {
          'name': 'wwlc_fields_address_placeholder',
          'value': 'Street address'
        },
        {
          'name': 'wwlc_fields_address2_placeholder',
          'value': 'Apartment, suite, unit etc. (optional)'
        },
        {
          'name': 'wwlc_fields_city_placeholder',
          'value': 'Town / City'
        },
        {
          'name': 'wwlc_fields_state_placeholder',
          'value': 'State / County'
        },
        {
          'name': 'wwlc_fields_postcode_placeholder',
          'value': 'Postcode / Zip'
        },
        {
          'name': 'wwlc_general_login_page',
          'value': '49'
        },
        {
          'name': 'wwlc_general_registration_page',
          'value': '48'
        },
        {
          'name': 'wwlc_general_registration_thankyou',
          'value': '50'
        }
      ]
    }
  })
    .then((response) => {
      cy.log(response.body)
    })
})

Cypress.Commands.add("mappingMessageField", (ID) => {
  let mappingFields = {
    "firstName"     : "#first_name_field > .inline-error",
    "lastName"      : "#last_name_field > .inline-error",
    "phone"         : "#wwlc_phone_field > .inline-error",
    "email"         : "#user_email_field > .inline-error",
    "passwordField" : ".wwlc_password-field-set > .inline-error",
    "usernameField" : "#wwlc_username_field > .inline-error",
    "companyName"   : "#wwlc_company_name_field > .inline-error",
    "address"       : "#wwlc_address_field > .inline-error",
    "city"          : "#wwlc_city_field > .inline-error",
    "state"         : "#wwlc_state_field > .inline-error",
    "postcode"      : "#wwlc_postcode_field > .inline-error"
  }
  cy.get(mappingFields[ID])
})

Cypress.Commands.add("errorMessage", (fieldName, visibility) => {
  if (visibility == "visible") {
    cy.mappingMessageField(`${fieldName}`).should('have.text', 'This field is required')
  } else if (visibility == "invisible") {
    cy.mappingMessageField(`${fieldName}`).should('not.be.visible')
  } 
})

Cypress.Commands.add("addressErrorMessage", () => {
 
})


Cypress.Commands.add("addressNotRequired", () => {
  cy.get('#wwlc_country_field > label > .optional')
  cy.get('#wwlc_address_field > label > .optional')
  cy.get('#wwlc_city_field > label > .optional')
  cy.get('#wwlc_state_field > label > .optional')
  cy.get('#wwlc_postcode_field > label > .optional')
})

Cypress.Commands.add("inputAddressFields", () => {
  //cy.get('.select2-selection > #select2-wwlc_country-container')
  cy.get('#wwlc_address').type('1811 Volt Apartment Queen st')
  cy.get('#wwlc_city').type('Brisbane')
  cy.get('#wwlc_state').type('Queensland')
  cy.get('#wwlc_postcode').type('4051')
})

Cypress.Commands.add("removeAddressFields", () => {
  cy.assertInvisibleFields([
    "#wwlc_country", "#wwlc_address", "#wwlc_city", "#wwlc_state", "#wwlc_postcode"
  ])
})

Cypress.Commands.add("assertInvisibleFields", (invFields) => {
  invFields.forEach(function (value, index, array) {
    cy.get(`${value}`).should('not.be.visible')
  })
})

Cypress.Commands.add("assertDefaultAddressPlaceholders", () => {
  cy.assertPlaceholder([
    "Street address", "Apartment, suite, unit etc. (optional)", "Town / City",
    "State / County", "Postcode / Zip"
  ])
})

Cypress.Commands.add("assertUpdatedAddressPlaceholder", () => {
  let placeholders = [
    "Address placeholder", "Address Line 2 placeholder",
    "City placeholder", "State placeholder", "Postcode placeholder"
  ]
  cy.assertPlaceholder(placeholders)
})
Cypress.Commands.add("assertPlaceholder", (placeholders) => {
  placeholders.forEach(function (value, index, array) {
    cy.get(`input[placeholder="${value}"]`).should('be.visible')
  });
})

Cypress.Commands.add("assertSinglePlaceholder", (pholder) => {
  cy.get(`input[placeholder="${pholder}"]`).should('be.visible')
})

Cypress.Commands.add("inputAddressPlaceholders", () => {
  cy.goToLeadBuiltInPage()
  builtIn.setAddressPlaceholder().clear().type('Address placeholder')
  builtIn.setAddressLine2Placeholder().clear().type('Address Line 2 placeholder')
  builtIn.setAddressCityPlaceholder().clear().type('City placeholder')
  builtIn.setAddressStatePlaceholder().clear().type('State placeholder')
  builtIn.setAddressPostcodePlaceholder().clear().type('Postcode placeholder')
  cy.get('[name="save"]').click()
  cy.goToRegistrationPage()
})

// Cypress.Commands.add("assertUpdatedAddressPlaceholder", () => {
//   cy.get('input[placeholder="Address placeholder"]').should('be.visible')
//   cy.get('input[placeholder="Address Line 2 placeholder"]').should('be.visible')
//   cy.get('input[placeholder="City placeholder"]').should('be.visible')
//   cy.get('input[placeholder="State placeholder"]').should('be.visible')
//   cy.get('input[placeholder="Postcode placeholder"]').should('be.visible')
//   cy.assertPlaceholder("Address placeholder")
// })

// Cypress.Commands.add("assertPlaceholder", (placeholder) => {
//   cy.get(`input[placeholder="${placeholder}"]`).should('be.visible')

// })
Cypress.Commands.add("commonCustomFields", (fname, fid) => {
  customField.setFieldName().type(`${fname}`)
  customField.setFieldID().type(`${fid}`)
  customField.setFieldType().select(`${fname}`)
  customField.setFieldOrder().type('0')
  customField.setFieldEnabled().check().should('be.checked')

})

Cypress.Commands.add("customPlaceholder", (fplaceholder) => {
  customField.setFieldPlaceholder().type(`${fplaceholder}`)
})

Cypress.Commands.add("getTextFieldType", () => {
  cy.commonCustomFields('Text', 'text')
  customField.setFieldRequired().check()
  cy.customPlaceholder('Text Placeholder')
  customField.setFieldDefaultValue().type('lorem ipsum')

})

Cypress.Commands.add("getTextAreaFieldType", () => {
  cy.commonCustomFields('Text Area', 'text_area')
  customField.setFieldRequired().check()
  cy.customPlaceholder('Text Area Placeholder')
  customField.setFieldDefaultValue().type('lorem ipsum')

})

Cypress.Commands.add("getNumberFieldType", () => {
  cy.commonCustomFields('Number', 'number')
  customField.setFieldAttrMin().type('10')
  customField.setFieldAttrMax().type('20')
  customField.setFieldAttrStep().type('2')
  customField.setFieldRequired().check()
  cy.customPlaceholder('Number Placeholder')
  customField.setFieldDefaultValue().type('14')

})

Cypress.Commands.add("getEmailFieldType", () => {
  cy.commonCustomFields('Email', 'email')
  customField.setFieldRequired().check()
  cy.customPlaceholder('Email Placeholder')
  customField.setFieldDefaultValue().type('test@rymera.test')

})

Cypress.Commands.add("getUrlFieldType", () => {
  cy.commonCustomFields('Url', 'url')
  customField.setFieldRequired().check()
  cy.customPlaceholder('URL Placeholder')

})

Cypress.Commands.add("mainOptionFields", (opFields) => {
  if (opFields === 'select') {
    customField.setOptionText(opFields).type('--Select--')
  } else {
    customField.setOptionValue(opFields).type('1')
    customField.setOptionText(opFields).type('One')
  }
})

Cypress.Commands.add("getOptions", (chooseOption) => {
  if (chooseOption === 'select') {
    cy.mainOptionFields('select')
  }
  else if (chooseOption === 'radio') {
    cy.mainOptionFields('radio')
  }
  else if (chooseOption === 'checkbox') {
    cy.mainOptionFields('checkbox')
  }
  cy.clickAddOptions(chooseOption)
  cy.get(':nth-child(2) > .option_value').type('2')
  cy.get(':nth-child(2) > .option_text').type('Two')
})

Cypress.Commands.add("clickAddOptions", (addOption) => {
  customField.setOptionAdd(addOption).click()
})

Cypress.Commands.add("getSelectFieldType", () => {
  cy.commonCustomFields('Select', 'select')
  customField.setFieldRequired().check()
})

Cypress.Commands.add("getRadioFieldType", () => {
  cy.commonCustomFields('Radio', 'radio')
  customField.setFieldRequired().check()
})

Cypress.Commands.add("getCheckboxFieldType", () => {
  cy.commonCustomFields('Checkbox', 'checkbox')
  customField.setFieldRequired().check()
})

Cypress.Commands.add("getHiddenFieldType", () => {
  cy.commonCustomFields('Hidden', 'hidden')
  customField.setFieldPlaceholder().type('lorem ipsum')
})

Cypress.Commands.add("getFileFieldType", () => {
  cy.commonCustomFields('File', 'file')
  customField.setFieldFileType().clear().type('jpg')
  customField.setFieldFileSize().clear().type('1')
  customField.setFieldRequired().check()
})

Cypress.Commands.add("getIFrameFieldType", (chooseIFrame) => {
  let iframeType = chooseIFrame
  if (chooseIFrame === "content") {
    cy.commonCustomFields('Content', 'content')
  }
  else if (chooseIFrame === "terms&conditions") {
    cy.commonCustomFields('Terms & Conditions', 'termsconditions')
  }
  cy.frameLoaded('#wwlc_cf_field_default_value_ifr').then($element => {
    const $body = $element.contents().find('body')
    cy.wrap($body).click().type(`Hello, this is ${iframeType}`)

  })
})

Cypress.Commands.add("getUploadFile", (fileName) => {

  cy.get('[name="file"]').attachFile(`/images/${fileName}`)
  if (fileName === "test-text.txt") {
    cy.get('.file-field-set > .inline-error').should('include.text', 'is not supported')
  }
  else if (fileName === "test-hd-image.jpg") {
    cy.get('.file-field-set > .inline-error').should('include.text', 'exceeds the maximum')
  }
  else {
    cy.get('.file-field-set > .inline-error').should('not.be.visible')
  }

})




//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
