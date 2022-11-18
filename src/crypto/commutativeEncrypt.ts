import ElGamal, { BabyJubPoint, PrivKey, PubKey } from './elGamal';


interface EncryptedValue {
  c1List: BabyJubPoint[],
  c2: BabyJubPoint
}

export function commutativeEncrypt(elGamal : ElGamal, source : BabyJubPoint | EncryptedValue, publicKey: PubKey): EncryptedValue {
  let c1List : BabyJubPoint[];
  let c2OrPlaintext : BabyJubPoint;

  if (typeof source === 'object' && 'c1List' in source) {
    ({ c1List, c2: c2OrPlaintext } = source);
  } else {
    c1List = [];
    c2OrPlaintext = source;
  }

  const result = elGamal.encrypt(c2OrPlaintext, publicKey);
  
  c1List.push(result.c1);

  return {
    c1List: c1List,
    c2: result.c2,
  };
}
  
export function rerandomizeEncryption(elGamal: ElGamal, cypher : EncryptedValue, publicKey: PubKey, index: number): EncryptedValue {
  const { c1List,  c2 } = cypher;
  const c1 = c1List[index];
  
  const { c1: newC1, c2: newC2 } = elGamal.rerandomize(publicKey,  c1, c2 );
  
  c1List[index] = newC1;
  
  return {
    c1List: c1List,
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
  