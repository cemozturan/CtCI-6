const isPalindromeOfPermutation = function(str) {
  if (!str) {
    return false;
  }

  str = str.replace(/\s/g, '');

  const hashTable = new Map();
  for (let ch of str) {
    let currentEntry = hashTable.get(ch);
    if (currentEntry) {
      hashTable.delete(ch);
    } else {
      hashTable.set(ch, true);
    }
  }

  return hashTable.size < 2;
};

export default isPalindromeOfPermutation;
