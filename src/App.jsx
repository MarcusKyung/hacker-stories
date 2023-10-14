import React from 'react'
import { useState } from 'react'
import './App.css'
import PropTypes from 'prop-types';



const App = () => {

  const handleSearch = (event) => {
    console.log(event.target.value);
  }

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

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <Search onSearch={handleSearch}/>

      <hr />

      <List list={stories} />
    </div>
  )
};



const Search = (props) => {

const [searchTerm, setSearchTerm] = useState('');

const handleChange = (event) => {
  setSearchTerm(event.target.value)
  props.onSearch(event);
}
  
  return (
    <React.Fragment>
      <div>
        <label htmlFor="search">Search: </label>
        <input id="search" type="text" onChange={handleChange}/>
      </div>

      <p>Searching for search term: {searchTerm}</p>
    </React.Fragment>
  )
};

const List = (props) => {
  return (
    <ul>
      {props.list.map((item) => (
        <Item key={item.objectID} item={item} />
      ))}
    </ul>
  )
}

const Item = (props) => {
  return (
    <li>
      <span>
        <a href={props.item.url}>{props.item.title}</a>
      </span>
      <span>{props.item.author}</span>
      <span>{props.item.num_comments}</span>
      <span>{props.item.points}</span>
    </li>
  )
};


//This is listing out the prop types for each component. Need to do for each component that props are passed to. 
Search.propTypes = {
  onSearch: PropTypes.func
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
