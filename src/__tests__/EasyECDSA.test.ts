import EasyECDSA from '../EasyECDSA';

test('new instance', () => {
  const ec = new EasyECDSA();
  expect(ec).toBeInstanceOf(EasyECDSA);
});

test('new key pair', () => {
  const ec = new EasyECDSA()
  expect(ec.publicKey).toBeDefined()
})