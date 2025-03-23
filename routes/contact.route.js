const express = require("express");
const fileUpload = require("express-fileupload");
const ContactController = require("../controllers/contact.controller.js");
const adminAuth = require("../middleware/authUser.js");
const ContactRouter = express.Router();
ContactRouter.get("/:user_id?/:id?", ContactController.read);
ContactRouter.post(
  "/create",adminAuth,
  fileUpload({ createParentPath: true }),
  ContactController.create
);
ContactRouter.put("/update-contact/:id",adminAuth, ContactController.update);
ContactRouter.patch("/profile-upload/:id",adminAuth,fileUpload({createParentPath:true}), ContactController.profileUpload);
ContactRouter.patch("/delete-profile-image/:id",adminAuth, ContactController.profileImageDelete);
ContactRouter.delete("/delete-contact/:id",adminAuth, ContactController.delete);

module.exports = ContactRouter;
