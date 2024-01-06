const Parse = require('../helpers/parse');
const projectService = require("../services/projectService");


exports.showPhotoProof = async (req, res) => {
    const {photoProofId} = req.params;

    res.send({
        ...await Parse.Cloud.run('photoProofTags', {
            photoProofId,
        })
    })
}

exports.showNewPhotoProof = async (req, res) => {

    res.send({
        ...await Parse.Cloud.run('photoProofTags', {})
    })
}

exports.showMovePhotoProof = async (req, res) => {
    res.send(await projectService.getUserProjects(req))
}

exports.updateMovePhotoProof = async (req, res) => {

    let photos = await new Parse.Query('PhotoProof').containedIn('objectId', req.body.photoProofIds).find()

    photos.map(async photo => {
        await photoProofService.updateMovePhotoProof(photo)
    })

    res.send(photos)
}

exports.destroyPhotoProof = async (req, res) => {
    await new Parse.Query('PhotoProof').containedIn('objectId', req.body).find().then(async photoProofs => {
        res.send(await Parse.Object.destroyAll(photoProofs));
    })
}


exports.storePhotoProof = async (req, res) => {
    const requestPhotoProof = req.body.photoProof

    await Promise.all(requestPhotoProof.photos.map(async image => {
        await photoProofService.savePhoto(image)
    }))

    res.send({
        ...await Parse.Cloud.run('photoProofTags', {
            photoProofId: photoProofs[0].id,
        })
    })
}

exports.updatePhotoProof = async (req, res) => {

    await photoProofService.updatePhotoProofTags(photoProof, req.body.photoProofTags)
    await photoProofService.updatePhotoProofCustomTags(photoProof, req.body.photoProofCustomTags)
    await photoProofService.updatePhotoProofBlockTags(photoProof, req.body.photoProofBlockTags)

    res.send({
        ...await Parse.Cloud.run('photoProofTags', {
            photoProofId: photoProof.id,
            platform: 'web',
        })
    })

}
