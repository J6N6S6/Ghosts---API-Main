export const getPhoneDDD = (phone: string) => {
  // number format +5511999999999
  if (phone) {
    const phoneArray = phone.split('+55');
    if (phoneArray.length > 1) {
      const ddd = phoneArray[1].substring(0, 2);
      return ddd;
    }
  }
  return '11';
};

export const getPhoneWithoutDDD = (phone: string) => {
  // number format +5511999999999
  if (phone) {
    const phoneArray = phone.split('+55');
    if (phoneArray.length > 1) {
      const number = phoneArray[1].substring(2);
      return number;
    }
  }
  return '999999999';
};
