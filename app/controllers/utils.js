const postsUrl = "http://localhost:3000/posts/";

function idGenerator() {
    return 'xxxxxxxx-yxxx'.replace(/[xy]/g, c => {
    let r = Math.random() * 16 | 0;
    let v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
    });
}


function isFloat(value) {
    return typeof value === 'number' && !Number.isInteger(value);
}


exports.generateUUID = generateUUID;
exports.isFloat = isFloat