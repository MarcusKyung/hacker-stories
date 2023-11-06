import React from 'react'
import { useState } from 'react'
import './App.css'
import PropTypes from 'prop-types';



const App = () => {
  const stories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
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


  const [searchTerm, setSearchTerm] = useState('React');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  }

  // Filter creates a new filtered array. Takes a function as an argument which accesses each item in the array and returns true/false. If true the item stays in the array, if false it is removed.
  const searchedStories = stories.filter(function (story) {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  });



  return (
    <div>
      <h1>My Hacker Stories</h1>

      <Search search={searchTerm} onSearch={handleSearch}/>

      <hr />

      <List list={searchedStories} />
    </div>
  )
};



const Search = (props) => {
  const { search, onSearch } = props; //prop destructuring makes things more concise
  // it is also possible to destructure the props directly in the function parameters: ex: const Search = ({search, on search}) => {...}. This makes the function a concise body rather than block body

  return (
    <React.Fragment>
      <div>
        <label htmlFor="search">Search: </label>
        <input value={search} id="search" type="text" onChange={onSearch}/>
      </div>
    </React.Fragment>
  )
};

const List = (props) => {
  const { list } = props;
  return (
    <ul>
      {list.map((item) => (
        <Item key={item.objectID} item={item} />
      ))}
    </ul>
  )
}

const Item = ({
  item: {
    title,
    url,
    author,
    num_comments,
    points,
  }
}) => {
// you can also do nested destructuring which is sometimes more concise.

  return (
    <li>
      <span>
        <a href={url}>{title}</a>
      </span>
      <span>{author}</span>
      <span>{num_comments}</span>
      <span>{points}</span>
    </li>
  )
};


//This is listing out the prop types for each component. Need to do for each component that props are passed to. 
Search.propTypes = {
  onSearch: PropTypes.func,
  search: PropTypes.string,

}

Item.propTypes = {
  item: PropTypes.shape({
    url: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    num_comments: PropTypes.number,
    points: PropTypes.number,
  }),
};

List.propTypes = {
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
