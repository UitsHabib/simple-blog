import React  from 'react';
import ClientRoutes from './client/user.routes';
import userReducer from './client/user.reducer';
import Login from './client/components/login.component';
import Dashboard from './client/components/dashboard.component';
import * as userActions from './client/user.actions';

export function UserClientRoutes(props) {
    return <ClientRoutes path={props.path} />;
}

export {
    userReducer,
    userActions,
    Login,
    Dashboard,
};
