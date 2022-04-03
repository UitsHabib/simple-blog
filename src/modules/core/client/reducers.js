import { combineReducers } from 'redux';
import { phoneExtensionReducer } from '../../core';
import { localizationReducer } from '../localization'
import { countryReducer } from '../country';
import { statisticsReducer } from '../statistics';
import { filterReducer } from '../filter';
import hcpReducer from '../../information/hcp/client/hcp.reducer';
import { consentReducer, consentCategoryReducer, consentPerformanceReducer, consentImportJobReducer, consentClassificationReducer } from '../../privacy';
import personaReducer from '../../information/persona/client/persona.reducer';
import { faqReducer, userReducer, profileReducer, roleReducer, auditReducer, permissionSetReducer } from '../../platform';
import { manageRequestsReducer, managePartnerReducer } from '../../partner';
import { applicationReducer } from '../../platform';
import clinicalTrialsReducer from '../../clinical-trials/client/components/clinical-trials.reducer';
import { campaignReducer, contactReducer, segmentReducer, tagReducer } from '../../marketing';

export default combineReducers({
    countryReducer,
    localizationReducer,
    phoneExtensionReducer,
    statisticsReducer,
    userReducer,
    hcpReducer,
    faqReducer,
    profileReducer,
    roleReducer,
    permissionSetReducer,
    auditReducer,
    manageRequestsReducer,
    managePartnerReducer,
    consentReducer,
    consentCategoryReducer,
    consentClassificationReducer,
    consentPerformanceReducer,
    clinicalTrialsReducer,
    applicationReducer,
    campaignReducer,
    contactReducer,
    consentImportJobReducer,
    segmentReducer,
    tagReducer,
    filterReducer,
    personaReducer
})
