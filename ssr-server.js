const express = require('express')
const next = require('next')
const moment = require("moment")

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const mongoose = require('mongoose')
const connectOption = {
  useUnifiedTopology: true,
  useNewUrlParser: true
}

mongoose.connect("mongodb+srv://Ryuheyhey:@CGPVgLimiiB5Tm@cluster0.72biz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", connectOption)
const db = mongoose.connection
db.on("error", console.error.bind(console, 'DB connection error:'))
db.once("open", () => console.log('DB connection successful'))
const checklistSchema = require("./model/checklistSchema")
const { post } = require('./model/checklistSchema')
const Checklist = mongoose.model("checklist", checklistSchema, "checklist")

app.prepare()
  .then(() => {
    const server = express()

    server.use(express.json())

    // 全投稿取得
    server.get('/index/get', async (req, res) => {
      // sort({})で取得する順番を指定
      const checklists = await Checklist.find({}).sort({created: 'desc'})
      res.json(checklists)
    })

    // 指定したidの投稿取得
    server.get('/detail/get/:id', async (req, res) => {
      const postId = req.params.id
      const checklist = await Checklist.findById(postId).sort({created: 'desc'})
      res.json(checklist)
    })

    server.get('/daily/get/:date', async (req, res) => {
      const date = req.params.date
      const checklist = await Checklist.find({created: {
        $gte: moment(date).toDate()
      }}).sort({created: 'desc'})
      res.json(checklist)
    })
    
    // 投稿の登録
    server.post('/daily/add/post', async(req, res) => {
      const checklist = new Checklist({
        title: req.body.title,
        content_1: req.body.content_1, 
        content_2: req.body.content_2, 
        content_3: req.body.content_3, 
        content_4: req.body.content_4, 
        created: Date.now()
      })
      const saveChecklist = await checklist.save()

      return app.render(req, res, '/daily/add', req.query)
    })

    // 投稿を編集
    server.put('/edit/put/:id', (req, res) => {
      const postId = req.params.id
      Checklist.findById(postId, (err, doc) => {
        if(err) {
          res.send(err)
        } else {
          doc.title = req.body.title
          doc.content_1 = req.body.content_1
          doc.content_2 = req.body.content_2
          doc.content_3 = req.body.content_3
          doc.content_4 = req.body.content_4

          doc.save((err) => {
            if(err) {
              res.send(err)
            } else {
              res.json()
            }
          })
        }
      })
    })

    // 投稿を消去
    server.delete('/delete/:id', (req, res) => {
      const postId = req.params.id
      Checklist.remove({_id: postId})
        .then(() => {
          res.json()
        })
    })

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(3000, (err) => {
      if (err) throw err
      console.log('> Ready on http://localhost:3000')
    })
  })
  .catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
  })