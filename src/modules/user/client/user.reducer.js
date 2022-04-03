import Types from './user.types';
import _ from 'lodash';

const initialState = {
    loggedInUser: null
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case Types.LOGIN_FULFILLED:
        case Types.GET_PROFILE_FULFILLED: {
            const loggedInUser = action.payload.data;
            const [userCountires, userApps, userServices] = getUserPermissions(loggedInUser.permittedUserProfile);


            loggedInUser.countries = userCountires || [];
            loggedInUser.applications = userApps || [];
            loggedInUser.services = userServices || [];
            loggedInUser.catagoryWiseServices = loggedInUser.catagoryWiseServices || [];
            return {
                ...state,
                loggedInUser
            };
        }
        case Types.UPDATE_PROFILE_FULFILLED: {
            const loggedInUser = action.payload.data;
            const [userCountires, userApps, userServices] = getUserPermissions(loggedInUser.permittedUserProfile);

            loggedInUser.countries = userCountires;
            loggedInUser.applications = userApps;
            loggedInUser.services = userServices;

            return {
                ...state,
                loggedInUser
            };
        }
    }
    return state;
}
