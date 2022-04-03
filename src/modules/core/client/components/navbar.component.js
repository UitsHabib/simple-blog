import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Navigationbar() {
    const [expanded, setExpanded] = useState(false);

    const [open, setOpen] = useState(false)
    useEffect(() => {
        if (open === true) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [open]);

    const [, setCookie, removeCookie] = useCookies();
    const loggedInUser = useSelector(state => state.userReducer.loggedInUser);
    const countries = useSelector(state => state.countryReducer.countries);

    const { permittedUserProfile: permittedUserProfile, applications: userApplications, countries: userCountries } = loggedInUser;

    const handleLogOut = () => {
        setCookie('logged_in', '', { path: '/' });
        removeCookie('logged_in');
    };

    const addFallbackIcon = (e) => {
        e.target.src = '/assets/flag/flag-placeholder.svg';
    };

    const generateCountryIconPath = (country) => {
        if (country) return `/assets/flag/flag-${country.toLowerCase().replace(/ /g, "-")}.svg`;
        return `/assets/flag/flag-placeholder.svg`;
    };

    const renderCountryIcons = () => {
        if (userCountries) {
            const selectedCountries = countries && countries.filter(c => userCountries.includes(c.country_iso2) ? true : false).map(c => c.codbase_desc);
            return selectedCountries.map(country => {
                return <img key={country} height="26" width="26" src={generateCountryIconPath(country)} onError={addFallbackIcon} title={country} alt="Flag" className="ms-1" />;
            })
        }
    };

    const handleNavToggle = () => {
        setOpen(!open);
        setExpanded(!expanded);
    }

    const handleNavClose = () => {
        setOpen(false);
        setExpanded(false);
    }

    return (
        <header className="app__header py-1 shadow-sm">
            <div className="container-fluid">
                <div className="row align-items-center d-none d-sm-flex">
                    <div className="col-3">
                        <div className="d-flex">
                            <h1 className="text-center">
                                <a href="/"> <img alt="CDP LOGO" src="/assets/CDP.png" height="64" /></a>
                            </h1>
                        </div>
                    </div>
                    <div className="col-9 text-end">
                        <div className="d-block d-sm-flex justify-content-end align-items-center">
                            {/* {permittedUserProfile.profile.slug !== 'system_admin' && <div className="mb-2 mb-sm-0 d-flex justify-content-end align-items-center">
                                <div className="me-2">
                                    {renderCountryIcons()}
                                </div>
                            </div>} */}
                            <div className="mb-2 mb-sm-0 d-flex justify-content-end align-items-center">
                                <Link to="/my-profile" className="me-2 btn cdp-btn-secondary text-white my-profile__btn">
                                    <i className="icon icon-user-round me-2 app__header-icon-user "></i>
                                    <span>{permittedUserProfile.first_name + " " + permittedUserProfile.last_name}</span>
                                </Link>

                                <a className="btn cdp-btn-outline-primary d-flex align-items-center" title="Sign out" onClick={handleLogOut} href="/api/logout"><i className="icon icon-logout me-1 app__header-icon-logout"></i> <span className="d-none d-lg-inline-block">Sign out</span></a>
                            </div>
                        </div>
                    </div>
                </div>
                <Navbar collapseOnSelect expand={false} expanded={expanded} className="d-flex p-0 d-sm-none">
                    <Navbar.Brand>
                        <h1 className="text-center">
                            <a href="/"> <img alt="CDP LOGO" src="/assets/CDP.png" height="50" /></a>
                        </h1>
                    </Navbar.Brand>
                    <Navbar.Toggle onClick={handleNavToggle} aria-controls="responsive-navbar-nav"><i className="fas fa-bars py-1 cdp-text-primary"></i></Navbar.Toggle>
                    <Navbar.Collapse id="responsive-navbar-nav" className="cdp-light-bg">
                        <div onClick={handleNavClose} className="text-end">
                            <Navbar.Toggle className="in-submenu m-2" aria-controls="responsive-navbar-nav">
                                <i className="fas fa-times cdp-text-secondary fa-2x"></i>
                            </Navbar.Toggle>
                        </div>
                        {/* {permittedUserProfile.profile.slug !== 'system_admin' && <div>
                            {userApplications.length > 0 && <div className="px-3 border-bottom pb-2 mb-2">
                                <label className="form-label d-block">Application</label>
                                {renderApplicationIcon()}
                            </div>}
                            {userCountries.length > 0 && <div className="px-3 border-bottom pb-2 mb-2">
                                <label className="form-label d-block">Countries</label>
                                {renderCountryIcons()}
                            </div>}
                        </div>} */}
                        <div className="border-bottom mb-2">
                            <Link to="/my-profile" className="d-inline-flex align-items-center py-2 px-3" onClick={handleNavClose}>
                                <i className="icon icon-user-round me-2 app__header-icon-user "></i> {permittedUserProfile.first_name + " " + permittedUserProfile.last_name}
                            </Link>
                        </div>
                        <div>
                            <a className="d-inline-flex align-items-center py-2 px-3" onClick={handleLogOut} href="/api/logout"><i className="icon icon-logout me-2 app__header-icon-logout"></i> Sign out</a>
                        </div>

                    </Navbar.Collapse>
                </Navbar>
            </div>
        </header>
    );
}
