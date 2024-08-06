const userModel = require('../model/userModel');
const cloudinary = require('../utils/cloudinary');

exports.updateUser = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email: email });

        if (!user) return res.status('404').json({ message: 'user does not exist' });

        const update = await userModel.findByIdAndUpdate(user._id, req.body, { new: true });

        res.status(200).json({
            status: "Successful",
            message: "user data updated successful"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.uploadDocument = async (req, res, next) => {
    try {
        const id = req.params.userId;
        const user = await userModel.findById(id);

        // if (!user) return res.status(404).json({ message: "User does not exist" });
        if (!user) throw new AppError(404, "User does not exist");

        const files = req.file;
        if (!files) return res.status.json({ message: "File is required" });

        const imageURL = await cloudinary.uploads(files.path);

        const uploadFile = await userModel.findByIdAndUpdate(user._id, { uploadedCV: imageURL.url }, { new: true });

        res.status(200).json({
            status: "Successful",
            data: uploadFile
        });

    } catch (error) {
        return next(error);
    }
};