const groupWithoutTwist = ['1', '2', '3', '4', '5', '6'];
const groupWithTwist = ['5', '6'];

/// Special codes:
/// 000A: 前倒下A
/// 000B: 背向倒下

function getDiveGroupName(diveGroup) {
    let name = null;
    switch (diveGroup) {
        case '1': name = 'Forward'; break;
        case '2': name = 'Back'; break;
        case '3': name = 'Reverse'; break;
        case '4': name = 'Inward'; break;
        case '6': name = 'Armstand'; break;
        default: name = null; break;
    }
    if (name && name) name += ' Dive';
    return name;
}
function getSomersaultNumber(number) {
    let somersaults = null;
    try {
        let n = parseInt(number);
        somersaults =
            (n/2 >= 1 ? Math.trunc(n/2) : '') +
            (n%2 === 1 ? '½' : '') +
            (n > 0 ? ' Somersaults': '');
    } catch {
        somersaults = null;
        console.log('getSomersaultNumber: invalid number encountered: ' + number);
    }
    return somersaults;
}
function getPositionName(position) {
    let name = null;
    switch (position) {
        case 'A': name = 'Straight'; break;
        case 'B': name = 'Pike'; break;
        case 'C': name = 'Tuck'; break;
        case 'D': name = 'Free'; break;
        default: name = null; break;
    }
    if (name && name) name = 'With ' + name + ' Position';
    return name;
}
export default function GetDiveName(diveCode) {
    if (diveCode && diveCode && diveCode.length > 0) {
        let diveName = [];
        let diveGroup = diveCode[0];
        if (diveCode.length === 4 && groupWithoutTwist.indexOf(diveGroup) > -1) {
            diveName.push(getDiveGroupName(diveGroup));
            if (diveCode[1] === '1') diveName.push('Flying');
            diveName.push(getSomersaultNumber(diveCode[2]));
            diveName.push(getPositionName(diveCode[3]));
        } else if (diveCode.length === 5 && groupWithTwist.indexOf(diveGroup) > -1) {
            //TODO
        } else {
            if (diveCode === '000A') diveName = ['前倒下A'];
            else if (diveCode === '000B') diveName = ['背向倒下'];
            else {
                //unknown dive code
                diveName = [];
            }
        }
        return diveName.join(' ').trimEnd();
    }
}