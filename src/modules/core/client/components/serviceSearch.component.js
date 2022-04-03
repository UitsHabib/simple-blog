import React, { useState, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AutoSuggest from "react-autosuggest";
import _ from 'lodash';

export default function SearchService() {
    const history = useHistory();
    const [visitedItem, setVisitedItem] = useState([]);
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const loggedInUserId = useSelector((state) => state.userReducer.loggedInUser.permittedUserProfile.id);
    const [open, setOpen] = useState(false)
    const serviceTitle = [];
    const permittedServices = useSelector(state => state.userReducer.loggedInUser.services);

    permittedServices.map(service => serviceTitle.push({ id: service.slug, name: service.title, link: service.relative_path, icon: service.icon_class }));

    const serviceCategory = useSelector(state => state.userReducer.loggedInUser.catagoryWiseServices.serviceCategories);
    const getCategoryWiseServices = (categoryTitle, categoryLink) => {
        let services = [];
        serviceTitle.map(service => {
            if (categoryTitle !== service.name && service.link.includes(categoryLink)) {
                services.push(service);
            }
        });
        return services.sort((service1, service2) => {
            var serviceName1 = service1.name.toUpperCase();
            var serviceName2 = service2.name.toUpperCase();
            return (serviceName1 < serviceName2) ? -1 : (serviceName1 > serviceName2) ? 1 : 0;
        });
    }

    const categoryWiseServices = [];
    serviceCategory.map(category => {
        categoryWiseServices.push({
            title: category.title,
            services: getCategoryWiseServices(category.title, category.relative_path)
        })
    })

    const escapeRegexCharacters = (str) => {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    const getSuggestions = (value) => {
        const escapedValue = escapeRegexCharacters(value.trim());

        if (escapedValue === '') {
            return [];
        }

        const regex = new RegExp(escapedValue, 'i');

        return categoryWiseServices
            .map(section => {
                return {
                    title: section.title,

                    services: section.services.filter(service => regex.test(service.name))
                };
            })
            .filter(section => section.services.length > 0);
    }

    const setRecentVisitedServices = () => {
        const visitedServices = JSON.parse(localStorage.getItem("recentVisitedServices")) || {};
        visitedServices[loggedInUserId] && setVisitedItem(visitedServices[loggedInUserId]);
    }

    useEffect(() => {
        setRecentVisitedServices()
    }, [])

    useEffect(() => {
        if (window.innerWidth < 576 && open === true) {
            document.querySelector(".service").scrollIntoView({ behavior: 'smooth' });
        }
    });
    return (
        <div className="service bg-white shadow-sm rounded mb-3">
            <div className="row align-items-center">
                <div className="col-12 col-lg-6">
                    <div className="p-3">
                        <h5 className="service__header mb-3 fw-bold-light d-flex align-items-center"><i className="fas fa-search small me-2"></i> Find Service</h5>
                        <div className="my-2">
                            <AutoSuggest
                                multiSection={true}
                                suggestions={suggestions}
                                onSuggestionsClearRequested={() => setSuggestions([])}
                                onSuggestionsFetchRequested={({ value }) => {
                                    setSuggestions(getSuggestions(value));
                                }}
                                onSuggestionSelected={(event, { suggestionValue }) => {
                                    serviceTitle.map(service => {
                                        if (service.name === suggestionValue) {
                                            history.push(service.link);
                                        }
                                    });
                                    setVisitedItem(JSON.parse(localStorage.getItem('searchedServices')));
                                }
                                }
                                getSuggestionValue={suggestion => suggestion.name}
                                renderSuggestion={(suggestion) => {
                                    return (
                                        <div className="d-flex">
                                            <i className={`${suggestion.icon} service__recently-visited-icon`} ></i>
                                            <span className="ms-1 service__recently-visited-links">{suggestion.name}</span>
                                        </div>

                                    )
                                }}
                                renderSectionTitle={(section) => {
                                    return (
                                        <h6 className="react-autosuggest__section-title">{section.title}</h6>
                                    )
                                }}
                                getSectionSuggestions={(section) => section.services}
                                inputProps={{
                                    placeholder: 'Search for services',
                                    value: value,
                                    onChange: (_, { newValue, method }) => {
                                        setValue(newValue);
                                    },
                                    onFocus: () => {
                                        setOpen(true)
                                    },
                                    onBlur: () => {
                                        setOpen(false)
                                    },
                                }}
                                highlightFirstSuggestion={true}
                            />
                        </div>
                    </div>
                </div>
                {
                    visitedItem.length > 0 && <div className="col-12 col-lg-6 align-self-stretch"><div className="service__recently-visited p-3 h-100">
                        <h6 className="service__header fw-bold pb-2">Recently Visited Services </h6>
                        <ul className="p-0 m-0 list-unstyled  d-flex align-items-center flex-wrap">
                            {visitedItem.map((service, idx) => {
                                return <li key={idx} className="cdp-text-primary d-flex align-items-center me-3 mb-2 service__recently-visited-item">
                                    <i className={`${service.icon} d-flex justify-content-center align-items-center service__recently-visited-icon`} ></i>
                                    <NavLink to={service.link} className="service__recently-visited-link ms-1">{service.name}</NavLink>
                                </li>
                            })}
                        </ul>
                    </div>
                    </div>
                }
            </div>


        </div>
    )
}
