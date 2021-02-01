import env from '@utils/env';
import socket from './socket';
import store from './store/index1';

// export async function handleInit({
//   name,
//   id,
//   src,
//   roomList
// }) {
//     // 此处逻辑需要抽离复用
//   socket.emit('login', {name, id, ...env});
//   ['room1', 'room2'].forEach(item => {
//     const obj = {
//       name,
//       src,
//       roomid: item,
//     };
//     socket.emit('room', obj);
//   })
//   await store.dispatch('getRoomHistory', { selfId: id })
// }

export async function handleInit({
  username,
  userId,
  avatar,
  groupList
}) {
    // 此处逻辑需要抽离复用
  socket.emit('login', {username, userId, ...env});
  groupList.forEach(item => {
    const obj = {
      username,
      userId,
      avatar,
      roomId: item.groupId,
    };
    socket.emit('room', obj);
  })
  // console.log(obj);
  // await store.dispatch('getRoomHistory', { selfId: userId })
}