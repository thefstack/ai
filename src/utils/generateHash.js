import crypto from 'crypto';

export function generatePayUHash(data, key, salt) {
  const hashString = `${key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${salt}`;
  return crypto.createHash('sha512').update(hashString).digest('hex');
}
