export const uid=()=>{
    return sessionStorage.getItem("uid");
}
export const name=()=>{
    return sessionStorage.getItem("name");
}

export const isRoomCreator=()=>{
    return sessionStorage.getItem("isRoomCreator");
}