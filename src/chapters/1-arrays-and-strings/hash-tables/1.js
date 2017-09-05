const isUniqueWithHashTable = function(str) {
  const hashTable = new Map();

  for (const ch of str) {
    if (hashTable.get(ch)) {
      return false;
    }
    hashTable.set(ch, true);
  }
  return true;
};

const isUniqueWithoutDataStructures = function(str) {
  // Convert the string into an array of sorted characters
  const sorted = [...str].sort();

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i-1]) {
      return false;
    }
  }
  return true;
}

export {
  isUniqueWithHashTable,
  isUniqueWithoutDataStructures
};
