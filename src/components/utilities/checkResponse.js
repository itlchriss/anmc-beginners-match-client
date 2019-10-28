export function CheckResponse (resultFromPromises)
{
    if (!resultFromPromises) return false;
    else {
        let check = resultFromPromises.filter(r => r.status === 200 && r.data && r.data.data);
        return check.length !== resultFromPromises.length;
    }
}
export function CheckResponseAcceptEmptyData (resultFromPromises) {
    if (!resultFromPromises) return false;
    else {
        let check = resultFromPromises.filter(r => r.status === 200);
        return check.length !== resultFromPromises.length;
    }
}