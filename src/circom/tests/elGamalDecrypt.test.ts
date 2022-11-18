import ElGamal from '../../crypto/elGamal';
import { compileAndLoadCircuit, executeCircuit, getSignalByName } from './testUtils';

jest.setTimeout(30_000);

describe('Elgamal decryption circuit', ()=>{
  let decryptCircuit: any;
  let elGamal: ElGamal;

  beforeAll(async ()=>{
    decryptCircuit = await compileAndLoadCircuit('tests/ElGamalDecryptMain.circom');
    elGamal = await ElGamal.build();
  });

  it('should decrypt a ciphertext', async () => {
    const privKey = elGamal.genPrivKey();
    const pubKey = elGamal.genPubKey(privKey);

    const plaintext = elGamal.genPubKey(elGamal.genPrivKey());
    const { c1, c2 } = elGamal.encrypt(plaintext, pubKey);

    const circuitInputs = {
      c1: elGamal.pointToBI(c1),
      c2: elGamal.pointToBI(c2),
      privKey: elGamal.formatPrivKeyForBabyJub(privKey),
    };

    const witness = await executeCircuit(decryptCircuit, circuitInputs);
    const outX = getSignalByName(decryptCircuit, witness, 'main.outX'); 
    const outY = getSignalByName(decryptCircuit, witness, 'main.outY'); 

    expect([outX, outY]).toEqual(elGamal.pointToBI(plaintext));
  });

});