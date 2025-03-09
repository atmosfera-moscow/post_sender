import express from 'express'
import bodyParser from 'body-parser'
const { urlencoded, json } = bodyParser
import { PORT, NODE_ENV, TEST_CONF } from './config.js'
const app = express()

import processing from './processing.js'
import { get_conf, get_actions } from './f_db/queries.js'
import { createDBPool } from './f_db/dbConnection.js'

app.use(urlencoded({ extended: true }))
app.use(json())

app.post('/post_sender', async (req, res) => {
  // console.log('Hello')
  // console.log(req)
  try {
    const { body } = req
    console.log('\nПолучен новый реквест')
    // console.log(body)
    switch (body.type) {
      case 'confirmation':
        let conf = NODE_ENV !== 'production' ? TEST_CONF : await get_conf(body.group_id)
        res.end(conf)
        break

      case 'wall_post_new':
        let group_id = body.group_id
        let post_text = body.object.text
        let post_type_own = body.object.owner_id === body.object.from_id ? 'official' : 'user'
        let post_link = 'wall' + body.object.owner_id + '_' + body.object.id.toString()
        console.log(`${group_id} Получен пост ${post_type_own} ${post_link} ${post_text.slice(0, 10)}`)
        // console.log(JSON.stringify(body))
        const dbPool = await createDBPool()
        let actions = await get_actions(group_id, post_type_own, dbPool)
        await processing(group_id, post_type_own, post_link, post_text, actions, dbPool)

        res.end('ok')
        break

      default:
        res.end('ok')
        break
    }
  } catch (e) {
    console.log(`ошибка в app.js ${e}`)
  }
})

app.listen(PORT, () => console.log(`Hello, motherfuckers! on port ${PORT}`))
