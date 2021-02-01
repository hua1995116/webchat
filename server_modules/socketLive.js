class SocketLive {
  constructor() {
    this.onLineRoom = {}; // roomId: {userId: true/false}
  }
  initRoom(roomId) {
    if (!this.onLineRoom[roomId]) {
      this.onLineRoom[roomId] = {};
    }
  }
  addOnlineUser(roomId, userId) {
    this.initRoom(roomId);
    if (!this.onLineRoom[roomId][userId]) {
      this.onLineRoom[roomId][userId] = true;
    }
  }
  removeOnlineUser(roomId, userId) {
    if (this.onLineRoom[roomId]) {
      delete this.onLineRoom[roomId][userId];
    }
  }
  getOnlineUser(roomId) {
    return this.onLineRoom[roomId];
  }
}

module.exports = SocketLive;