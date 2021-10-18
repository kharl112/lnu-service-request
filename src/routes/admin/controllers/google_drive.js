const NodeGoogleDrive = require("google-drive-connect");
const service_account_credentials = require("../../../functions/credentials");
const Request = require("../../../db/models/request_model");
require("dotenv").config();

module.exports = (() => {
  const upload_file = async (req, res) => {
    try {
      const request_found = await Request.findOne({
        _id: req.body.directory,
        "admin.staff_id": req.locals.staff_id,
        "admin.signature": { $ne: "" },
      });

      if (!request_found)
        return res.status(404).send({ message: "request not found" });

      const googleDriveInstance = new NodeGoogleDrive({
        ROOT_FOLDER: process.env.ROOT_FOLDER,
      });

      const gdrive = await googleDriveInstance.useServiceAccountAuth(
        service_account_credentials
      );

      const subFolders = await googleDriveInstance.list({
        parentFolder: process.env.ROOT_FOLDER,
      });

      const [existingDirectory] = subFolders.files.filter(
        ({ mimeType, name }) =>
          mimeType === "application/vnd.google-apps.folder" &&
          name === req.body.directory
      );

      const subDirectory =
        existingDirectory ||
        (await googleDriveInstance.create({
          parentFolder: process.env.ROOT_FOLDER,
          name: req.body.directory,
          mimeType: "application/vnd.google-apps.folder",
        }));

      const uploadedFile = await googleDriveInstance.create({
        parentFolder: subDirectory.id,
        name: req.file.originalname,
        source: req.file.buffer,
        mimeType: req.file.mimetype,
      });

      const file = {
        last_uploader: req.locals,
        last_modified: new Date(),
        directory_id: subDirectory.id,
      };

      await Request.findOneAndUpdate(
        {
          _id: req.body.directory,
          "admin.staff_id": req.locals.staff_id,
          "admin.signature": { $ne: "" },
        },
        { options: { ...request_found.options, file } }
      );

      return res.send({ message: "upload complete" });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "something went wrong pls try again" });
      return console.error(error);
    }
  };
  return { upload_file };
})();
