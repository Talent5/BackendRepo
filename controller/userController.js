const userModel = require('../model/userModel');

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