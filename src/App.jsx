import React from 'react'
// import { useState } from 'react'
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

  // const [stories, setStories] = React.useState([]); // Replaced with useReducer
  const [stories, dispatchStories] = React.useReducer(storiesReducer, {data: [], isLoading: false, isError: false});
  const [searchTerm, setSearchTerm] = useStorageState('Search', 'React');
  // const [isLoading, setIsLoading] = React.useState(false);
  // const [isError, setIsError] = React.useState(false); // replaced with useReducer
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);


  const handleFetchStories = React.useCallback(async () => {
  if (!searchTerm) return;

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

  const handleSearchSubmit = () => {
    setUrl(`${API_ENDPOINT}${searchTerm}`)
  }

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel id="search" value={searchTerm} isFocused onInputChange={handleSearchInput}><strong>Search</strong></InputWithLabel>
      <button type="button" disabled={!searchTerm} onClick={handleSearchSubmit}>Submit</button>
      <hr />
      {stories.isError && <p>Something Went Wrong...</p>}
      {stories.isLoading ? (<p>Loading...</p>) : (<List list={stories.data} onRemoveItem={handleRemoveStory}/>)}
    </div>
  )
};

const useStorageState = (key, initialState) => {
  const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const InputWithLabel = ({id, value, type = "text", onInputChange, children, isFocused}) => {
  // const { search, onSearch } = props; //prop destructuring makes things more concise
  // it is also possible to destructure the props directly in the function parameters: ex: const Search = ({search, on search}) => {...}. This makes the function a concise body rather than block body

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


//This is listing out the prop types for each component. Need to do for each component that props are passed to. 
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

export default App
