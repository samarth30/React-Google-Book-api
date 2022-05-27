import React, { useState, Fragment } from "react";
import { InputGroup, Input, Spinner } from "reactstrap";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import axios from "axios";
import BookCard from "./BookCard.jsx";
import BookCardSaved from "./BookCardSaved.jsx";

import { Link } from "react-router-dom";
function App() {
  // States
  const [maxResults, ] = useState(5);
  const [startIndex, ] = useState(1);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [bookListToBeSaved, setbookListToBeSaved] = useState([]);
  const [bookListToBeRemoved, ] = useState([]);

  // Handle Search
  const handleSubmit = (Query) => {
    setbookListToBeSaved([]);
    if (!Query) {
      setCards([]);
      return;
    }
    setLoading(true);

    if (maxResults > 40 || maxResults < 1) {
      toast.error("max results must be between 1 and 40");
    } else {
      axios
        .get(
          `https://www.googleapis.com/books/v1/volumes?q=${Query}&maxResults=${5}&startIndex=${1}`
        )
        .then((res) => {
          if (startIndex >= res.data.totalItems || startIndex < 1) {
            toast.error(
              `max reults must be between 1 and ${res.data.totalItems}`
            );
          } else {
            if (res.data.items.length > 0) {
              setCards(res.data.items);
              setLoading(false);
            }
          }
        })
        .catch((err) => {
          setLoading(true);
          console.log(err.response);
        });
    }
  };

  const handleCheck = (item, ischecked) => {
    if (ischecked) {
      const index = bookListToBeSaved.findIndex(function (itemsaved) {
        return (
          itemsaved.volumeInfo.title === item.volumeInfo.title &&
          itemsaved.volumeInfo.publisher === item.volumeInfo.publisher
        );
      });

      if (index === -1) bookListToBeSaved.push(item);
    } else {
      const index = bookListToBeSaved.findIndex(function (itemsaved) {
        return (
          itemsaved.volumeInfo.title === item.volumeInfo.title &&
          itemsaved.volumeInfo.publisher === item.volumeInfo.publisher
        );
      });
      if (index !== -1) bookListToBeSaved.splice(index, 1);
    }
  };

  const saveToLocalStorage = () => {
    let localbooks = localStorage.getItem("localBooks");
    if (!localbooks) {
      localbooks = [];
    }

    try {
      localbooks = JSON.parse(localbooks);
    } catch (e) {}
    let lenghtOfBooks = localbooks.length;
    console.log(localbooks);
    console.log(bookListToBeSaved);
    let finalArrayConcat = [];
    for (var i = 0; i < bookListToBeSaved.length; i++) {
      let flag = 1;
      for (var j = 0; j < localbooks.length; j++) {
        if (
          bookListToBeSaved[i].volumeInfo.title ===
            localbooks[j].volumeInfo.title &&
          bookListToBeSaved[i].volumeInfo.publisher ===
            localbooks[j].volumeInfo.publisher
        ) {
          flag = 0;
        }
      }
      if (flag === 1) {
        finalArrayConcat.push(bookListToBeSaved[i]);
      }
    }

    localbooks = localbooks.concat(finalArrayConcat);

    localStorage.setItem("localBooks", JSON.stringify(localbooks));

    if (lenghtOfBooks < localbooks.length) {
      toast.success("saved succesfully");
    } else {
      toast.error("the book is already saved");
    }
  };

  // const getFromLocalStorage = () => {
  //   // localStorage.clear();
  //   let localbooks = localStorage.getItem("localBooks");
  //   console.log(JSON.parse(localbooks));
  // };

  const handleRemove = (item, ischecked) => {
    if (ischecked) {
      const index = bookListToBeRemoved.findIndex(function (itemsaved) {
        return (
          itemsaved.volumeInfo.title === item.volumeInfo.title &&
          itemsaved.volumeInfo.publisher === item.volumeInfo.publisher
        );
      });

      if (index === -1) bookListToBeRemoved.push(item);
    } else {
      const index = bookListToBeRemoved.findIndex(function (itemsaved) {
        return (
          itemsaved.volumeInfo.title === item.volumeInfo.title &&
          itemsaved.volumeInfo.publisher === item.volumeInfo.publisher
        );
      });
      if (index !== -1) bookListToBeRemoved.splice(index, 1);
    }
  };

  const removeBooks = () => {
    let localbooks = localStorage.getItem("localBooks");

    const array = JSON.parse(localbooks);

    if (bookListToBeRemoved.length === 0) {
      toast.error("please select any book to be removed");
      return;
    }

    for (var i = 0; i < bookListToBeRemoved.length; i++) {
      let indexToBeRemoved = -1;
      for (var j = 0; j < array.length; j++) {
        if (
          bookListToBeRemoved[i].volumeInfo.title ===
            array[j].volumeInfo.title &&
          bookListToBeRemoved[i].volumeInfo.publisher ===
            array[j].volumeInfo.publisher
        ) {
          indexToBeRemoved = j;
        }
      }
      if (indexToBeRemoved !== -1) {
        array.splice(indexToBeRemoved, 1);
      }
    }

    localStorage.setItem("localBooks", JSON.stringify(array));

    window.location.reload();
  };

  // Main Show Case
  const mainHeader = () => {
    return (
      <div>
        <div></div>
        <h1 style={{ zIndex: 2 }}>Search Your books</h1>
        <div style={{ width: "60%", zIndex: 2 }}>
          <InputGroup size="lg" className="mb-3">
            <Input
              placeholder="Search book"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                handleSubmit(e.target.value);
              }}
            />
          </InputGroup>
          <div>
            <button onClick={saveToLocalStorage}> save to local</button>

            <button>
              {" "}
              <Link to={`/saved`}>Saved Collection</Link>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleCards = () => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center mt-3">
          <Spinner style={{ width: "3rem", height: "3rem" }} />
        </div>
      );
    } else {
      const items = cards.map((item, i) => {
        let thumbnail = "";
        if (item.volumeInfo.imageLinks) {
          thumbnail = item.volumeInfo.imageLinks.thumbnail;
        }

        return (
          <div className="col-lg-4 mb-3" key={item.id}>
            <BookCard
              item={item}
              isChecked={false}
              handleCheck={handleCheck}
              thumbnail={thumbnail}
              title={item.volumeInfo.title}
              authors={item.volumeInfo.authors}
              publisher={item.volumeInfo.publisher}
            />
          </div>
        );
      });
      return (
        <div className="container my-5">
          <div className="row">{items}</div>
        </div>
      );
    }
  };

  const savedHeader = () => {
    return (
      <div>
        <button onClick={removeBooks}>remove selected</button>
        <button>
          {" "}
          <Link to={`/`}>Search Books</Link>
        </button>
      </div>
    );
  };

  const handleStorageCards = () => {
    let localbooks = localStorage.getItem("localBooks");
    console.log(JSON.parse(localbooks));
    const items = JSON.parse(localbooks).map((item, i) => {
      let thumbnail = "";
      if (item.volumeInfo.imageLinks) {
        thumbnail = item.volumeInfo.imageLinks.thumbnail;
      }
      let isChecked = false;

      return (
        <div className="col-lg-4 mb-3" key={item.id}>
          <BookCardSaved
            item={item}
            handleCheck={handleRemove}
            isChecked={isChecked}
            thumbnail={thumbnail}
            title={item.volumeInfo.title}
            authors={item.volumeInfo.authors}
            publisher={item.volumeInfo.publisher}
          />
        </div>
      );
    });
    return (
      <div className="container my-5">
        <div className="row">{items}</div>
      </div>
    );
  };
  return (
    <div className="w-100 h-100">
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <Fragment>
                {mainHeader()}
                {handleCards()}
              </Fragment>
            )}
          />
          <Route
            exact
            path="/saved"
            render={() => (
              <Fragment>
                {savedHeader()}
                {handleStorageCards()}
              </Fragment>
            )}
          />
        </Switch>
      </Router>

      <ToastContainer />
    </div>
  );
}

export default App;
