import chai from 'chai'
// import sinon from 'sinon'
// import sinonChai from 'sinon-chai'
// chai.use(sinonChai)
import Category from '../../../../src/category/category.model.js'

const expect = chai.expect

describe('Category model', () => {
  context('Test model validation', () => {
    it('it should be valid with valid category name', (done) => {
      const category = new Category({
        name: 'category1'
      })
      category.validate((err) => {
        expect(err).to.not.exist
        done()
      })
    })
    
    context('Testing name', () => {
      it('it should be invalid with empty name', (done) => {
        const category = new Category({
          name: ''
        })
        category.validate((err) => {
          expect(err.errors.name).to.exist
          expect(err.errors.name.kind).to.eq('required')
          done()
        })
      })

      it('it should be invalid with length greater than 32 characters', (done) => {
        const category = new Category({
          name: '123456789012345678901234567890123'
        })
        category.validate((err) => {
          expect(err).to.exist
          expect(err.errors.name.kind).to.eq('maxlength')
          done()
        })
      })

      it('it should be invalid when name already existed', async () => {
        const categoryName = 'category1'
        let err = null

        try {
          await Category.deleteMany({ name: categoryName })

          await new Category({
            name: categoryName
          }).save()
  
          const category = await new Category({
            name: categoryName
          }).save()
        } catch(e) {
          err = e
        }

        try {
          await Category.deleteMany({ name: categoryName })
        } catch(e) {
          console.log(e)
        }

        expect(err).to.not.null
        expect(err.name).to.eq('MongoError')
        expect(err.message).to.exist
        if(err.message) {
          const words = err.message.split(' ')
          expect(words[0]).to.eq('E11000')
        }
      })
    })
  })

  context('Testing model instance methods', () => {

  })

  context('Testing static functions', () => {

  })
})



/*

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
            unique: true
        }
    },
    { timestamps: true }
);
*/