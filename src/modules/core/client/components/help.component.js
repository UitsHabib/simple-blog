import React, { useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { useSelector, useDispatch } from 'react-redux';
import { getFaqItems, getFaqTopics } from '../../../platform/faq/client/faq.actions';
import { NavLink } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import parse from 'html-react-parser';
import Dropdown from 'react-bootstrap/Dropdown';


export default function Help() {
    const faq = useSelector(state => state.faqReducer.faq_items);
    const faqTopics = useSelector(state => state.faqReducer.faq_topics);
    const [faqData, setFaqData] = useState(null);
    const [selectedfaq, setSelectedfaq] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => { setShow(false); setSelectedfaq([]) };
    const handleShow = (selectedFaq) => { setShow(true); setSelectedfaq(selectedFaq); };

    const dispatch = useDispatch();

    useEffect(() => {

        if (faqTopics && faq.faq) {
            setFaqData(faqMapping(faqTopics, faq.faq.length > 0 ? faq.faq : null));
        }
    }, [faqTopics, faq]);

    useEffect(() => {
        dispatch(getFaqItems('?limit=1000'));
        dispatch(getFaqTopics());
    }, []);

    const faqMapping = (topics, faqs) => {
        const faqWithTopics = [];

        const parentCategories = [...new Set(Object.values(topics).map((item) => item.category))];
        parentCategories.forEach(parentCategoryTitle => {
            const parentCategoryTopic = topics.filter(x => x.category === parentCategoryTitle && x.title === x.category);
            const childCategoryTopics = topics.filter(x => x.category === parentCategoryTitle && x.title !== x.category);

            childCategoryTopics.sort((a, b) => {
                if (+a.order < +b.order) return -1;
                if (+b.order < +a.order) return 1;
                return 0;
            });

            const categoryTopics = [...parentCategoryTopic, ...childCategoryTopics];

            categoryTopics.forEach(item => {
                if (faqs) item.faq = faqs.filter(x => x.topics.includes(item.id));
            });

            faqWithTopics.push({
                category: parentCategoryTitle,
                subcategories: categoryTopics
            });
        });

        return faqWithTopics;
    }


    return (
        <React.Fragment>
            <main className="app__content cdp-light-bg h-100">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 px-0">
                            <nav className="breadcrumb justify-content-between align-items-center" aria-label="breadcrumb">
                                <ol className="rounded-0 m-0 p-0 d-none d-sm-flex">
                                    <li className="breadcrumb-item"><NavLink to="/">Dashboard</NavLink></li>
                                    <li className="breadcrumb-item active"><span>Help</span></li>
                                </ol>
                                <Dropdown className="dropdown-customize breadcrumb__dropdown d-block d-sm-none ms-2">
                                    <Dropdown.Toggle variant="" className="cdp-btn-outline-primary dropdown-toggle btn d-flex align-items-center border-0">
                                        <i className="fas fa-arrow-left me-2"></i> Back
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item className="px-2" href="/"><i className="fas fa-link me-2"></i> Dashboard</Dropdown.Item>
                                        <Dropdown.Item className="px-2" active><i className="fas fa-link me-2"></i> Help</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </nav>
                        </div>
                    </div>
                    {faqData && <div className="container px-0 py-2">
                        <div className="row">

                            <div className="col-12"><h3 className="cdp-text-primary py-3">Topics</h3></div>

                            <div className="col-12 col-sm-6 col-lg-6">
                                {faqData.map((category, index) => (
                                    (index % 2) === 0 && <ul key={index} className="list-group shadow-sm faq__list-group mb-4">
                                        {category.subcategories.map((topics, id) => (
                                            <li key={id} className="list-group-item d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center justify-content-between w-100">
                                                    <i className={`${topics.icon} ${id === 0 ? 'cdp-text-secondary' : 'cdp-text-primary'} ${topics.icon.includes('fa') ? 'fa-2x' : topics.icon.includes('ico') ? 'ico-2x' : 'icon-2x'} faq__list-group-icon`}></i>
                                                    <span className="pe-3 me-auto">{topics.title}</span>
                                                    <span className="badge badge-light badge-pill cdp-text-primary">{topics.faq ? topics.faq.length : 0}</span>
                                                </div>
                                                <i data-testid={`category-${topics.title}`} className="fas fa-external-link-square-alt cdp-text-primary faq__list-group--modal-open" onClick={() => handleShow(topics.faq)}></i>
                                            </li>
                                        ))}

                                    </ul>
                                ))}
                            </div>

                            <div className="col-12 col-sm-6 col-lg-6">
                                {faqData.map((category, index) => (
                                    (index % 2) !== 0 && <ul key={index} className="list-group shadow-sm faq__list-group mb-4">
                                        {category.subcategories.map((topics, id) => (
                                            <li key={id} className="list-group-item d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center justify-content-between w-100">
                                                    <i className={`${topics.icon} ${id === 0 ? 'cdp-text-secondary' : 'cdp-text-primary'} ${topics.icon.includes('fa') ? 'fa-2x' : topics.icon.includes('ico') ? 'ico-2x' : 'icon-2x'} faq__list-group-icon`}></i>
                                                    <span className="pe-3 me-auto">{topics.title}</span>
                                                    <span className="badge badge-light badge-pill cdp-text-primary">{topics.faq ? topics.faq.length : 0}</span>
                                                </div>
                                                <i className="fas fa-external-link-square-alt cdp-text-primary faq__list-group--modal-open" onClick={() => handleShow(topics.faq)}></i>
                                            </li>
                                        ))}

                                    </ul>
                                ))}
                            </div>


                            <Modal size="lg" centered show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Questions You May Have</Modal.Title>
                                </Modal.Header>
                                <Modal.Body className="faq">
                                    <Accordion defaultActiveKey={0} className="faq__body">
                                        {
                                            selectedfaq && selectedfaq.map((item, index) => (
                                                <Accordion.Item key={index} eventKey={index}>
                                                    <Accordion.Header  className="p-0 d-flex align-items-baseline justify-content-between border-bottom" role="button">
                                                        <span className="faq__question">{item.question}</span>
                                                        {/* <i className="icon icon-arrow-down ms-2 faq__icon-down"></i> */}
                                                    </Accordion.Header>
                                                    <Accordion.Body className="p-0">
                                                        <Card.Body>{parse(parse(item.answer))}</Card.Body>
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            ))
                                        }
                                        {!selectedfaq || (selectedfaq && selectedfaq.length === 0) ?
                                            <div className="bg-white text-center py-3 px-2 border-0">
                                                <i className="icon icon-help icon-3x cdp-text-secondary"></i>
                                                <h5 className="cdp-text-primary pt-4">No data found related to this service category</h5>
                                            </div> : null
                                        }
                                    </Accordion>
                                </Modal.Body>

                            </Modal>

                        </div>
                    </div>}
                </div>
            </main>
        </React.Fragment>
    );
}
