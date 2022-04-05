import React from "react";
import { Switch, useRouteMatch } from "react-router-dom";
import Home from './components/home.component';
import PrivateRoute from "../../core/client/PrivateRoute";

export default function UserRoutes() {
    const { path } = useRouteMatch();

    return (
        <Switch>
            <PrivateRoute exact path={path} component={Home}/>
        </Switch>
    );
}
