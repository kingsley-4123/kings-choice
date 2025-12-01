
export function checkFee(amount) {
  const feePerce = 0.014;    // i.4% = 1.4/100 = 0.014
  let fee = amount * feePerce;

  if (fee >= 2000) {
    fee = 2000;
  }

  return fee;
}