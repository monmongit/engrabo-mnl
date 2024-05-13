import axios from 'axios';
import { server } from '../../server';

// Create Event Admin
export const createEvent =
  (
    name,
    description,
    category,
    tags,
    originalPrice,
    discountPrice,
    stock,
    adminId,
    images,
    startDate,
    endDate
  ) =>
  async (dispatch) => {
    try {
      dispatch({
        type: 'eventCreateRequest',
      });

      const { data } = await axios.post(
        `${server}/event/create-event`,
        name,
        description,
        category,
        tags,
        originalPrice,
        discountPrice,
        stock,
        adminId,
        images,
        startDate,
        endDate
      );
      dispatch({
        type: 'eventCreateSuccess',
        payload: data.event,
      });
    } catch (error) {
      dispatch({
        type: 'eventCreateFail',
        payload: error.response.data.message,
      });
    }
  };

// Get All Events Admin
export const getAllEventsAdmin = (id) => async (dispatch) => {
  try {
    dispatch({
      type: 'getAllEventsAdminRequest',
    });

    const { data } = await axios.get(`${server}/event/get-all-events/${id}`);
    dispatch({
      type: 'getAllEventsAdminSuccess',
      payload: data.events,
    });
  } catch (error) {
    dispatch({
      type: 'getAllEventsAdminFailed',
      payload: error.response.data.message,
    });
  }
};

// Delete Event Admin
export const deleteEvent = (id) => async (dispatch) => {
  try {
    dispatch({
      type: 'deleteEventRequest',
    });

    const { data } = await axios.delete(
      `${server}/event/delete-admin-event/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: 'deleteEventSuccess',
      payload: { id, message: data.message },
    });
  } catch (error) {
    dispatch({
      type: 'deleteEventFailed',
      payload: error.response.data.message,
    });
  }
};

// Search Events Admin
export const searchEvents = (searchTerm) => async (dispatch) => {
  try {
    dispatch({ type: 'searchEventsRequest' });

    const { data } = await axios.get(
      `${server}/event/search-events?search=${searchTerm}`
    );

    dispatch({
      type: 'searchEventsSuccess',
      payload: data.events,
    });
  } catch (error) {
    dispatch({
      type: 'searchEventsFail',
      payload: error.response.data.message,
    });
  }
};

// Get All Events
export const getAllEvents = () => async (dispatch) => {
  try {
    dispatch({
      type: 'getAllEventsRequest',
    });

    const { data } = await axios.get(`${server}/event/get-all-events`);
    dispatch({
      type: 'getAllEventsSuccess',
      payload: data.events,
    });
  } catch (error) {
    dispatch({
      type: 'getAllEventsFailed',
      payload: error.response.data.message,
    });
  }
};
