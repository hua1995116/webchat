import io from 'socket.io-client';
import config from '../config/client';

const socket = io.connect(config.server);

export default socket;
