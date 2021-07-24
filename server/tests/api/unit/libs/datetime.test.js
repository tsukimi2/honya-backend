import chai from 'chai'
const expect = chai.expect
import { generateDatetime } from '../../../../src/libs/datetime.js'

describe('libs/datetime', () => {
  it('should generate correct timestamp with posiive offset', () => {
    const origDatetime = new Date()
    const offsetInMillisec = 10000
    const generatedDt = generateDatetime(origDatetime, offsetInMillisec)
    const expectedTs = new Date(origDatetime.getTime() + offsetInMillisec).getTime()
    
    expect(generatedDt).to.be.an.instanceof(Date)
    expect(generatedDt.getTime()).to.equal(expectedTs)
  })

  it('should generate correct timestamp with negative offset', () => {
    const origDatetime = new Date()
    const offsetInMillisec = -10000
    const generatedDt = generateDatetime(origDatetime, offsetInMillisec)
    const expectedTs = new Date(origDatetime.getTime() + offsetInMillisec).getTime()
    
    expect(generatedDt).to.be.an.instanceof(Date)
    expect(generatedDt.getTime()).to.equal(expectedTs)
  })

  it('should generate curret timestamp with no offset argument', () => {
    const origDatetime = new Date()
    const offsetInMillisec = 0
    const generatedDt = generateDatetime(origDatetime)
    const expectedTs = new Date(origDatetime.getTime() + offsetInMillisec).getTime()
    
    expect(generatedDt).to.be.an.instanceof(Date)
    expect(generatedDt.getTime()).to.equal(expectedTs)    
  })

  it('should generate current timestamp with origDatetime=null', () => {
    const origDatetime = null
    const offsetInMillisec = 0
    const generatedDt = generateDatetime()
    const expectedTs = new Date().getTime()
    
    expect(generatedDt).to.be.an.instanceof(Date)
    expect(generatedDt.getTime()).to.equal(expectedTs)  
  })
})