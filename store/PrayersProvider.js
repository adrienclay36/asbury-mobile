import React, { useState, useEffect, createContext, useCallback } from "react";
import { supabase } from "../supabase-service";
import axios from "axios";
export const PrayerContext = createContext({
  posts: [],
  comments: [],
  loading: false,
  posting: false,
  getPosts: () => {},
  refreshPosts: () => {},
  incrementLike: (postID) => {},
  decrementLike: (postID) => {},
  addPost: (name, type, content, navigation) => {},
  addUserPost: (type, content, navigation) => {},
  editPost: (postID, content, type, navigation) => {},
  deletePost: (postID) => {},
  totalPages: 0,
  pageNumber: 0,
  incrementPage: () => {},
  endOfList: false,
});
const TABLE = "prayers";
let isInit = true;
const PAGE_SIZE = 10;
import {
  addItemToTable,
  deleteItemFromTable,
  getAllItemsSorted,
  getPagedDataByDate,
  updateItemInTable,
  getTotalPages,
} from "../supabase-util";
const PrayersProvider = (props) => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [payload, setPayload] = useState();
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [endOfList, setEndOfList] = useState(false);

  const getPosts = useCallback(async () => {
    if (isInit) {
      setLoading(true);
    }
    //  const data = await getAllItemsSorted(TABLE, 'postdate');
    const data = await getPagedDataByDate(
      pageNumber,
      PAGE_SIZE,
      TABLE,
      "postdate"
    );

    setPosts(data);
    setLoading(false);
    isInit = false;
  }, [pageNumber]);

  const loadMorePosts = useCallback(async () => {
    if (isInit) {
      setLoading(true);
    }
    //  const data = await getAllItemsSorted(TABLE, 'postdate');
    const data = await getPagedDataByDate(
      pageNumber,
      PAGE_SIZE,
      TABLE,
      "postdate"
    );

    setPosts((prevPosts) => {
      return prevPosts.concat(data);
    });
    setLoading(false);
    isInit = false;
  }, [pageNumber]);

  // get initial posts
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  //Get posts when page number changes but not on initial render
  useEffect(() => {
    if (!isInit) {
      loadMorePosts();
    }
  }, [pageNumber, loadMorePosts]);

  const refreshPosts = useCallback(async () => {
    setPosts([]);
    setLoading(true);
    setPageNumber(0);
    setEndOfList(false);
    const data = await getPagedDataByDate(0, PAGE_SIZE, TABLE, "postdate");

    setPosts(data);
    setLoading(false);
  }, [pageNumber]);

  const incrementLike = async (postID) => {
    const { data, error } = await supabase.rpc("increment_like", {
      post_id: postID,
    });
  };

  const decrementLike = async (postID) => {
    const { data, error } = await supabase.rpc("decrement_like", {
      post_id: postID,
    });
  };

  const addPost = async (name, type, content, navigation) => {
    setPosting(true);
    const ipResponse = await axios.get("https://api.ipify.org?format=json");
    const ipaddress = ipResponse.data.ip;
    let inputType = type;
    if (!type) {
      inputType = "joy";
    }
    const postToAdd = {
      author: name,
      email: null,
      posttype: inputType,
      postcontent: content,
      ipaddress,
      notifications: false,
      postdate: new Date(),
    };

    const response = await addItemToTable(TABLE, postToAdd);

    setPosting(false);
    navigation.replace("JoysAndConcernsHome");
    return response;
  };

  const addUserPost = async (type, content, userID, navigation) => {
    setPosting(true);
    const ipResponse = await axios.get("https://api.ipify.org?format=json");
    const ipaddress = ipResponse.data.ip;
    let inputType = type;
    if (!type) {
      inputType = "joy";
    }
    const postToAdd = {
      author: null,
      email: null,
      posttype: inputType,
      postcontent: content,
      ipaddress,
      notifications: false,
      postdate: new Date(),
      user_id: userID,
    };

    const response = await addItemToTable(TABLE, postToAdd);
    console.log(response);
    setPosting(false);
    navigation.replace("JoysAndConcernsHome");
  };

  const editPost = async (postID, content, type, navigation) => {
    setPosting(true);
    const editedPost = {
      postcontent: content,
      posttype: type,
    };
    const response = await updateItemInTable(TABLE, postID, editedPost);
    setPosting(false);
  };

  const deletePost = async (postID) => {
    setPosting(true);
    const response = await deleteItemFromTable(TABLE, postID);
    setPosting(false);
  };

  const incrementPage = () => {
    if (pageNumber >= totalPages - 1) {
      setEndOfList(true);
    } else {
      setPageNumber(pageNumber + 1);
    }
    console.log("Page Number:: ", pageNumber);
  };

  const initTotalPages = async () => {
    const initPages = await getTotalPages(PAGE_SIZE, TABLE);
    setTotalPages(initPages);
  };

  useEffect(() => {
    initTotalPages();
  }, []);

  useEffect(() => {
    if (payload) {
      if (payload.eventType === "INSERT") {
        setPosts((prevPosts) => {
          const filtered = prevPosts.filter(
            (prevPost) => prevPost.id !== payload.new.id
          );

          return [payload.new, ...filtered];
        });
      }

      if (payload.eventType === "UPDATE") {
        const updatedPost = payload.new;
        const index = posts.findIndex((item) => item.id === updatedPost.id);
        const postsCopy = posts;
        postsCopy[index] = updatedPost;
        setPosts(postsCopy);
      }

      if (payload.eventType === "DELETE") {
        setPosts((prevPosts) => {
          const filtered = prevPosts.filter(
            (post) => post.id !== payload.old.id
          );
          return filtered;
        });
      }
    }
    return () => setPayload(null);
  }, [payload]);

  useEffect(() => {
    const postSub = supabase
      .from(TABLE)
      .on("*", (payloadItem) => setPayload(payloadItem))
      .subscribe();
    return () => supabase.removeSubscription(postSub);
  }, []);

  const contextValue = {
    posts,
    getPosts,
    comments,
    loading,
    incrementLike,
    decrementLike,
    addPost,
    posting,
    refreshPosts,
    addUserPost,
    editPost,
    deletePost,
    incrementPage,
    totalPages,
    pageNumber,
    endOfList,
  };
  return (
    <PrayerContext.Provider value={contextValue}>
      {props.children}
    </PrayerContext.Provider>
  );
};

export default PrayersProvider;
