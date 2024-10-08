const cloudinary=require('cloudinary').v2;
const multer=require('multer');
const {CloudinaryStorage}=require('multer-storage-cloudinary')

//configure cloudinary
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})

const storage=new CloudinaryStorage({
    cloudinary,
    allowedFormats:['jpg','png','jpeg'],
    params:{
        folder:'e-commerce'
    }
})

const upload=multer({
    storage
})


module.exports=upload
