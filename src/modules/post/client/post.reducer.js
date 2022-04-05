import Types from './post.types';

const initialState = {
    postList: [],
    post: {}
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case Types.GET_POSTS_FULFILLED: {
            return {
                ...state,
                postList: action.payload.data
            };
        }
        case Types.GET_POST_FULFILLED: {
            return {
                ...state,
                post: action.payload.data
            };
        }
    }
    return state;
}
