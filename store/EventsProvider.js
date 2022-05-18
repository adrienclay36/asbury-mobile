import React, { createContext, useState, useEffect } from 'react';
import { SERVER_URL } from '../constants/serverURL';
import axios from 'axios';
export const EventsContext = createContext({
    events: [],
    getEvents: () => {},
    loading: false,
})
const EventsProvider = (props) => {
    const [events, setEvents] = useState();
    const [loading, setLoading] = useState(false);
    const getEvents = async () => {
      setLoading(true);
      const response = await axios.get(`${SERVER_URL}/events`);
      setEvents(response.data.events);
      setLoading(false);
    };

    useEffect(() => {
      getEvents();
    }, []);

    const contextValue = {
        events,
        getEvents,
        loading,
    }
  return (
    <EventsContext.Provider value={contextValue}>
        {props.children}
    </EventsContext.Provider>
  )
}

export default EventsProvider