const Parse = require('../helpers/parse');

module.exports = {

    getWorkspaceTags(workspace) {
        return new Promise(resolve => {
            new Parse.Query('Tag').equalTo('workspace', workspace).ascending('order').limit(9999).find().then(tags => {
                resolve(tags)
            })
        })
    },

    removeTagAndTagValues(tag) {
        return new Promise(resolve => {
            tag.destroy();
            resolve('tags destroyed')
        })
    },
}



