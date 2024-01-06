const Parse = require('../helpers/parse');
module.exports = {
  workspaceObject: function () {
    const Workspace = Parse.Object.extend('Workspace');
    return new Workspace()
  },
  workspaceInviteObject: function () {
    const WorkspaceInvite = Parse.Object.extend('WorkspaceInvite');
    return new WorkspaceInvite()
  },
  formObject: function () {
    const Form = Parse.Object.extend('Form');
    return new Form()
  },
  tagObject: function () {
    const Tag = Parse.Object.extend('Tag');
    return new Tag()
  },
};
