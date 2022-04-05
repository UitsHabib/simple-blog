import Types from './post.types';

const initialState = {
    postList: []
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case Types.GET_POSTS_FULFILLED: {
            return {
                ...state,
                postList: action.payload.data
            };
        }
    }
    return state;
}
