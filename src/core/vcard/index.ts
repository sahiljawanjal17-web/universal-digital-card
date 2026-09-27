/** vCard (C1). Build on the server or the client; download only on the client. */
export {
  buildVCard,
  splitName,
  slugifyName,
  absoluteUrl,
  VCARD_MIME,
  type BuildVCardInput,
  type BuiltVCard,
} from './build-vcard';
export { downloadVCard, isIOS, vcardRouteHref } from './download';
export { useVCard } from './useVCard';
export { VCardButton, type VCardButtonProps } from './VCardButton';
