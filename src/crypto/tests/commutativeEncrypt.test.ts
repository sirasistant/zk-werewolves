import { commutativeDecrypt, commutativeEncrypt, rerandomizeEncryption } from '../commutativeEncrypt';
import ElGamal from '../elGamal';

describe('Commutative encryption utilities', ()=>{
  it('should decrypt a value with encryption in different order than decryption', async ()=>{
    const elGamal = await ElGamal.build();

    const plaintext = elGamal.genPubKey(elGamal.genPrivKey());
      
    const privKey = elGamal.genPrivKey();
    const pubKey = elGamal.genPubKey(privKey);
      
    const anotherPrivKey = elGamal.genPrivKey();
    const anotherPubKey = elGamal.genPubKey(anotherPrivKey);
      
    const yetAnotherPrivKey = elGamal.genPrivKey();
    const yetAnotherPubKey = elGamal.genPubKey(yetAnotherPrivKey);
      
    // First encrypter
    let encrypted = commutativeEncrypt(elGamal, plaintext, pubKey);
    // Second encrypter
    encrypted = commutativeEncrypt(elGamal, encrypted, anotherPubKey);
    // Third encrypter
    encrypted = commutativeEncrypt(elGamal, encrypted, yetAnotherPubKey);
      
    // Second encrypter decrypts
    encrypted = commutativeDecrypt(elGamal, encrypted, anotherPrivKey, 1);
    // First encrypter decrypts
    encrypted = commutativeDecrypt(elGamal, encrypted, privKey, 0);
    // Third encrypter decrypts
    const decrypted = commutativeDecrypt(elGamal, encrypted, yetAnotherPrivKey, 2);

    expect(decrypted.c2).toEqual(plaintext);
  });

  it('should be able to rerandomize values', async ()=>{
    const elGamal = await ElGamal.build();

    const plaintext = elGamal.genPubKey(elGamal.genPrivKey());
      
    const privKey = elGamal.genPrivKey();
    const pubKey = elGamal.genPubKey(privKey);
                  
    let encrypted = commutativeEncrypt(elGamal, plaintext, pubKey);
    encrypted = rerandomizeEncryption(elGamal, encrypted, pubKey, 0);
      
    const decrypted = commutativeDecrypt(elGamal, encrypted, privKey, 0);

    expect(decrypted.c2).toEqual(plaintext);
  });
});