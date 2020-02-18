/**
 * ROUTER PART
 */
// Used for the routes title
export const SiteName = 'Thomas Lacroix';
export const TitleSeparator = ' - ';

// Vue Router Mode config
export const RouterMode = 'history';

/**
 * API PART
 */
export const APIConfig = {
  baseURL: '',
  withCredentials: true,
  crossDomain: true,
  contentType: false,
  responseType: 'json',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

/**
 * GOOGLE ANALYTICS PART
 */
export const enableAnalytics = true;
export const analyticsKey = 'UA-109303937-1';
export const disableAnalyticsInDebug = true;
