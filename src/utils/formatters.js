/**
 * src/utils/formatters.js
 * Integrated localized formatting and Zillow link generation utilities.
 */

/***NFR7 / FR1.3: Formats currency values cleanly.*/
export function currency(value) {
  if (value == null) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

/*Normalizes school physical address parameters.*/
export function formatSchoolAddress({ address, city, stateCode, zip }) {
  const locality = [city, stateCode].filter(Boolean).join(", ");
  return [address, locality, zip].filter(Boolean).join(" ");
}

/*FR4.1 - FR4.4: Zillow Link Generation*/
export function generateZillowUrl(formattedAddress = "", zip = "") {
  const address = [formattedAddress, zip].filter(Boolean).join(" ").trim();
  
  // Strip punctuation, replace spaces with hyphens, and force lowercase for clean routing
  const withoutPunctuation = address.replace(/[.,]/g, "");
  const withHyphens = withoutPunctuation.toLowerCase().replace(/\s+/g, "-");
  
  return `https://www.zillow.com/homes/${withHyphens}_rb/`;
}
