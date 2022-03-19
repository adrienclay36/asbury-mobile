import React, { useState, useEffect, createContext, useCallback } from 'react'
import { supabase } from '../supabase-service';
import axios from 'axios';
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

})
const TABLE = "prayers";
let isInit = true;
import { addItemToTable, getAllItemsSorted } from '../supabase-util';
const PrayersProvider = (props) => {
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [posting, setPosting] = useState(false);
    const [payload, setPayload] = useState();


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


     const getPosts = useCallback(async () => {
       if (isInit) {
         setLoading(true);
       }
       const data = await getAllItemsSorted(TABLE, 'postdate');
       

       setPosts(data);
       setLoading(false);
       isInit = false;
     }, []);

    useEffect(() => {
        getPosts();
    }, [getPosts])

    const refreshPosts = useCallback(async () => {
      setPosts([]);
      setLoading(true);
      const data = await getAllItemsSorted(TABLE, "postdate");

      setPosts(data);
      setLoading(false);

    }, [])



    const incrementLike = async (postID) => {
      const { data, error } = await supabase.rpc("increment_like", {
        post_id: postID,
      });
    }

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

    }

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
    }

    


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
    }
  return (
    <PrayerContext.Provider value={contextValue}>
      {props.children}
    </PrayerContext.Provider>
  )
}

export default PrayersProvider