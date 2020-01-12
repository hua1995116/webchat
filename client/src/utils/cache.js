import {getItem, setItem} from './localStorage';
const CACHE_TAG = 'CACHE_TAG';
const roomInfo = {};

const roomObj = {
  total: 0,
  current: 0
}

export function updateCache(roomId, data) {
  let cache = getItem(CACHE_TAG);
  if(!cache) {
    cache = {};
  }
  cache[roomId] = data.data;
  setItem(CACHE_TAG, cache);
}

export function getCache(roomId) {
  let cache = getItem(CACHE_TAG);
  if(!cache) {
    return []
  }
  return cache[roomId];
}

export function updateRoomInfo(roomId, data) {

  if(!roomInfo[roomId]) {
    roomInfo[roomId] = {
      ...roomObj
    }
  }
  Object.keys(data).map(item => (roomInfo[roomId][item] = data[item]));
}

export function getRoomInfo(roomId) {
  if(!roomInfo[roomId]) {
    return {
      ...roomObj
    }
  }
  return roomInfo[roomId];
}