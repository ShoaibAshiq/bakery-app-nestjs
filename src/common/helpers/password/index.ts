import * as bcrypt from 'bcrypt';

const SALT_ROUND = 10;

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, SALT_ROUND);
}

export async function testPassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}
