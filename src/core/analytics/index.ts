/** Analytics barrel. Import `EVENTS` + `track` from here, never a raw file. */
export { EVENTS, type EventName, type EventProps } from './events';
export { track, trackCta, configureAnalytics, isAnalyticsEnabled } from './track';
export { AnalyticsProvider } from './AnalyticsProvider';
export { useSectionView } from './useSectionView';
