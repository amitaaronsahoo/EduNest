function getSchoolMatchScore(school, query) {
  if (!query) {
    return Number.POSITIVE_INFINITY;
  }
  if (school.searchName === query) {
    return 0;
  }
  if (school.searchName.startsWith(query)) {
    return 1;
  }
  if (` ${school.searchName} `.includes(` ${query} `)) {
    return 2;
  }
  if (school.searchName.includes(query)) {
    return 3;
  }
  if (school.searchText.startsWith(query)) {
    return 4;
  }
  if (` ${school.searchText} `.includes(` ${query} `)) {
    return 5;
  }
  if (school.searchText.includes(query)) {
    return 6;
  }
  return Number.POSITIVE_INFINITY;
}