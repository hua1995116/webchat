class User {
    name: String
    src: String
    roomid: String
    socketid: String
}

class Room {
    User
}

class Users {
    Room
}

class RoomCount {
    count: Number
}

class UserR {
    rooms: RoomCount
    socketid: String 
}

class UserRedis {
    UserR
}