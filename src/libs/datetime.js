export const generateDatetime = (origDatetime, offsetInMillisec) => new Date(origDatetime.getTime() + parseInt(offsetInMillisec))