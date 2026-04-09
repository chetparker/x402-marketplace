// Email notification stubs.
//
// MVP: logs to console. Replace with Resend, Buttondown, or Supabase Edge
// Functions when ready for real email delivery.
//
// TODO:RESEND — sign up at resend.com, get API key, replace these stubs
// with fetch('https://api.resend.com/emails', { method: 'POST', ... })

const ADMIN_EMAIL = 'chet@payapi.market';

export function notifyAdminNewListing(listing, provider) {
  console.log(`[NOTIFY] New listing submitted — review needed`, {
    to: ADMIN_EMAIL,
    listing: listing.name,
    provider: provider.email,
    url: listing.base_url,
  });
}

export function notifyProviderApproved(provider, listing) {
  console.log(`[NOTIFY] Listing approved`, {
    to: provider.email,
    listing: listing.name,
    message: `Your API "${listing.name}" is now live on PayAPI Market.`,
  });
}

export function notifyProviderRejected(provider, listing, reason) {
  console.log(`[NOTIFY] Listing rejected`, {
    to: provider.email,
    listing: listing.name,
    reason,
  });
}

export function notifyProviderAPIDown(provider, listing) {
  console.log(`[NOTIFY] API down alert`, {
    to: provider.email,
    listing: listing.name,
    message: `Your API "${listing.name}" has been unreachable for 30+ minutes.`,
  });
}

export function notifyProviderWelcome(provider) {
  console.log(`[NOTIFY] Welcome email`, {
    to: provider.email,
    message: `Welcome to PayAPI Market! Your provider account is being reviewed.`,
  });
}
