import Types from './category.types';

const initialState = {
    categoriesWithPostList: []
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case Types.GET_CATEGORIES_WITH_POSTS_FULFILLED: {
            return {
                ...state,
                categoriesWithPostList: action.payload.data
            };
        }
    }
    return state;
}
