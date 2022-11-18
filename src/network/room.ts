import { createLibp2p } from 'libp2p';
import { webSockets } from '@libp2p/websockets';
import { webRTCStar } from '@libp2p/webrtc-star';
import { Noise } from '@chainsafe/libp2p-noise';
import { mplex } from '@libp2p/mplex';
import { kadDHT } from '@libp2p/kad-dht';
import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import Room from 'ipfs-pubsub-room';

async function buildP2PNode() {
  const wrtcStar = webRTCStar();

  const libP2p = await createLibp2p({
    addresses: {
      listen: [
        '/ip4/127.0.0.1/tcp/13579/ws/p2p-webrtc-star/',
      ],
    },
    transports: [
      webSockets(),
      wrtcStar.transport,
    ],
    connectionEncryption: [() => new Noise()],
    streamMuxers: [mplex()],
    peerDiscovery: [
      wrtcStar.discovery,
    ],
    pubsub: gossipsub(),
    dht: kadDHT(),
  });

  // Listen for new peers
  libP2p.addEventListener('peer:discovery', (evt) => {
    // dial them when we discover them
    console.debug(`Dialing peer ${evt.detail.id.toString()}`);

    libP2p.dial(evt.detail.id).catch(err => {
      console.debug(`Could not dial ${evt.detail.id}`, err);
    });
  });
  
  await libP2p.start();

  console.log(`libp2p id is ${libP2p.peerId.toString()}`);

  return libP2p;
}

export default async function createRoom(topic: string) {
  return new Room(await buildP2PNode(), topic);
}
