import ElGamal, { BabyJubPoint, PrivKey, PubKey } from './elGamal';

export interface EncryptedValue {
  c1List: BabyJubPoint[],
  c2: BabyJubPoint
}

export function commutativeEncrypt(elGamal : ElGamal, source : BabyJubPoint | EncryptedValue, publicKey: PubKey): EncryptedValue {
  let c1List : BabyJubPoint[];
  let c2OrPlaintext : BabyJubPoint;

  if ('c1List' in source) {
    c1List = source.c1List.slice();
    c2OrPlaintext = source.c2;
  } else {
    c1List = [];
    c2OrPlaintext = source;
  }

  const result = elGamal.encrypt(c2OrPlaintext, publicKey);
  
  c1List.push(result.c1);

  return {
    c1List,
    c2: result.c2,
  };
}
  
export function rerandomizeEncryption(elGamal: ElGamal, cypher : EncryptedValue, publicKey: PubKey, index: number): EncryptedValue {
  const { c1List: previousC1List,  c2 } = cypher;
  const c1 = previousC1List[index];
  
  const { c1: newC1, c2: newC2 } = elGamal.rerandomize(publicKey,  c1, c2 );
  
  const newC1List = previousC1List.slice();
  newC1List[index] = newC1;
  
  return {
    c1List: newC1List,
    c2: newC2,
  };
}
  
export function commutativeDecrypt(elGamal: ElGamal, cypher: EncryptedValue, privateKey: PrivKey, index: number): EncryptedValue {
  const { c1List,  c2 } = cypher;
  
  const c1 = c1List[index];
  
  const decrypted = elGamal.decrypt(privateKey, c1, c2);
  
  return {
    c1List: c1List,
    c2: decrypted,
  };
}
  
export function replaceEncryption(elGamal: ElGamal, cypher: EncryptedValue, previousPrivateKey: PrivKey, newPublicKey: PubKey, index: number) {
  const { c1List,  c2 } = commutativeEncrypt(elGamal, commutativeDecrypt(elGamal, cypher, previousPrivateKey, index), newPublicKey);

  const c1 = c1List.pop();
  c1List[index] = c1!;

  return { c1List, c2 };
}