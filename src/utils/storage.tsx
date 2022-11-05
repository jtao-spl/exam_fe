export const rm = (key:string)=>{
    window.localStorage.removeItem(key)
}
export const get = (key:string):string=>{
    const val = localStorage.getItem(key);
    if (!val){
        return ''
    }
    return val;
}
export const set=(key:string, val:string)=>{
    return localStorage.setItem(key,val);
}
export const clear = ()=>{
    return localStorage.clear();
}