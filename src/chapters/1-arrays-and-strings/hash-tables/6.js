const stringCompression = function(str) {
  if (!str || str.length < 3) {
    return str;
  }

  let modified = '';
  let currentCount = 1;
  let previousChar = str.charAt(0);
  for (let i = 1; i < str.length; i++) {
    const currentChar = str.charAt(i);
    if (currentChar === previousChar) {
      currentCount++;
    } else {
      modified = modified + `${currentCount}${previousChar}`;
      currentCount = 1;
      previousChar = currentChar;
    }
  }
    modified = modified + `${currentCount}${previousChar}`;

  return modified.length >= str.length ? str : modified;
};

export default stringCompression;
