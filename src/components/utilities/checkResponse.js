/**
 * @return {boolean}
 */
export function CheckResponse (resultFromPromises)
{
    if (!resultFromPromises) return false;
    else {
        let check = resultFromPromises.filter(r => r.status === 200 && r.data && r.data.data);
        return Number(check.length) === Number(resultFromPromises.length);
    }
}
/**
 * @return {boolean}
 */
export function CheckResponseAcceptEmptyData (resultFromPromises) {
    if (!resultFromPromises) return false;
    else {
        let check = resultFromPromises.filter(r => r.status === 200);
        return check.length !== resultFromPromises.length;
    }
}