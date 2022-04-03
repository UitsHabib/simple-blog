import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import parse from "html-react-parser";
import MapView from './map-view';
import { getCrdlpHcpProfile } from '../../../information/hcp/client/hcp.actions';

function CrdlpHcpProfileDetails ({ show, id, onHide }) {
    const [profileDetails, setProfileDetails] = useState(null);
    const [workplaces, setWorkplaces] = useState(null);
    const [selectedWorkplace, setSelectedWorkplace] = useState(null);
    const [multichannelConsents, setMultichannelConsents] = useState([]);
    const [selectedTab, setSelectedTab] = useState('Individual');
    const dispatch = useDispatch();

    const countries = useSelector(state => state.countryReducer.countries);
    const allCountries = useSelector(state => state.countryReducer.allCountries);

    const getProfileFromHcoScope = (id) => {
        axios.get(`/api/datasync/hcp/hco-scope/${id}`)
            .then((x) => {
                setWorkplaces(x.data);
                setSelectedWorkplace(x.data[0]);
            });
    }

    const getConsentsForCurrentUser = async id => {
        const { data } = await axios.get(`/api/crdlp/${id}/multichannel-consents`);
        setMultichannelConsents(data.data);
    };

    const getCountryFromCodbase = (codbase) => {
        if (!countries || !codbase) return null;
        const country = countries.find(c => c.codbase.toLowerCase() === codbase.toLowerCase());
        return country && country.countryname;
    };

    const getCountryName = (country_iso2) => {
        if (!allCountries || !country_iso2) return null;
        const country = allCountries.find(c => c.country_iso2.toLowerCase() === country_iso2.toLowerCase());
        return country && country.countryname;
    };

    const getWorkplaceName = (workplace) => {
        if(!workplace) return '--';
        const workplaceName = workplace.wkp_name ?? workplace.wkp_official_name ?? (workplace.working_status_desc === 'Home' ? workplace.adr_long_lbl ? workplace.adr_long_lbl : 'Home' : 'Workplace name not available');
        return workplaceName;
    };

    useEffect(()=> {
        if (show) {
            dispatch(getCrdlpHcpProfile(id))
                .then(res => setProfileDetails(res.value.data));
            getProfileFromHcoScope(id);
            getConsentsForCurrentUser(id);
        }
        return () => {
            setProfileDetails(null);
            setWorkplaces(null);
            setSelectedWorkplace(null);
            setMultichannelConsents([]);
            setSelectedTab('Individual');
        }
    }, [show]);

    return <Modal
        size="xl"
        show={show && workplaces}
        onHide={() => {
            setSelectedWorkplace(null);
            setWorkplaces(null);
            setSelectedTab('Individual');
            onHide();
        }}
        dialogClassName="modal-customize mw-90"
        aria-labelledby="example-custom-modal-styling-title"
        centered
    >
        <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
                Profile Details
            </Modal.Title>
        </Modal.Header>
        <Modal.Body className='p-0'>
            {
                profileDetails
                ? <div className="okla-search__details">
                    <Tabs defaultActiveKey={selectedTab} className="okla-search__tabs" onSelect={(activeKey, e) => { setSelectedTab(activeKey); }}>
                        <Tab eventKey="Individual" title="Individual">
                            <ul className="okla-search__details-items">
                                <li className="okla-search__details-item">
                                    <strong className="okla-search__details-title">Salutation</strong>
                                    <span className="okla-search__details-value">{profileDetails.salutation || '--'}</span>
                                </li>
                                <li className="okla-search__details-item">
                                    <strong className="okla-search__details-title">Name</strong>
                                    <span className="okla-search__details-value">{profileDetails.firstname} {profileDetails.lastname}</span>
                                </li>
                                <li className="okla-search__details-item">
                                    <strong className="okla-search__details-title">Title</strong>
                                    <span className="okla-search__details-value">{profileDetails.ind_type_desc || '--'}</span>
                                </li>
                                <li className="okla-search__details-item">
                                    <strong className="okla-search__details-title">Gender</strong>
                                    <span className="okla-search__details-value">{profileDetails.gender_desc || '--'}</span>
                                </li>
                                <li className="okla-search__details-item">
                                    <strong className="okla-search__details-title">Email</strong>
                                    <span className="okla-search__details-value">{profileDetails.personemail || '--'}</span>
                                </li>
                                <li className="okla-search__details-item">
                                    <strong className="okla-search__details-title">Graduation Year</strong>
                                    <span className="okla-search__details-value">{profileDetails.graduationYear || '--'}</span>
                                </li>
                                <li className="okla-search__details-item">
                                    <strong className="okla-search__details-title">Birth Year</strong>
                                    <span className="okla-search__details-value">{profileDetails.birthYear || '--'}</span>
                                </li>
                                <li className="okla-search__details-item">
                                    <strong className="okla-search__details-title">Country</strong>
                                    <span className="okla-search__details-value">{getCountryName(profileDetails.country_iso2)}</span>
                                </li>
                                <li className="okla-search__details-item">
                                    <strong className="okla-search__details-title">{!profileDetails.specialties || profileDetails.specialties.length < 2 ? 'Specialty' : 'Specialties'}</strong>
                                    <span className="okla-search__details-value">{profileDetails.specialties ? profileDetails.specialties.map(x => x.description).join(', ') : '--'}</span>
                                </li>
                                <li className="okla-search__details-item">
                                    <strong className="okla-search__details-title">Contract status</strong>
                                    <span className="okla-search__details-value">In contract</span>
                                </li>
                            </ul>
                        </Tab>
                        <Tab eventKey="Identifiers" title="Identifiers">
                            <ul className="okla-search__details-items">
                                <li className="okla-search__details-item">
                                    <strong className="okla-search__details-title">OneKey Individual ID</strong>
                                    <span className="okla-search__details-value">{profileDetails.individual_id_onekey || '--'}</span>
                                </li>
                                <li className="okla-search__details-item">
                                    <strong className="okla-search__details-title">Status</strong>
                                    <span className="okla-search__details-value">{profileDetails.ind_status_desc ? 'Valid' : 'Invalid'}</span>
                                </li>
                            </ul>
                        </Tab>
                        <Tab eventKey="Workplace" title="Workplace">
                            <Dropdown>
                                <Dropdown.Toggle
                                    variant=""
                                    className="cdp-btn-outline-primary dropdown-toggle btn d-flex align-items-center okla-search__details-dropdown">
                                    {getWorkplaceName(selectedWorkplace)}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {workplaces && workplaces.map((workplace, idx) => (
                                        <Dropdown.Item
                                        className="okla-search__details-workplace-dropdown-item"
                                        key={'wp-' + idx}
                                        onClick={() => { setSelectedWorkplace(workplace); }}>
                                            {
                                                getWorkplaceName(workplace)
                                            }
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>

                            {selectedWorkplace &&
                                <div className="py-3 py-sm-5">
                                    <div className="row">
                                        <div className="col-12 col-sm-6 pb-3">
                                            <div className="mt-1 fw-bold">Name</div>
                                            <div>{getWorkplaceName(selectedWorkplace)}</div>
                                        </div>
                                        <div className="col-6 col-sm-6 pb-3">
                                            <div className="mt-1 fw-bold">Type</div>
                                            <div>{selectedWorkplace.wkp_type_desc || '--'}</div>
                                        </div>
                                        <div className="col-6 col-sm-6 pb-3">
                                            <div className="mt-1 fw-bold">Main activity?</div>
                                            <div>{selectedWorkplace.act_primary_flag == 'Y' ? 'Yes' : 'No'}</div>
                                        </div>
                                        <div className="col-6 col-sm-6 pb-3">
                                            <div className="mt-1 fw-bold">Status</div>
                                            <div>{selectedWorkplace.wkp_status_desc === 'Valid' ? 'Active workplace' : 'Inactive workplace'}</div>
                                        </div>
                                        <div className="col-6 col-sm-6 pb-3">
                                            <div className="mt-1 fw-bold">Address OneKeyID</div>
                                            <div>{selectedWorkplace.adr_id_onekey || '--'}</div>
                                        </div>
                                        <div className="col-6 col-sm-6 pb-3">
                                            <div className="mt-1 fw-bold">Work Place UUID</div>
                                            <div>{selectedWorkplace.wkp_uuid || '--'}</div>
                                        </div>
                                        <div className="col-6 col-sm-6 pb-3">
                                            <div className="mt-1 fw-bold">Reason</div>
                                            <div>{selectedWorkplace.wkp_reason_code_desc || '--'}</div>
                                        </div>
                                        <div className="col-6 col-sm-6 pb-3">
                                            <div className="mt-1 fw-bold">State</div>
                                            <div>{selectedWorkplace.wkp_state_code_desc || '--'}</div>
                                        </div>
                                        <div className="col-6 col-sm-6 pb-3">
                                            <div className="mt-1 fw-bold">Working Status</div>
                                            <div>{selectedWorkplace.working_status_desc || '--'}</div>
                                        </div>
                                        <div className="col-6 col-sm-6 pb-3">
                                            <div className="mt-1 fw-bold">Activity Location</div>
                                            <div>{selectedWorkplace.activityloc_desc || '--'}</div>
                                        </div>
                                        <div className="col-6 col-sm-6 pb-3">
                                            <div className="mt-1 fw-bold">Address</div>
                                            <div>{selectedWorkplace.adr_long_lbl || '--'}</div>
                                        </div>
                                        <div className="col-6 col-sm-6 pb-3">
                                            <div className="mt-1 fw-bold">Building Label</div>
                                            <div>{selectedWorkplace.building_lbl || '--'}</div>
                                        </div>
                                        <div className="col-6 col-sm-6 pb-3">
                                            <div className="mt-1 fw-bold">City</div>
                                            <div>{selectedWorkplace.city || selectedWorkplace.postal_city || '--'}</div>
                                        </div>
                                        <div className="col-6 col-sm-6 pb-3">
                                            <div className="mt-1 fw-bold">Post Code</div>
                                            <div>{selectedWorkplace.lgpostcode || '--'}</div>
                                        </div>
                                        <div className="col-6 col-sm-6 pb-3">
                                            <div className="mt-1 fw-bold">Country</div>
                                            <div className="text-capitalize">{getCountryFromCodbase(selectedWorkplace.wkp_country) || '--'}</div>
                                        </div>
                                        <div className="col-12 col-sm-6 pb-3">
                                            <div className="mt-1 fw-bold">Contact Number</div>
                                            {selectedWorkplace.wkp_phone || '--'}
                                        </div>
                                        <div className="col-12 col-sm-6 pb-3">
                                            <div className="mt-1 fw-bold">Fax</div>
                                            {selectedWorkplace.wkp_fax || '--'}
                                        </div>
                                        <div className="col-12 col-sm-6 pb-3">
                                            <div className="mt-1 fw-bold">Workplace Created At</div>
                                            {selectedWorkplace.wkp_create_date ? (new Date(selectedWorkplace.wkp_create_date)).toLocaleDateString('en-GB').replace(/\//g, '.') : '--'}
                                        </div>
                                    </div>
                                </div>}

                            {selectedWorkplace && selectedWorkplace.latitude && selectedWorkplace.longitude && <MapView location={{ latitude: selectedWorkplace.latitude, longitude: selectedWorkplace.longitude }} />}
                        </Tab>
                        <Tab eventKey="Consents" title="Legal Agreements">
                            <div className="row mt-4">
                                <div className="col">
                                    {multichannelConsents && multichannelConsents.length ?
                                        <>
                                            <div class="cdp-tab__details-title p-3 pt-0">Consents</div>
                                            {
                                                multichannelConsents.map((consent, index) =>
                                                    <div key={index} class="accordion-consent mb-4">
                                                        <span class="d-flex px-3">
                                                            <i class="icon icon-check-filled cdp-text-primary consent-check"></i>
                                                            <span class="consent-summary mx-2 small">
                                                                <div>{parse(consent.default_consent_text_vod || '')}</div>
                                                                <div className="pt-2"><span className="pe-1 text-dark"><i className="icon icon-check-square me-1 small"></i>Content Type:</span> <span className="text-capitalize">{consent.content_type}</span></div>
                                                                <div className=""><span className="pe-1 text-dark"><i className="icon icon-check-square me-1 small"></i>Opt Type:</span> <span className="text-capitalize">{consent.opt_type}</span></div>
                                                                <div><span className="pe-1 text-dark"><i className="icon icon-calendar-check me-1 small"></i>Capture date:</span>{consent.capture_datetime ? (new Date(consent.capture_datetime)).toLocaleDateString('en-GB').replace(/\//g, '.') : 'Not available'}</div>
                                                            </span>
                                                        </span>
                                                    </div>
                                                )
                                            }
                                        </>
                                    : <div className="m-3 alert alert-warning">No data found.</div>}
                                </div>
                            </div>
                        </Tab>
                    </Tabs>
                </div>
                : <div className="fw-bold p-4" role="alert">
                    Details not found because this HCP User is not in the GLPG IQVia OneKey population.
                </div>
            }
        </Modal.Body>
    </Modal>
}


export default CrdlpHcpProfileDetails;
