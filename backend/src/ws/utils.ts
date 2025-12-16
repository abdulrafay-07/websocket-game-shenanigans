export function generateCode(length = 6) {
  const possibleValues = `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ`;
  let code = "";

  for (let i = 0; i < length; i++) {
    code += possibleValues.charAt(Math.floor(Math.random() * possibleValues.length));
  };

  return code;
};
