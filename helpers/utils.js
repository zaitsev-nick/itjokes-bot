export const escapeText = (text) => {
  if (text) {
    return text.replace(/</g, '').replace(/>/g, '').replace(/&/g, '');
  }
  return text;
};

export const generateRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};
