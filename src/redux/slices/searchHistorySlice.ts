import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface SearchHistoryState {
  searches: string[]
  recentSearches: string[]
}

const initialState: SearchHistoryState = {
  searches: [],
  recentSearches: [],
}

const searchHistorySlice = createSlice({
  name: "searchHistory",
  initialState,
  reducers: {
    addSearch: (state, action: PayloadAction<string>) => {
      const search = action.payload.trim()
      if (search && !state.searches.includes(search)) {
        state.searches.unshift(search)
        state.recentSearches.unshift(search)

        // Keep only last 10 searches
        if (state.searches.length > 10) {
          state.searches = state.searches.slice(0, 10)
        }
        if (state.recentSearches.length > 5) {
          state.recentSearches = state.recentSearches.slice(0, 5)
        }
      }
    },
    clearSearchHistory: (state) => {
      state.searches = []
      state.recentSearches = []
    },
  },
})

export const { addSearch, clearSearchHistory } = searchHistorySlice.actions
export default searchHistorySlice.reducer
