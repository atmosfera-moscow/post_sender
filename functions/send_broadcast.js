const check_history = require('./check_history.js');
const add_history = require('./add_history.js');

module.exports = async (group_id, post_link, action) => {
    try {
        if (await check_history(action.from_group, post_link, action.to_chat_list, action.to_group, action.action_type)){
            let request = require('request');
            let options = {
                'method': 'POST',
                'url': 'https://broadcast.vkforms.ru/api/v2/broadcast?token=' + action.to_token,
                'headers': {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "message":
                        {
                            "message": action.text,
                            "attachment": [post_link]
                        },
                    "list_ids": [action.to_chat_list],
                    "run_now": 1
                })
            };

            request(options, async function (error, response) {
                if (error) throw new Error(error);
                // console.log(response.body);

                await add_history(action.from_group,post_link,chat_id,action.to_group, action.action_type);
                console.log(group_id, 'рассылка отправлена. Статус', JSON.parse(response.body).response.status, post_link);
            });

        }
        else{
            console.log(action.from_group, 'рассылка поста уже была', post_link, action.to_group, chat_id);
            return true;
            }
    }
    catch (e) {
        console.log(group_id, 'ошибка в send_broadcast.js', e)
    }
};
