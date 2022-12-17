export const sumData = cartData.reduce((accumulator, object) => {
    return accumulator + object.TOTAL_HARGA;
}, 0);