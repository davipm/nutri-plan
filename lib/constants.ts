export const patterns = {
  zeroTo9999: /^(|0|0\.\d{0,2}|[1-9]\d{0,3}(\.\d{0,2})?)$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  minimumOneUpperCaseLetter: /[A-Z]/,
  minimumOneLowerCaseLetter: /[a-z]/,
  minimumOneDigit: /[0-9]/,
  minimumOneSpecialCharacter: /[@$!%*#?&]/,
  minEightCharacters: /^.{8,}$/,
};

export const nutritionalFields = [
  { name: 'calories', label: 'Calories', placeholder: 'kcal', type: 'text' },
  { name: 'protein', label: 'Protein', placeholder: 'grams', type: 'number' },
  {
    name: 'carbohydrates',
    label: 'Carbohydrates',
    placeholder: 'grams',
    type: 'number',
  },
  { name: 'fat', label: 'Fat', placeholder: 'grams', type: 'number' },
  { name: 'fiber', label: 'Fiber', placeholder: 'grams', type: 'number' },
  { name: 'sugar', label: 'Sugar', placeholder: 'grams', type: 'number' },
];
