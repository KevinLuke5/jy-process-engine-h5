const getURLParam = (code: string): string => {
  let productCode = '';
  const productStr = code;
  const reg = new RegExp('(\\^?|^？|#|&)[s|p]=(.*?)(&|#|$)', 'i');
  const r = productStr.substr(productStr.indexOf('?') + 1).match(reg);
  if (r!== null) {
    productCode = unescape(r[2]);
  } else {
    productCode = productStr;
  }
  const pCode = productCode.split(',');
  if (pCode) {
    productCode = pCode[pCode.length - 1];
  }
  console.log(productCode);
  return productCode;
};

export default getURLParam;