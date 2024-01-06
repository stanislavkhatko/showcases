const Parse = require('../helpers/parse');
const {projectMemberObject, workspaceUserObject} = require("../entities/objects");


exports.workspacesFake = async (req, res) => {
    Parse.Cloud.startJob('Faker_AddWorkspaces', req.body).then(e => res.send(e)).catch(e => res.send(e))
}

exports.projectsFake = async (req, res) => {
    Parse.Cloud.startJob('Faker_AddProjects', req.body).then(e => res.send(e)).catch(e => res.send(e))
}

exports.projectProjectTagsFake = async (req, res) => {

    for (let tag of await new Parse.Query('ProjectTag').equalTo('project', req.body.project).limit(99999).find()) await tag.destroy()

    Parse.Cloud.startJob('Faker_FillProjectTags', req.body).then(e => res.send(e)).catch(e => res.send(e))
}
exports.photoProofPhotoProofTagsFake = async (req, res) => {
    let tags = await new Parse.Query('PhotoProofTag').equalTo('photoProof', req.body.photoProof).limit(99999).find();

    for (let tag of tags) await tag.destroy()

    Parse.Cloud.startJob('Faker_FillPhotoProofTags', req.body).then(e => res.send(e)).catch(e => res.send(e))
}

exports.projectTagsFake = async (req, res) => {
    Parse.Cloud.startJob('Faker_AddProjectTags', req.body).then(e => res.send(e)).catch(e => res.send(e))
}

exports.teamsFake = async (req, res) => {
    Parse.Cloud.startJob('Faker_AddTeams', req.body).then(e => res.send(e)).catch(e => res.send(e))
}
exports.reportsFake = async (req, res) => {
    Parse.Cloud.startJob('Faker_AddReports', req.body).then(e => res.send(e)).catch(e => res.send(e))
}

exports.tagSetsFake = async (req, res) => {
    Parse.Cloud.startJob('Faker_AddTagSets', req.body).then(e => res.send(e)).catch(e => res.send(e))
}

exports.photoProofsFake = async (req, res) => {
    Parse.Cloud.startJob('Faker_AddPhotoProofs', req.body).then(e => res.send(e)).catch(e => res.send(e))
}

exports.projectPhotoProofsFake = async (req, res) => {
    Parse.Cloud.startJob('Faker_AddProjectPhotoProofs', req.body).then(e => res.send(e)).catch(e => res.send(e))
}

exports.photoProofTagsFake = async (req, res) => {
    Parse.Cloud.startJob('Faker_AddPhotoProofTags', req.body).then(e => res.send(e)).catch(e => res.send(e))
}

exports.workspaceInvitesFake = async (req, res) => {
    Parse.Cloud.startJob('Faker_AddWorkspaceInvites', req.body).then(e => res.send(e)).catch(e => res.send(e))
}

exports.projectMembersFake = async (req, res) => {
    let project = req.body.project;

    let projectMembers = await new Parse.Query('ProjectMembers').equalTo('project', project).distinct('user');
    let users = await new Parse.Query('_User').limit(+req.body.count).notContainedIn('objectId', projectMembers.map(i => i.id)).find();

    users.map(user => {
        new projectMemberObject().set({
            project,
            user,
            rights: ["canCreateSubprojects", "canRemoveMembers", "canInviteMembers"]
        }).save()
    })

    res.send('done')
}

exports.workspaceUsersFake = async (req, res) => {
    let workspace = req.body.workspace;

    let workspaceRoles = await new Parse.Query('WorkspaceRole').notEqualTo('slug', 'superadmin').find();
    let workspaceUsers = await new Parse.Query('WorkspaceUser').equalTo('workspace', workspace).limit(999999).distinct('user');
    let users = await new Parse.Query('_User').limit(+req.body.count).notContainedIn('objectId', workspaceUsers.map(i => i.id)).find();

    users.map(user => {
        new workspaceUserObject().set({
            workspace,
            workspaceRole: workspaceRoles[Math.floor(Math.random() * workspaceRoles.length)],
            user
        }).save()
    })

    res.send('done')
}

exports.usersFake = async (req, res) => {
    Parse.Cloud.startJob('Faker_AddUsers', req.body).then(e => res.send(e)).catch(e => res.send(e))
}
