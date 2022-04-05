import React, { useState, useEffect, createContext, useCallback, useContext } from "react";
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
  badgeCount: 0,
  setBadgeCount: (count) => {},
});
const TABLE = "prayers";
let isInit = true;
const PAGE_SIZE = 10;
import {
  addItemToTable,
  deleteItemFromTable,
  getPagedDataByDate,
  updateItemInTable,
  getTotalPages,
} from "../supabase-util";
import { UserContext } from "./UserProvider";
const PrayersProvider = (props) => {
  const userContext = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [payload, setPayload] = useState();
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [endOfList, setEndOfList] = useState(false);
  const [badgeCount, setBadgeCount] = useState(0);

  const getPosts = async (paged) => {
    if (isInit) {
      setLoading(true);
    }
    const data = await getPagedDataByDate(
      pageNumber,
      PAGE_SIZE,
      TABLE,
      "postdate"
    );
    if (paged) {
      setPosts((prevPosts) => {
        return prevPosts.concat(data);
      });
    } else {
      setPosts(data);
    }
    setPosts(data);
    setLoading(false);
    isInit = false;
  };

  const loadMore = async () => {
    const data = await getPagedDataByDate(
      pageNumber,
      PAGE_SIZE,
      TABLE,
      "postdate"
    );
    setPosts((prevPosts) => {
      return [...prevPosts, ...data];
    });
  };

  useEffect(() => {
    if (isInit) {
      getPosts();
    }
  }, []);

  useEffect(() => {
    if (!isInit) {
      loadMore();
    }
  }, [pageNumber]);

  const refreshPosts = async () => {
    isInit = true;
    setPosts([]);
    setLoading(true);
    setPageNumber(0);
    const data = await getPagedDataByDate(0, PAGE_SIZE, TABLE, "postdate");
    setPosts(data);
    setLoading(false);
    isInit = false;
  };

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
    setPosting(false);
    navigation.goBack();
  };

  const editPost = async (postID, content, type, navigation) => {
    setPosting(true);
    const editedPost = {
      postcontent: content,
      posttype: type,
    };
    const response = await updateItemInTable(TABLE, postID, editedPost);
    setPosting(false);
    await refreshPosts();
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


  const getPostsAfterUpdate = async () => {
    const data = await getPagedDataByDate(
      0,
      PAGE_SIZE,
      TABLE,
      "postdate"
    );
    console.log(data);
    setPosts(data);
  }

  useEffect(() => {
    if (payload) {
      if (payload.eventType === "INSERT") {
        if (payload.new.user_id !== userContext?.userInfo?.id) {
          setBadgeCount(badgeCount + 1);
        }
        setPosts((prevPosts) => {
          const filtered = prevPosts.filter(
            (prevPost) => prevPost.id !== payload.new.id
          );

          return [payload.new, ...filtered];
        });
      }

      if(payload.eventType === 'UPDATE') {
        const index = posts.findIndex(post => post.id === payload.new.id);
        const postCopy = posts;
        postCopy[index] = payload.new;
        setPosts(postCopy);
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
    console.log("Establishing Joys & Concerns Sub");
    const postSub = supabase
      .from("prayers")
      .on("*", (payloadItem) => setPayload(payloadItem))
      .subscribe();

    return () => {
      supabase.removeSubscription(postSub);
      console.log("Sub Removed");
    };
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
    badgeCount,
    setBadgeCount,
  };
  return (
    <PrayerContext.Provider value={contextValue}>
      {props.children}
    </PrayerContext.Provider>
  );
};

export default PrayersProvider;
