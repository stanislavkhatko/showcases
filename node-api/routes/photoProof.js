const router = require('express').Router();
const photoProofController = require('./../controllers/photoProofController')
const {project} = require('../middlewares/middleware');

router.get('/api/photo-proof', project, photoProofController.showNewPhotoProof);
router.get('/api/photo-proof/projects', photoProofController.showMovePhotoProof);
router.post('/api/photo-proof/projects', photoProofController.updateMovePhotoProof);
router.post('/api/photo-proof', photoProofController.storePhotoProof);
router.post('/api/photo-proof/destroy', photoProofController.destroyPhotoProof);

router.get('/api/photo-proof/:photoProofId', photoProofController.showPhotoProof);
router.post('/api/photo-proof/:photoProofId', photoProofController.updatePhotoProof);

module.exports = router;
