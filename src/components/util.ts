// utils to delay promise
function wait(ms: any) {
    return (x: any) => {
        return new Promise((resolve) => setTimeout(() => resolve(x), ms));
    };
}

export { wait };
