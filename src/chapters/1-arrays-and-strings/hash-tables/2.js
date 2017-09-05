const isPermutationWithHashTable = function(str1, str2) {
  if (str1.length !== str2.length) {
    return false;
  }

  const hashTable = new Map();

  for (let ch of str1) {
    let currentEntry = hashTable.get(ch);
    hashTable.set(ch, currentEntry ? currentEntry + 1 : 1);
  }

  for (let ch of str2) {
    let currentEntry = hashTable.get(ch);
    if (!currentEntry) {
      return false;
    } if (currentEntry === 1) {
      hashTable.delete(ch);
    } else {
      hashTable.set(ch, currentEntry - 1);
    }
  }

  return hashTable.size === 0;
};

const isPermutationWithoutDataStructure = function(str1, str2) {
  if (str1.length !== str2.length) {
    return false;
  }
  const sortedStr1 = [...str1].sort();
  const sortedStr2 = [...str2].sort();
  return sortedStr1.every((ch, index) => ch === sortedStr2[index]);
};

export {
  isPermutationWithHashTable,
  isPermutationWithoutDataStructure
};
