import React from "react";
import { Switch, useRouteMatch } from "react-router-dom";
import PrivateRoute from "../../core/client/PrivateRoute";

export default function UserRoutes() {
    const { path } = useRouteMatch();

    return (
        <Switch>
            {/* <PrivateRoute exact path={path} component={UserManagement}/>
            <PrivateRoute path={`${path}/users/:id`} component={UserDetails}/>
            <PrivateRoute path={`${path}/users`} component={Users}/> */}
        </Switch>
    );
}
