// EasyCalc - Playwright Test Suite
// Setup: npm init -y && npm install -D @playwright/test && npx playwright install
// Run:   npx playwright test easycalc.spec.js
// Run 1: npx playwright test easycalc.spec.js --headed  (to see the browser)

const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://shirblesz.github.io/easycalc/';

// ===== HELPERS =====

async function getDisplay(page) {
  return await page.locator('.display-main').textContent();
}

async function getHistory(page) {
  return await page.locator('.history').textContent();
}

async function pressBtn(page, label) {
  await page.locator(`.calc-btn[data-label="${label}"]`).click();
}

async function pressButtons(page, labels) {
  for (const label of labels) {
    await pressBtn(page, label);
  }
}

async function typeCalc(page, text) {
  const input = page.locator('#textInput');
  await input.fill(text);
  await page.locator('#goBtn').click();
}

// ==========================================
// BASIC BUTTON OPERATIONS
// ==========================================

test.describe('Basic Button Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('displays 0 on load', async ({ page }) => {
    expect(await getDisplay(page)).toBe('0');
  });

  test('enters single digit', async ({ page }) => {
    await pressBtn(page, '5');
    expect(await getDisplay(page)).toBe('5');
  });

  test('enters multi-digit number', async ({ page }) => {
    await pressButtons(page, ['1', '2', '3']);
    expect(await getDisplay(page)).toBe('123');
  });

  test('addition: 25 + 30 = 55', async ({ page }) => {
    await pressButtons(page, ['2', '5', '+', '3', '0', '=']);
    expect(await getDisplay(page)).toBe('55');
  });

  test('subtraction: 100 - 37 = 63', async ({ page }) => {
    await pressButtons(page, ['1', '0', '0', '-', '3', '7', '=']);
    expect(await getDisplay(page)).toBe('63');
  });

  test('multiplication: 6 × 39 = 234', async ({ page }) => {
    await pressButtons(page, ['6', '×', '3', '9', '=']);
    expect(await getDisplay(page)).toBe('234');
  });

  test('division: 144 ÷ 12 = 12', async ({ page }) => {
    await pressButtons(page, ['1', '4', '4', '÷', '1', '2', '=']);
    expect(await getDisplay(page)).toBe('12');
  });

  test('division by zero shows Error', async ({ page }) => {
    await pressButtons(page, ['5', '÷', '0', '=']);
    expect(await getDisplay(page)).toBe('Error');
  });

  test('clear resets everything', async ({ page }) => {
    await pressButtons(page, ['5', '+', '3']);
    await pressBtn(page, 'C');
    expect(await getDisplay(page)).toBe('0');
    expect(await getHistory(page)).toBe('');
  });

  test('backspace removes last digit', async ({ page }) => {
    await pressButtons(page, ['1', '2', '3']);
    await pressBtn(page, '⌫');
    expect(await getDisplay(page)).toBe('12');
  });

  test('backspace on single digit shows 0', async ({ page }) => {
    await pressBtn(page, '5');
    await pressBtn(page, '⌫');
    expect(await getDisplay(page)).toBe('0');
  });
});

// ==========================================
// DECIMAL OPERATIONS
// ==========================================

test.describe('Decimal Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('enters decimal: 3.5', async ({ page }) => {
    await pressButtons(page, ['3', '.', '5']);
    expect(await getDisplay(page)).toBe('3.5');
  });

  test('decimal multiply: 3.5 × 2 = 7', async ({ page }) => {
    await pressButtons(page, ['3', '.', '5', '×', '2', '=']);
    expect(await getDisplay(page)).toBe('7');
  });

  test('prevents double decimal', async ({ page }) => {
    await pressButtons(page, ['3', '.', '5', '.', '2']);
    expect(await getDisplay(page)).toBe('3.52');
  });

  test('5 × 2.6 = 13', async ({ page }) => {
    await pressButtons(page, ['5', '×', '2', '.', '6', '=']);
    expect(await getDisplay(page)).toBe('13');
  });

  test('decimal after operator: 5 + .5 = 5.5', async ({ page }) => {
    await pressButtons(page, ['5', '+', '.', '5', '=']);
    expect(await getDisplay(page)).toBe('5.5');
  });
});

// ==========================================
// PLUS/MINUS (NEGATIVE NUMBERS)
// ==========================================

test.describe('Plus/Minus Button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('toggles to negative', async ({ page }) => {
    await pressBtn(page, '5');
    await pressBtn(page, '±');
    expect(await getDisplay(page)).toBe('-5');
  });

  test('toggles back to positive', async ({ page }) => {
    await pressBtn(page, '5');
    await pressBtn(page, '±');
    await pressBtn(page, '±');
    expect(await getDisplay(page)).toBe('5');
  });

  test('± after operator: 45 × ±6 = -270', async ({ page }) => {
    await pressButtons(page, ['4', '5', '×']);
    await pressBtn(page, '±');
    await pressButtons(page, ['6', '=']);
    expect(await getDisplay(page)).toBe('-270');
  });

  test('± on second number: 45 × 6 ± = -270', async ({ page }) => {
    await pressButtons(page, ['4', '5', '×', '6']);
    await pressBtn(page, '±');
    await pressBtn(page, '=');
    expect(await getDisplay(page)).toBe('-270');
  });
});

// ==========================================
// PERCENT
// ==========================================

test.describe('Percent Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('50% = 0.5', async ({ page }) => {
    await pressButtons(page, ['5', '0']);
    await pressBtn(page, '%');
    expect(await getDisplay(page)).toBe('0.5');
  });

  test('10 × 10% = 1', async ({ page }) => {
    await pressButtons(page, ['1', '0', '×', '1', '0']);
    await pressBtn(page, '%');
    await pressBtn(page, '=');
    expect(await getDisplay(page)).toBe('1');
  });

  test('200 × 50% = 100', async ({ page }) => {
    await pressButtons(page, ['2', '0', '0', '×', '5', '0']);
    await pressBtn(page, '%');
    await pressBtn(page, '=');
    expect(await getDisplay(page)).toBe('100');
  });
});

// ==========================================
// CHAINED CALCULATIONS (BUTTONS)
// ==========================================

test.describe('Chained Calculations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('5 + 3 = 8, then + 2 = 10', async ({ page }) => {
    await pressButtons(page, ['5', '+', '3', '=']);
    expect(await getDisplay(page)).toBe('8');
    await pressButtons(page, ['+', '2', '=']);
    expect(await getDisplay(page)).toBe('10');
  });

  test('5 + 3 + 2 = 10', async ({ page }) => {
    await pressButtons(page, ['5', '+', '3', '+', '2', '=']);
    expect(await getDisplay(page)).toBe('10');
  });

  test('result used in next calc: 5+5=10, ×2=20', async ({ page }) => {
    await pressButtons(page, ['5', '+', '5', '=']);
    await pressButtons(page, ['×', '2', '=']);
    expect(await getDisplay(page)).toBe('20');
  });
});

// ==========================================
// TEXT INPUT — MATH SYMBOLS
// ==========================================

test.describe('Text Input — Symbols', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('25 + 30', async ({ page }) => {
    await typeCalc(page, '25 + 30');
    expect(await getDisplay(page)).toBe('55');
  });

  test('6 * 39', async ({ page }) => {
    await typeCalc(page, '6 * 39');
    expect(await getDisplay(page)).toBe('234');
  });

  test('6x39 (no spaces)', async ({ page }) => {
    await typeCalc(page, '6x39');
    expect(await getDisplay(page)).toBe('234');
  });

  test('144 / 12', async ({ page }) => {
    await typeCalc(page, '144 / 12');
    expect(await getDisplay(page)).toBe('12');
  });

  test('144÷12 (unicode)', async ({ page }) => {
    await typeCalc(page, '144÷12');
    expect(await getDisplay(page)).toBe('12');
  });

  test('5×2.6 (unicode)', async ({ page }) => {
    await typeCalc(page, '5×2.6');
    expect(await getDisplay(page)).toBe('13');
  });

  test('8*2.6 (no spaces)', async ({ page }) => {
    await typeCalc(page, '8*2.6');
    expect(await getDisplay(page)).toBe('20.8');
  });

  test('5x2.6 (letter x)', async ({ page }) => {
    await typeCalc(page, '5x2.6');
    expect(await getDisplay(page)).toBe('13');
  });

  test('3.5 * 2 (decimal)', async ({ page }) => {
    await typeCalc(page, '3.5 * 2');
    expect(await getDisplay(page)).toBe('7');
  });

  test('45 * -6 (negative)', async ({ page }) => {
    await typeCalc(page, '45 * -6');
    expect(await getDisplay(page)).toBe('-270');
  });

  test('10 * 10% (percent)', async ({ page }) => {
    await typeCalc(page, '10 * 10%');
    expect(await getDisplay(page)).toBe('1');
  });

  test('200 * 50% (percent)', async ({ page }) => {
    await typeCalc(page, '200 * 50%');
    expect(await getDisplay(page)).toBe('100');
  });

  test('25 + 30 = (explicit equals)', async ({ page }) => {
    await typeCalc(page, '25 + 30 =');
    expect(await getDisplay(page)).toBe('55');
  });
});

// ==========================================
// TEXT INPUT — NATURAL LANGUAGE
// ==========================================

test.describe('Text Input — Natural Language', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('twenty five plus thirty', async ({ page }) => {
    await typeCalc(page, 'twenty five plus thirty');
    expect(await getDisplay(page)).toBe('55');
  });

  test('twelve times four', async ({ page }) => {
    await typeCalc(page, 'twelve times four');
    expect(await getDisplay(page)).toBe('48');
  });

  test('fifty divided by five', async ({ page }) => {
    await typeCalc(page, 'fifty divided by five');
    expect(await getDisplay(page)).toBe('10');
  });

  test('three point five times two', async ({ page }) => {
    await typeCalc(page, 'three point five times two');
    expect(await getDisplay(page)).toBe('7');
  });

  test('forty five times negative six', async ({ page }) => {
    await typeCalc(page, 'forty five times negative six');
    expect(await getDisplay(page)).toBe('-270');
  });

  test('hundred plus fifty', async ({ page }) => {
    await typeCalc(page, 'hundred plus fifty');
    expect(await getDisplay(page)).toBe('150');
  });
});

// ==========================================
// CHAINED TEXT INPUT
// ==========================================

test.describe('Chained Text Input', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('89 + 8 then - 7 = 90', async ({ page }) => {
    await typeCalc(page, '89 + 8');
    expect(await getDisplay(page)).toBe('97');
    await typeCalc(page, '- 7');
    expect(await getDisplay(page)).toBe('90');
  });

  test('10 * 3 then * 2 = 60', async ({ page }) => {
    await typeCalc(page, '10 * 3');
    expect(await getDisplay(page)).toBe('30');
    await typeCalc(page, '* 2');
    expect(await getDisplay(page)).toBe('60');
  });

  test('new expression resets: 10+5=15, then 3*4=12', async ({ page }) => {
    await typeCalc(page, '10 + 5');
    expect(await getDisplay(page)).toBe('15');
    await typeCalc(page, '3 * 4');
    expect(await getDisplay(page)).toBe('12');
  });
});

// ==========================================
// KEYBOARD INPUT
// ==========================================

test.describe('Keyboard Input', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.locator('body').click();
  });

  test('number keys: 123', async ({ page }) => {
    await page.keyboard.press('1');
    await page.keyboard.press('2');
    await page.keyboard.press('3');
    expect(await getDisplay(page)).toBe('123');
  });

  test('5 + 3 Enter = 8', async ({ page }) => {
    await page.keyboard.press('5');
    await page.keyboard.press('+');
    await page.keyboard.press('3');
    await page.keyboard.press('Enter');
    expect(await getDisplay(page)).toBe('8');
  });

  test('6 * 7 Enter = 42', async ({ page }) => {
    await page.keyboard.press('6');
    await page.keyboard.press('*');
    await page.keyboard.press('7');
    await page.keyboard.press('Enter');
    expect(await getDisplay(page)).toBe('42');
  });

  test('Escape clears', async ({ page }) => {
    await page.keyboard.press('5');
    await page.keyboard.press('Escape');
    expect(await getDisplay(page)).toBe('0');
  });

  test('Backspace deletes', async ({ page }) => {
    await page.keyboard.press('1');
    await page.keyboard.press('2');
    await page.keyboard.press('3');
    await page.keyboard.press('Backspace');
    expect(await getDisplay(page)).toBe('12');
  });
});

// ==========================================
// SETTINGS & THEMES
// ==========================================

test.describe('Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('opens settings', async ({ page }) => {
    await page.locator('#settingsBtn').click();
    await expect(page.locator('.settings')).toBeVisible();
  });

  test('back from settings', async ({ page }) => {
    await page.locator('#settingsBtn').click();
    await page.locator('#backBtn').click();
    await expect(page.locator('.calc-btn[data-label="1"]')).toBeVisible();
  });

  test('changes theme', async ({ page }) => {
    await page.locator('#settingsBtn').click();
    await page.locator('.theme-btn[data-theme="rosewood"]').click();
    const bg = await page.locator('.settings').evaluate(
      el => window.getComputedStyle(el).backgroundColor
    );
    expect(bg).not.toBe('rgb(11, 25, 41)');
  });

  test('calculator works after changing size', async ({ page }) => {
    await page.locator('#settingsBtn').click();
    await page.locator('.size-btn[data-size="0"]').click();
    await page.locator('#backBtn').click();
    await pressButtons(page, ['5', '+', '3', '=']);
    expect(await getDisplay(page)).toBe('8');
  });
});

// ==========================================
// HELP TOGGLE
// ==========================================

test.describe('Help Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('shows examples', async ({ page }) => {
    await page.locator('#helpToggle').click();
    await expect(page.locator('.help-box')).toHaveClass(/show/);
  });

  test('hides examples', async ({ page }) => {
    await page.locator('#helpToggle').click();
    await page.locator('#helpToggle').click();
    await expect(page.locator('.help-box')).not.toHaveClass(/show/);
  });
});

// ==========================================
// EDGE CASES
// ==========================================

test.describe('Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('= without operator does nothing', async ({ page }) => {
    await pressButtons(page, ['5', '=']);
    expect(await getDisplay(page)).toBe('5');
  });

  test('large number', async ({ page }) => {
    await typeCalc(page, '999999 * 999999');
    expect(await getDisplay(page)).toBe('999998000001');
  });

  test('decimal precision: 1/3', async ({ page }) => {
    await typeCalc(page, '1 / 3');
    const d = await getDisplay(page);
    expect(d).toBe('0.3333333333');
  });

  test('empty text input does nothing', async ({ page }) => {
    expect(await getDisplay(page)).toBe('0');
    await expect(page.locator('#goBtn')).not.toHaveClass(/show/);
  });
});
