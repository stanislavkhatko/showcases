const router = require('express').Router();
const adminController = require('../controllers/adminController')
const adminFakeController = require('../controllers/adminFakeController')

router.post('/api/admin/fake/users', adminFakeController.usersFake);
router.post('/api/admin/fake/photoproofs', adminFakeController.photoProofsFake);
router.post('/api/admin/fake/project/photoproofs', adminFakeController.projectPhotoProofsFake);
router.post('/api/admin/fake/photoproof-tags', adminFakeController.photoProofTagsFake);
router.post('/api/admin/fake/project-members', adminFakeController.projectMembersFake);
router.post('/api/admin/fake/workspace-invites', adminFakeController.workspaceInvitesFake);
router.post('/api/admin/fake/workspace-users', adminFakeController.workspaceUsersFake);
router.post('/api/admin/fake/tagsets', adminFakeController.tagSetsFake);
router.post('/api/admin/fake/workspaces', adminFakeController.workspacesFake);
router.post('/api/admin/fake/projects', adminFakeController.projectsFake)
router.post('/api/admin/fake/project/project-tags', adminFakeController.projectProjectTagsFake)
router.post('/api/admin/fake/photoproof/tags', adminFakeController.photoProofPhotoProofTagsFake)

router.post('/api/admin/fake/project-tags', adminFakeController.projectTagsFake)
router.post('/api/admin/fake/reports', adminFakeController.reportsFake)
router.post('/api/admin/fake/teams', adminFakeController.teamsFake)

module.exports = router;
