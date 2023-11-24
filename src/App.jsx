import React from 'react'
import './App.css'
import PropTypes from 'prop-types';
import axios from 'axios';
import styled from 'styled-components';

const StyledContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background: #83a4d4;
  background: linear-gradient(to left, #b6fbff, #83a4d4);
  color: 171212;
`;

const StyledHeadlinePrimary = styled.h1`
  font-size: 48px;
  font-weight: 300;
  letter-spacing: 2px;
`

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
    <StyledContainer>
      <StyledHeadlinePrimary>My Hacker Stories</StyledHeadlinePrimary>
      <SearchForm searchTerm={searchTerm} onSearchInput={handleSearchInput} onSearchSubmit={handleSearchSubmit}/>

      {stories.isError && <p>Something Went Wrong...</p>}
      {stories.isLoading ? (<p>Loading...</p>) : (<List list={stories.data} onRemoveItem={handleRemoveStory}/>)}
    </StyledContainer>
  )
};

const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => {

  return (
  <React.Fragment>
    <StyledSearchForm onSubmit={onSearchSubmit}>
      <InputWithLabel id="search" value={searchTerm} isFocused onInputChange={onSearchInput}><strong>Search</strong></InputWithLabel>
      <StyledButtonLarge type="submit" disabled={!searchTerm} >Submit</StyledButtonLarge>
    </StyledSearchForm>
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

const StyledLabel = styled.label`
border-top: 1px solid #171212;
border-left: 1px solid #171212;
padding-left: 5px;
font-size: 24px;
`;

const StyledInput = styled.input`
border: none;
border-bottom: 1px solid #171212;
background-color: transparent;
font-size: 24px;
`;

const InputWithLabel = ({id, value, type = "text", onInputChange, children, isFocused}) => {
  return (
    <React.Fragment>
      <div>
        <StyledLabel htmlFor={id}>{children}</StyledLabel>
        <StyledInput autoFocus={isFocused} value={value} id={id} type={type} onChange={onInputChange}/>
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

const StyledItem = styled.li`
  display: flex;
  align-items: center;
  padding-bottom: 5px;
`

const StyledColumn = styled.span`
  padding: 0 5px;
  white-space: nowrap;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  a {
    color: inherit;
  }

  width: ${(props) => props.width};
  border: ${(props) => props.border};
`;

const StyledButton = styled.button`
background: transparent;
border: 1px solid #171212;
padding: 5px;
cursor: pointer;
transition: all 0.1s ease-in;

&:hover {
  background: #171212;
  color: #ffffff;
}
`;

const StyledButtonSmall = styled(StyledButton)`
  padding: 5px;
`

const StyledButtonLarge = styled(StyledButton)`
  padding: 10px;
`

const StyledSearchForm = styled.form`
  padding: 10px 0 20px 0;
  display: flex;
  align-items: baseline;
`

const Item = ({item, onRemoveItem}) => {
  return (
    <StyledItem>
      <StyledColumn border="1px solid red" width="40%">
        <a href={item.url}>{item.title}</a>
      </StyledColumn>
      <StyledColumn width="30%">{item.author}</StyledColumn>
      <StyledColumn width="10%">{item.num_comments}</StyledColumn>
      <StyledColumn width="10%">{item.points}</StyledColumn>
      <StyledColumn width="10%">
        <StyledButtonSmall type="button" onClick={()=> onRemoveItem(item)}>Remove</StyledButtonSmall>
      </StyledColumn>
    </StyledItem>
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
