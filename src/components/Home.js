import React from "react";
import { AuthContext } from "../App";
import axios from "axios";
import {
  Card,
  UnorderedList,
  ListItem,
  Text,
  majorScale
} from "evergreen-ui";
// import { stat } from "fs";
// import { stat } from "fs";
// import Card from "./Card";
// import AddSong from "./AddSong";

export const DataContext = React.createContext();

const initialState = {
  datas: {},
  isFetching: false,
  hasError: false
  // isSongSubmitting: false,
  // songHasError: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_DATA_REQUEST":
      return {
        ...state,
        isFetching: true,
        hasError: false
      };
    case "FETCH_DATA_SUCCESS":
      return {
        ...state,
        isFetching: false,
        datas: action.payload
      };
    case "FETCH_DATA_FAILURE":
      return {
        ...state,
        hasError: true,
        isFetching: false
      };
    // case "ADD_SONG_REQUEST":
    //   return {
    //     ...state,
    //     isSongSubmitting: true,
    //     songHasError: false,
    //   }
    // case "ADD_SONG_SUCCESS":
    //   return {
    //     ...state,
    //     isSongSubmitting: false,
    //     songs: [...state.songs, action.payload]
    //   }
    // case "ADD_SONG_FAILURE":
    //   return {
    //     ...state,
    //     isSongSubmitting: false,
    //     songHasError: true,
    //   }
    default:
      return state;
  }
};

export const Home = () => {
  const { state: authState } = React.useContext(AuthContext);
  const [state, dispatch] = React.useReducer(reducer, initialState);
  // const [isAddSongModalVisible, setAddSongModalVisibility] = React.useState(
  //   false
  // );

  // const toggleAddSong = () => {
  //   setAddSongModalVisibility(!isAddSongModalVisible);
  // };
  React.useEffect(() => {
    dispatch({
      type: "FETCH_DATA_REQUEST"
    });
    axios("https://sbx-account.payme.vn/Account/Information", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authState.token}`
      }
    })
      .then(res => {
        if (res.data.code === 1000) {
          return res;
        } else {
          throw res;
        }
      })
      .then(resJson => {
        console.log("resJson Home", resJson);
        dispatch({
          type: "FETCH_DATA_SUCCESS",
          payload: resJson
        });
      })
      .catch(error => {
        console.log(error);
        dispatch({
          type: "FETCH_DATA_FAILURE"
        });
      });
  }, [authState.token]);
  console.log(state);
  return (
    <React.Fragment>
      {/* <SongContext.Provider value={{
      state,
      dispatch
    }}>
      <button className="toggle-button" onClick={toggleAddSong}>ADD SONG</button>
      <AddSong onClose={toggleAddSong} show={isAddSongModalVisible} />
    </SongContext.Provider> */}
      <div className="home">
        {state.isFetching ? (
          <span className="loader">LOADING...</span>
        ) : state.hasError ? (
          <span className="error">AN ERROR HAS OCCURED</span>
        ) : (
          <span className="content">
            {state.datas.data && (
              <Card
                background="tint2"
                marginBottom={majorScale(2)}
                padding={majorScale(1)}
              >
                <UnorderedList>
                  <ListItem icon="person">
                    <Text fontWeight={700}>Name:</Text> {state.datas.data.data.fullname}
                  </ListItem>
                  <ListItem icon="heart">
                    <Text fontWeight={700}>Gender:</Text> {state.datas.data.data.gender}
                  </ListItem>
                  <ListItem icon="phone">
                    <Text fontWeight={700}>Phone:</Text> {state.datas.data.data.phone}
                  </ListItem>
                  {/* <ListItem icon="tint">
                    <Text fontWeight={700}>Hair color:</Text> {p.hair_color}
                  </ListItem>
                  <ListItem icon="tint">
                    <Text fontWeight={700}>Eye color:</Text> {p.eye_color}
                  </ListItem> */}
                </UnorderedList>
              </Card>
            )}
          </span>
        )}
      </div>
    </React.Fragment>
  );
};

export default Home;
