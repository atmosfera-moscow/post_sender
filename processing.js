import { send_to_chat } from './f_vk/send_to_chat.js'
import { send_broadcast } from './f_vk/send_broadcast.js'

export default async (group_id, post_type_own, post_link, post_text, actions, dbPool = undefined) => {
  try {
    for (let num_action in actions) {
      try {
        if (actions.hasOwnProperty(num_action)) {
          let action = actions[num_action]
          console.log(`${group_id} работаем с действием ${action.id} ${action.description}`)

          // даём заголовок посту
          const titleIndex = post_text.indexOf('#_ ')
          if (titleIndex !== -1) {
            action.text = post_text.slice(titleIndex + 3)
          }
          console.log(`${group_id} новый заголовок рассылки ${action.text}`)

          //проверка на # если нужен
          if (post_type_own === 'official') {
            if (action.extra !== null) {
              if (!post_text.toLowerCase().includes(action.extra.toLowerCase())) {
                console.log(`${group_id} 'осутствует "${action.extra}" в ${post_link}`)
                continue
              } else {
                console.log(`${group_id} есть "${action.extra}" в ${post_link}`)
              }
            }
          }

          if (action.action_type === 'broadcast') {
            await send_broadcast(group_id, post_link, action, dbPool)
          } else if (action.action_type === 'to_chat') {
            if (action.to_chat_list === 'all') {
              console.log(`${group_id} мод ВСЕ чаты`)
              let flag = true
              let chat_id = 2000000001
              while (flag && chat_id < 2000000101) {
                if (chat_id !== action.except) {
                  flag = await send_to_chat(post_link, chat_id, action, dbPool)
                } else {
                  console.log(`${group_id} не отправляем в чат except ${chat_id}`)
                }
                chat_id += 1
              }
            } else {
              await send_to_chat(post_link, action.to_chat_list, action, dbPool)
            }
          }
        }
      } catch (e) {
        console.log(`${group_id} ошибка в processing.js action=${num_action} ${e}`)
      }
    }
  } catch (e) {
    console.log(`${group_id} ошибка в processing.js ${e}`)
  }
}
