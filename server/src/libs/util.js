export const attachObjToReqLocal = (req, objname, obj) => {
  if(!req.local) {
    req['local'] = {}
  }

  req.local[objname] = obj
}