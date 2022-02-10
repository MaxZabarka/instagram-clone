const sharp = require("sharp");
const { v4: uuid } = require("uuid");

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
};

const updateBio = (req, res, next) => {
    try {
        const bio = req.body.bio;
        db.collection("users").updateOne(
            { _id: req.userData._id },
            { $set: { bio } }
        );
        res.sendStatus(200);
    } catch (e) {
        return next(e);
    }
};

const updateProfile = (req, res, next) => {
    try {
        if (!MIME_TYPE_MAP[req.file.mimetype])
            throw new HttpError("Invalid mimetype", 400);

        const folder = "uploads/images/";
        const name = uuid() + "." + "jpeg";
        const path = folder + name;

        const image = sharp(req.file.buffer);
        Promise.all([
            image.toFormat("jpeg").jpeg({ quality: 80 }).toFile(path),
            db.collection("users").updateOne({ _id: req.userData._id }, { $set: { avatarUrl: path } }),
        ]).then(() => {
            res.send({ path });
        });
    } catch (e) {
        return next(e);
    }
};
module.exports = { updateBio, updateProfile };
