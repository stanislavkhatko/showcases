const SlackNotify = require('slack-notify');

const slack = SlackNotify(process.env.SLACK_LOGS_ENDPOINT || '');

const slackService = {
    log(text = '', fields = [], extra = []) {

        try {
            slack.send({
                text: text,
                fields: fields,
                ...extra,
            }).catch(e => {
                console.log(e);
            })
        } catch (e) {
            console.log(e);
        }

    },
}

module.exports = slackService;
