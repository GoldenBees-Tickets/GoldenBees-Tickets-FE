/**
 * Filters movies by status categories
 * @param {Array} movies - Array of movie objects 
 * @returns {Object} Object containing filtered movie arrays
 */
export const filterMoviesByStatus = (movies) => {
  
  if (!Array.isArray(movies)) {
    return { nowShowingMovies: [], comingSoonMovies: [] };
  }

  const now = new Date();
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(now.getDate() + 7);

  const nowShowingMovies = movies.filter(movie => {
    const releaseDate = new Date(movie.release_date);
    return releaseDate <= sevenDaysFromNow;
  });

  const comingSoonMovies = movies.filter(movie => {
    const releaseDate = new Date(movie.release_date);
    return releaseDate > sevenDaysFromNow;
  });

  return {
    nowShowingMovies,
    comingSoonMovies
  };
};


/**
 * Filters movies by search criteria (title, year, genre)
 * @param {Array} movies - Array of movie objects
 * @param {Object} filters - Object containing filter criteria
 * @param {string} filters.searchTitle - Text to search in movie title
 * @param {string|number} filters.filterYear - Year to filter by
 * @param {string|number} filters.filterGenre - Genre ID to filter by
 * @returns {Array} Filtered movies array
 */
export const filterMoviesBySearchCriteria = (movies, { searchTitle = '', filterYear = '', filterGenre = '' }) => {
  if (!movies || !Array.isArray(movies) || !movies.length) {
    return [];
  }
  
  return movies.filter(movie => {
    // Filter by title
    if (searchTitle && !movie.name.toLowerCase().includes(searchTitle.toLowerCase())) {
      return false;
    }
    
    // Filter by year
    if (filterYear && movie.year !== parseInt(filterYear)) {
      return false;
    }
    
    // Filter by genre
    if (filterGenre && !movie.MovieGenres?.some(mg => 
      mg.Genre?.id === parseInt(filterGenre)
    )) {
      return false;
    }
    
    return true;
  });
}; 