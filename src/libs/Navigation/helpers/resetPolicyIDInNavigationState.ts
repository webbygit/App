import Navigation, {navigationRef} from '@libs/Navigation/Navigation';
import type {SearchFullscreenNavigatorParamList} from '@libs/Navigation/types';
import * as SearchQueryUtils from '@libs/SearchQueryUtils';
import NAVIGATORS from '@src/NAVIGATORS';
import SCREENS from '@src/SCREENS';

/**
 * Reset the policyID stored in the navigation state to undefined.
 * It is necessary to reset this id after deleting the policy which is currently selected in the app.
 */
function resetPolicyIDInNavigationState() {
    const rootState = navigationRef.getRootState();
    const lastPolicyRoute = rootState?.routes?.findLast((route) => route.name === NAVIGATORS.REPORTS_SPLIT_NAVIGATOR || route.name === NAVIGATORS.SEARCH_FULLSCREEN_NAVIGATOR);
    if (!lastPolicyRoute) {
        return;
    }

    if (lastPolicyRoute.params && 'policyID' in lastPolicyRoute.params) {
        Navigation.setParams({policyID: undefined}, lastPolicyRoute.key);
        return;
    }

    const lastSearchRoute = lastPolicyRoute.state?.routes.findLast((route) => route.name === SCREENS.SEARCH.ROOT);
    if (!lastSearchRoute || !lastSearchRoute.params) {
        return;
    }
    const {q, ...rest} = lastSearchRoute.params as SearchFullscreenNavigatorParamList[typeof SCREENS.SEARCH.ROOT];
    const queryJSON = SearchQueryUtils.buildSearchQueryJSON(q);
    if (!queryJSON || !queryJSON.policyID) {
        return;
    }

    delete queryJSON.policyID;
    Navigation.setParams({q: SearchQueryUtils.buildSearchQueryString(queryJSON), ...rest}, lastSearchRoute.key);
}

export default resetPolicyIDInNavigationState;
