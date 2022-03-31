import React, { useState, useEffect, createContext} from 'react'
import { getAllItemsSorted } from '../supabase-util';
import { supabase } from '../supabase-service';
const TABLE = 'posts'
export const BlogContext = createContext({
    posts: [],
    getPosts: () => {},
    loading: false,
    badgeCount: 0,
    setBadgeCount: (count) => {},

});

const BlogProvider = (props) => {
    const [posts, setPosts] = useState('');
    const [loading, setLoading] = useState(false);
    const [noData, setNoData] = useState(false);
    const [badgeCount, setBadgeCount] = useState(0);
    const [payload, setPayload] = useState();

    const getPosts = async () => {
        setPosts([]);
        setLoading(true);
        const data = await getAllItemsSorted(TABLE, 'id');
        setPosts(data);
        setLoading(false);
        
    };
    useEffect(() => {
        getPosts();
    }, [])


    useEffect(() => {
      if (payload) {
        if (payload.eventType === "INSERT") {
          if (payload.new.user_id) {
            setBadgeCount(badgeCount + 1);
          }
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
      console.log("Establishing Bulletins Sub");
      const postSub = supabase
        .from("posts")
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
        loading,
        badgeCount,
        setBadgeCount,
    }
  return (
    <BlogContext.Provider value={contextValue}>
        {props.children}
    </BlogContext.Provider>
  )
}

export default BlogProvider