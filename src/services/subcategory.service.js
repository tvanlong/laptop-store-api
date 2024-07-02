const getSearchQuery = (keyword) => {
  const searchQuery = {}
  if (keyword) {
    searchQuery.name = { $regex: keyword, $options: 'i' }
  }
  return searchQuery
}

const getSortOptions = (sort, order) => {
  const sortOptions = {}
  if (sort && order) {
    if (sort === 'createdAt') {
      sortOptions[sort] = order === 'new' ? -1 : 1
    }
  }
  return sortOptions
}

export default {
  getSearchQuery,
  getSortOptions
}
