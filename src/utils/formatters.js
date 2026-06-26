export function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatSchoolAddress({ address, city, stateCode, zip }) {
  const locality = [city, stateCode].filter(Boolean).join(", ");
  return [address, locality, zip].filter(Boolean).join(" ");
}

export function generateZillowUrl(formattedAddress = "") {
  const address = String(formattedAddress).trim();
  const withoutPunctuation = address.replace(/[.,]/g, "");
  const withHyphens = withoutPunctuation.replace(/\s+/g, "-");
  return `https://www.zillow.com/homes/${withHyphens}_rb/`;
}
