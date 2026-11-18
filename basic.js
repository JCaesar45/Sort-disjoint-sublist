function sortDisjoint(values, indices) {
  // Copy so the input isn't mutated
  const result = [...values];

  // Sort the indices numerically (default sort is lexicographic)
  const sortedIdx = [...indices].sort((a, b) => a - b);

  // Pull out the values at those indices and sort them numerically
  const sortedVals = sortedIdx.map(i => values[i]).sort((a, b) => a - b);

  // Place the sorted values back at the sorted positions
  sortedIdx.forEach((idx, k) => {
    result[idx] = sortedVals[k];
  });

  return result;
}
