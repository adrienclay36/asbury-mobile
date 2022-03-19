import React, { createContext, useEffect, useState } from "react";
import { supabase } from "../supabase-service";
import { getAllItems, getQueriedData } from "../supabase-util";
let isInitial = true;
export const LibraryContext = createContext({
  books: [],
  setQuery: (text) => {},
  loading: false,
  noData: false,
});

const TABLE = "books";
const LibraryContextProvider = (props) => {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);

  const getBooks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(TABLE)
      .select()
      .order("deweynumber", { ascending: true });

    setBooks(data);
    isInitial = false;
    setLoading(false);
  };

  useEffect(() => {
    getBooks();
  }, []);


  const callQueryFunction = async () => {
    setLoading(true);
    setBooks([]);
    const { data, status } = await getQueriedData(TABLE, query, 'search_books_ts');
    setBooks(data);
    if(status !== 'ok') {
      setNoData(true);
    } else {
      setNoData(false);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!isInitial) {
      if (!query) {
        getBooks();
        return;
      }

      const timeout = setTimeout(callQueryFunction, 250);

      return () => {
        clearTimeout(timeout) 
        setNoData(false)
      };
    }
  }, [query]);

  const contextValue = {
    books,
    setQuery,
    loading,
    noData,
  };
  return (
    <LibraryContext.Provider value={contextValue}>
      {props.children}
    </LibraryContext.Provider>
  );
};

export default LibraryContextProvider;
