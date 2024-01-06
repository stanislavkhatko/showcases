const Parse = require('../helpers/parse');
const {projectTagObject} = require("../entities/objects");

module.exports = {
    getUserProjects(req) {
        return new Promise((resolve) => {
            let projectsQuery;

            if (req.workspace) projectsQuery = new Parse.Query('Project').equalTo('workspace', req.workspace)
            else projectsQuery = new Parse.Query('Project').doesNotExist('workspace');

            resolve(projectsQuery.include(['creator.name']).descending('photoUploadedAt').limit(9999).find());
        });
    },


    getUserChildProjects(req) {
        return new Promise((resolve) => {
            let projectsQuery = new Parse.Query('Project').equalTo('parentProject', req.project)

            resolve(projectsQuery.include(['creator.name']).descending('photoUploadedAt').limit(1000).find());
        });
    },

    getUserProjectOverview(req) {
        return new Promise((resolve) => {

            let projectsQuery = new Parse.Query('Project').equalTo('rootProject', req.project.get('rootProject') || req.project)

            resolve(projectsQuery.include(['creator.name']).descending('photoUploadedAt').limit(1000).find());
        });
    },

    getProjectsTeamMembers: async (projects = []) => {
        return await Promise.all(projects.map(async (project) => {
            if(project) {
                await new Parse.Query('ProjectMember').equalTo('project', project).include(['user.avatar', 'user.picture', 'user.thumbnail']).find().then(projectMembers => {
                    let teamMembers = [];

                    projectMembers.forEach(projectMember => {
                            let user = projectMember.get('user');

                            if(user && !teamMembers.find(member => member.id === user.id)) teamMembers.push({
                                id: user.id,
                                name: user.get('name'),
                                thumbnail: (user.get('avatar') && user.get('avatar').url()) || user.get('picture') || user.get('thumbnail')
                            });
                    });

                    project.set('teamMembers', teamMembers);
                });
            }
        }))
    },
    getProjectsTags: async (projects = []) => {
        return await Promise.all(projects.map(async (project) => {
            await new Parse.Query('ProjectTag').equalTo('project', project).include('tag').find().then(projectTags => {
                let tags = [];

                projectTags.forEach(projectTag => {
                    let tag = projectTag.get('tag');

                    if(tag) tags.push({
                        id: projectTag.id,
                        name: tag.get('name'),
                        nameTranslation: tag.get('nameTranslation'),
                        type: tag.get('type'),
                        value: projectTag.get('value'),
                    });
                });

                project.set('projectTags', tags);
            });
        }))
    },
    getProjectsProjectMember: async (projects = [], user) => {
        return await Promise.all(projects.map(async (project) => {
            if(project) await new Parse.Query('ProjectMember').equalTo('project', project).equalTo('user', user).find().then(projectMembers => {

                if (projectMembers.length) {
                    let member = {
                        rights: [],
                        projectArchived: false,
                    };

                    projectMembers.map(projectMember => {
                        if(projectMember.get('rights')) member.rights =  member.rights.concat(projectMember.get('rights'))
                        if (projectMember.get('projectArchived')) member.projectArchived = projectMember.get('projectArchived')
                    })

                    project.set('projectMember', member)
                } else {
                    project.set('projectMember', null)
                }
            });
        }))
    },
    updateProjectTags: async (project, editedProjectTags = {}) => {
        return await Promise.all(Object.entries(editedProjectTags).map(async (tag) => {
            let tagId, value = [...tag];

            await new Parse.Query('ProjectTag').equalTo('project', project).equalTo('tag', {
                __type: 'Pointer',
                className: 'Tag',
                objectId: tagId
            }).first()
        }));
    },

}



