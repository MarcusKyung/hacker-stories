import React from 'react'
// import { useState } from 'react'
import './App.css'
import PropTypes from 'prop-types';



const App = () => {
  const initialStories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  //Simulated async fetching of stories
  const getAsyncStories = () =>
  new Promise(resolve =>
    setTimeout(
      () => resolve({ data: { stories: initialStories } }),
      2000
    )
  );

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


  React.useEffect(() => {
    dispatchStories({type: 'STORIES_FETCH_INIT'});
    getAsyncStories().then(result => {
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.stories,
      });
    })
    .catch(() => dispatchStories({type: 'STORIES_FETCH_FAILURE'}));
  }, []);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  }

  // Filter creates a new filtered array. Takes a function as an argument which accesses each item in the array and returns true/false. If true the item stays in the array, if false it is removed.
  const searchedStories = stories.data.filter(function (story) {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel id="search" value={searchTerm} isFocused onInputChange={handleSearch}><strong>Search</strong></InputWithLabel>

      <hr />
      {stories.isError && <p>Something Went Wrong...</p>}
      {stories.isLoading ? (<p>Loading...</p>) : (<List list={searchedStories} onRemoveItem={handleRemoveStory}/>)}
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
  label: PropTypes.string.isRequired,
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
      objectID: PropTypes.number.isRequired,
      url: PropTypes.string,
      title: PropTypes.string,
      author: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,
    }),
  ),
};

export default App
