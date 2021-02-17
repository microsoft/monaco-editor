export const throttle = <A extends any[]>(
    fn: (...args: A) => void,
    wait = 100
) => {
    let time = Date.now();
    return (...args: A) => {
        if (time + wait - Date.now() < 0) {
            fn(...args);
            time = Date.now();
        }
    };
};
