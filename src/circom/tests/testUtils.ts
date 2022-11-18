import path from 'path';
import circom from 'circom_tester';

// Polyfill for running circom_tester on JSDom
require('setimmediate');  // eslint-disable-line import/no-extraneous-dependencies

export const compileAndLoadCircuit = async (circuitPath: string) => {
  const circuit = await circom.wasm(path.join(__dirname, `../${circuitPath}`));
  
  await circuit.loadSymbols();
  
  return circuit;
};
  

export const executeCircuit = async (circuit: any, inputs: any) => {
  const witness = await circuit.calculateWitness(inputs, true);
  await circuit.checkConstraints(witness);
  await circuit.loadSymbols();

  return witness;
};

export const getSignalByName = (circuit: any, witness: any, signal: string) => {
  return witness[circuit.symbols[signal].varIdx];
};
