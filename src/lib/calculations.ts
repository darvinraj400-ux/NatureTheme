export interface CalculationResult {
  activityName: string;
  inputValue: number;
  inputUnit: string;
  result: string;
  resultUnit: string;
  explanation: string;
  limitations: string;
}

export function calculateImpact(
  activityId: string,
  inputValue: number,
  period: 'week' | 'month' | 'year'
): CalculationResult | null {
  if (isNaN(inputValue) || inputValue < 0) return null;

  const multiplier = period === 'week' ? 1 : period === 'month' ? 4.33 : 52;
  const annualValue = Math.round(inputValue * multiplier);

  switch (activityId) {
    case 'meals-planned':
      return {
        activityName: 'Meals Planned Around Existing Ingredients',
        inputValue,
        inputUnit: 'meals/week',
        result: `${annualValue} meals planned per year`,
        resultUnit: 'meals/year',
        explanation: `Planning ${inputValue} meals per week around existing ingredients means approximately ${annualValue} meals per year where you use food you already have rather than shopping for new ingredients.`,
        limitations: 'This tracks activity level, not measured waste reduction. Actual food waste avoided depends on household size, what would otherwise have been wasted, and shopping patterns.',
      };
    case 'repairs-completed':
      return {
        activityName: 'Items Repaired Instead of Replaced',
        inputValue,
        inputUnit: 'items/month',
        result: `${annualValue} items repaired per year`,
        resultUnit: 'items/year',
        explanation: `Repairing ${inputValue} items per month means approximately ${annualValue} repairs per year, each extending an item's useful life and avoiding the resource cost of a replacement.`,
        limitations: 'Resource savings vary enormously depending on what was repaired. A sewn button and a fixed appliance have very different material implications.',
      };
    case 'reusable-carry':
      return {
        activityName: 'Reusable Container Uses',
        inputValue,
        inputUnit: 'uses/week',
        result: `${annualValue} single-use items potentially avoided per year`,
        resultUnit: 'uses/year',
        explanation: `Using reusable containers ${inputValue} times per week means approximately ${annualValue} instances per year where a single-use alternative was not needed.`,
        limitations: 'This compares against hypothetical single-use alternatives. The actual environmental benefit depends on what the alternative would have been and how the reusable item was produced and maintained.',
      };
    case 'car-journeys-replaced':
      return {
        activityName: 'Car Journeys Replaced',
        inputValue,
        inputUnit: 'journeys/week',
        result: `${annualValue} car journeys replaced per year`,
        resultUnit: 'journeys/year',
        explanation: `Replacing ${inputValue} car journeys per week with walking, cycling, or public transport means approximately ${annualValue} fewer car trips per year.`,
        limitations: 'Actual emissions savings depend on journey distance, vehicle type, fuel source, and what transport mode was used instead. Short journeys replaced by walking have different implications than long commutes replaced by transit.',
      };
    case 'purchases-avoided':
      return {
        activityName: 'Unnecessary Purchases Avoided',
        inputValue,
        inputUnit: 'items/month',
        result: `${annualValue} purchases avoided per year`,
        resultUnit: 'items/year',
        explanation: `Choosing not to buy ${inputValue} items per month means approximately ${annualValue} products per year that did not require manufacturing, packaging, and transport.`,
        limitations: 'The resource implications vary enormously depending on what was not purchased. Avoiding a plastic toy and avoiding a piece of furniture have very different material footprints.',
      };
    default:
      return null;
  }
}
