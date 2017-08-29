import mongoose, { Schema } from 'mongoose'

import { deleteFile } from '../middleware/s3'

const ArticleSchema = new Schema({
  page: { type: Schema.ObjectId, ref: 'Page' },
  pageSlug: { type: String, trim: true },
  image: {
    src: { type: String, trim: true },
    width: { type: Number, trim: true, default: 333 },
    height: { type: Number, trim: true, default: 188 }
  },
  section: { type: Schema.ObjectId, ref: 'Section' },
  values: {
    button1Text: { type: String, trim: true },
    button1Link: { type: String, trim: true },
    button2Text: { type: String, trim: true },
    button2Link: { type: String, trim: true },
    flexFlow: { type: String, trim: true, default: 'row wrap' },
    h1Text: { type: String, trim: true, default: 'Heading 1' },
    h2Text: { type: String, trim: true, default: 'Heading 2' },
    h3Text: { type: String, trim: true, default: 'Heading 3' },
    iframe: { type: String, trim: true },
    mediaAlign: { type: String, trim: true, default: 'right' },
    mediaFlex: { type: String, trim: true, default: '1 1 auto' },
    pFlex: { type: String, trim: true, default: '1 1 500px'},
    pText: { type: String, trim: true, default: '<p>Paragraph</p>' },
  }
}, {
  timestamps: true
})


ArticleSchema.post('findOneAndRemove', function(doc) {
  if (doc.image && doc.image.src) {
    deleteFile({ Key: doc.image.src }).catch(err => console.error(err))
  }
})

ArticleSchema.post('remove', function(doc) {
  if (doc.image && doc.image.src) {
    deleteFile({ Key: doc.image.src }).catch(err => console.error(err))
  }
})

const Article = mongoose.model('Article', ArticleSchema)

export default Article