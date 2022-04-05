import { combineReducers } from 'redux';
import { userReducer } from '../../user';
import { categoryReducer } from '../../category';
import { postReducer } from '../../post';

export default combineReducers({
    userReducer,
    categoryReducer,
    postReducer
})
