const {ImageKit} = require('@imagekit/nodejs')

const ImageKitClient = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})

async function uploadFile(file){
    const result = await ImageKitClient.files.upload({
        file,
        fileName: "profiledp_" + Date.now(),
        folder: "instagram/dp"
    })
    return result
}

async function postFile(file){
    const result = await ImageKitClient.files.upload({
        file,
        fileName: "post_" + Date.now(),
        folder: "instagram/post"
    })
    return result
}

module.exports = {uploadFile, postFile}