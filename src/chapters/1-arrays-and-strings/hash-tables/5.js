const isOneAway = function(str1, str2) {
  if (Math.abs(str1.length - str2.length) > 1) {
    return false;
  }

  if (str1.length === str2.length) {
    return equalLengthStringsOneAway(str1, str2);
  }

  const shorter = str1.length > str2.length ? str2 : str1;
  const longer = shorter === str1 ? str2 : str1;
  return isOneInsertOrRemoveAway(shorter, longer);
};

const equalLengthStringsOneAway = function(str1, str2) {
  let differenceFound = false;
  for (let i = 0; i < str1.length; i++) {
    if (str1.charAt(i) !== str2.charAt(i)) {
      if (differenceFound) {
        return false;
      }
      differenceFound = true;
    }
  }
  return true;
}

const isOneInsertOrRemoveAway = function(shorter, longer) {
  for (let index1 = 0, index2 = 0; index2 < longer.length;) {
    if (shorter.charAt(index1) !== longer.charAt(index2)) {
      if (index1 !== index2) {
        return false;
      }
      index2++;
    } else {
      index1++;
      index2++;
    }
  }
  return true;
}

export default isOneAway;
