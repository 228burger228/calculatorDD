import { calculateProjectEstimate } from './src/core/pricingEngine.js';
import { buildScenarioComparison } from './src/core/scenarioBuilder.js';
import { generateClientQuote } from './src/core/quoteGenerator.js';
import { parseClientMessageLocally } from './src/core/aiParser.js';
import { DEFAULT_PRICING_CONFIG, INITIAL_PROJECT_PARAMETERS } from './src/config/defaultPricing.js';
import { SAMPLE_PROMPTS } from './src/config/samplePrompts.js';

console.log("=== 1. Testing Default Parameters Calculation (Reduced Prices) ===");
const calc = calculateProjectEstimate(INITIAL_PROJECT_PARAMETERS, DEFAULT_PRICING_CONFIG);
console.log("Recommended Quote:", calc.finalPrice, "RUB");
console.log("Range:", calc.rangeMin, "-", calc.rangeMax, "RUB");
console.log("Timeline:", calc.estimatedDays.min, "-", calc.estimatedDays.max, "days");
console.log("Cost Drivers Count:", calc.drivers.length);
console.assert(calc.finalPrice >= DEFAULT_PRICING_CONFIG.minimumProjectPrice, "Must be >= min project price");
console.assert(calc.rangeMin < calc.finalPrice && calc.finalPrice < calc.rangeMax, "Range must surround quote");

console.log("\n=== 2. Testing Student Track Discount ===");
const studentParams = { ...INITIAL_PROJECT_PARAMETERS, isStudentTrack: true };
const studentCalc = calculateProjectEstimate(studentParams, DEFAULT_PRICING_CONFIG);
console.log("Normal Price:", calc.finalPrice, "vs Student Price:", studentCalc.finalPrice);
console.assert(studentCalc.finalPrice < calc.finalPrice, "Student price must be discounted");

console.log("\n=== 3. Testing Scenario Comparison (Basic / Standard / Premium) ===");
const comparison = buildScenarioComparison(INITIAL_PROJECT_PARAMETERS, DEFAULT_PRICING_CONFIG);
console.log("Basic:", comparison.basic.price, "RUB | Days:", comparison.basic.days);
console.log("Standard:", comparison.standard.price, "RUB | Days:", comparison.standard.days);
console.log("Premium:", comparison.premium.price, "RUB | Days:", comparison.premium.days);
console.assert(comparison.basic.price < comparison.standard.price, "Basic < Standard");
console.assert(comparison.standard.price <= comparison.premium.price, "Standard <= Premium");

console.log("\n=== 4. Testing Client Quote Generation ===");
const quote = generateClientQuote(INITIAL_PROJECT_PARAMETERS, calc);
console.log("Quote Title:", quote.summary.title);
console.assert(quote.telegramText.includes("@aimovl"), "Must include Dmitry's contact");
console.assert(!quote.telegramText.includes("×1.15"), "Must NOT reveal internal multipliers to client");

console.log("\n=== 5. Testing AI Heuristic Message Parsing & Missing Works ===");
const parsed = parseClientMessageLocally(SAMPLE_PROMPTS[0].clientMessage);
console.log("Parsed Project Type:", parsed.projectType);
console.log("Parsed Pages:", parsed.pagesCount);
console.log("Missing Scope Suggestions Count:", parsed.missingSuggestions.length);
parsed.missingSuggestions.forEach(s => console.log(" - Missed:", s.title, "->", s.reason));
console.assert(parsed.missingSuggestions.some(s => s.workItemId === 'work_cms'), "Must detect missing CMS");

console.log("\n✅ ALL SYSTEM CHECKS PASSED!");
