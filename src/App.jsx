import React from 'react'
import './App.css'
import PropTypes from 'prop-types';
import axios from 'axios';



const App = () => {



  const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';
  const storiesReducer = (state, action) => {
    switch (action.type) {
      case 'STORIES_FETCH_INIT':
        return {
          ...state,
          isLoading: true,
          isError: false,
        }
      case 'STORIES_FETCH_SUCCESS':
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
        }
      case 'STORIES_FETCH_FAILURE':
        return {
          ...state,
          isLoading: false,
          isError: true,
        }
      case 'REMOVE_STORY':
        return {
          ...state,
          data: state.data.filter((story) => action.payload.objectID !== story.objectID)
        }
      default: 
        throw new Error();
    }
  };

  const [stories, dispatchStories] = React.useReducer(storiesReducer, {data: [], isLoading: false, isError: false});
  const [searchTerm, setSearchTerm] = useStorageState('Search', 'React');
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);


  const handleFetchStories = React.useCallback(async () => {
  
    dispatchStories({type: 'STORIES_FETCH_INIT'});
    try {
    const result = await axios.get(url)
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({type: 'STORIES_FETCH_FAILURE'});
    }
  }, [url]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories])

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  }

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  }

  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`)
    event.preventDefault();
  }

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <SearchForm searchTerm={searchTerm} onSearchInput={handleSearchInput} onSearchSubmit={handleSearchSubmit}/>
      <hr />
      {stories.isError && <p>Something Went Wrong...</p>}
      {stories.isLoading ? (<p>Loading...</p>) : (<List list={stories.data} onRemoveItem={handleRemoveStory}/>)}
    </div>
  )
};

const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => {

  return (
  <React.Fragment>
    <form onSubmit={onSearchSubmit}>
      <InputWithLabel id="search" value={searchTerm} isFocused onInputChange={onSearchInput}><strong>Search</strong></InputWithLabel>
      <button type="submit" disabled={!searchTerm} >Submit</button>
    </form>
  </React.Fragment>
)
}

const useStorageState = (key, initialState) => {
  const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const InputWithLabel = ({id, value, type = "text", onInputChange, children, isFocused}) => {
  return (
    <React.Fragment>
      <div>
        <label htmlFor={id}>{children}</label>
        <input autoFocus={isFocused} value={value} id={id} type={type} onChange={onInputChange}/>
      </div>
    </React.Fragment>
  )
};

const List = ({list, onRemoveItem}) => {
  return (
    <ul>
      {list.map((item) => (
        <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem}/>
      ))}
    </ul>
  )
}

const Item = ({item, onRemoveItem}) => {
  return (
    <li>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span><button type="button" onClick={()=> onRemoveItem(item)}>Remove</button></span>
    </li>
  )
};


// PROP VALIDATION
InputWithLabel.propTypes = {
  onSearch: PropTypes.func,
  search: PropTypes.string,
  id: PropTypes.string.isRequired,
  value: PropTypes.string,
  type: PropTypes.oneOf(['text', 'number', 'search']),
  onInputChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  isFocused: PropTypes.bool,
}

Item.propTypes = {
  onRemoveItem: PropTypes.func.isRequired,
  item: PropTypes.shape({
    url: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    num_comments: PropTypes.number,
    points: PropTypes.number,
  }),
};

List.propTypes = {
  onRemoveItem: PropTypes.func.isRequired,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      url: PropTypes.string,
      title: PropTypes.string,
      author: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,
    }),
  ),
};

SearchForm.propTypes ={
  searchTerm: PropTypes.string,
  onSearchInput: PropTypes.func,
  onSearchSubmit: PropTypes.func,
}

export default App
