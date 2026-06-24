function generateZillowUrl(formattedAddress = "") {
  const address = String(formattedAddress).trim();
  const withoutPunctuation = address.replace(/[.,]/g, "");
  const withHyphens = withoutPunctuation.replace(/\s+/g, "-");
  return `https://www.zillow.com/homes/${withHyphens}_rb/`;
}