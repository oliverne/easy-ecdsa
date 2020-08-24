import ECDSA from '../ecdsa';

let ec: ECDSA;

beforeEach(() => {
  ec = new ECDSA();
});

test('New instance', () => {
  expect(ec).toBeInstanceOf(ECDSA);
});

test('New key pair', () => {
  expect(ec.publicKey).toBeDefined();
  expect((ec as any).privateKey).not.toBeDefined();
});

test('Sign from a string', () => {
  const invalidSign = (msg?: any) => {
    return () => (ec as any).sign(msg);
  };
  expect(invalidSign()).toThrow('message not defined');
  expect(invalidSign(null)).toThrow('message not defined');
  expect(invalidSign('')).toThrow('message not defined');
  expect(invalidSign({})).toThrow('message must be a string');
  expect(ec.sign('any message')).not.toBeFalsy();
});

test('Sign from an array', () => {
  expect(() => ec.sign(['a', null, 'c', 'd'] as any)).toThrow();
  expect(() => ec.sign(['a', {}, 'c', 'd'] as any)).toThrow();
  expect(() => ec.sign(['a', undefined, 'c', 'd'] as any)).toThrow();

  expect(ec.sign(['a', 12345678, 'c', 'd'])).not.toBeFalsy();
});

test('Verify with a string', () => {
  const sig = ec.sign('test');
  const verifying = (pkey?: string) => {
    return ec.verify('test', sig, pkey);
  };

  expect(verifying()).toBe(true);
  expect(() => verifying('invalid public key')).toThrow(
    'must be a valid Base58 encoded string'
  );
  expect(() => verifying('IOLiol0000')).toThrow(
    'must be a valid Base58 encoded string'
  );
  expect(verifying(ec.publicKey)).toBe(true);
  expect(verifying('WrQngPubKey99999')).toBe(false);
});

test('Verify with an array', () => {
  const msg = ['foo', 'bar', 1234];
  const sig = ec.sign(msg);

  const verifying = (pkey?: string) => {
    return ec.verify(msg, sig, pkey);
  };

  expect(verifying()).toBe(true);
});
