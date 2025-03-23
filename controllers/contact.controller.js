const { getImageFileName } = require("../lib/helper.js");
const fs = require("fs");
const ContactModel = require("../models/contact.model.js");

const ContactController = {
  read: async (req, res) => {
    try {
      const { user_id, id } = req.params;
      const { search_by_name } = req.query;
      let filterQuery = { user: user_id };

      if (search_by_name) {
        filterQuery.name = { $regex: new RegExp(search_by_name, "i") };
      }

      if (id) {
        const contact = await ContactModel.findOne({ _id: id });
        if (contact) {
          res.status(200).json({ flag: 1, contact });
        } else {
          res.status(404).json({ flag: 0, message: "No Contact found!" });
        }
      } else {
        const contacts = await ContactModel.find(filterQuery).sort({ createdAt: -1 });
        res.status(200).json({ flag: 1, contacts });
      }
    } catch (error) {
      res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
  },

  create: async (req, res) => {
    try {
      const { email, contact, user, name } = req.body;

      const isEmailExists = await ContactModel.findOne({ email, user });
      if (isEmailExists) {
        return res.status(400).json({ flag: 0, message: "Email already exists!" });
      }

      const isContactExists = await ContactModel.findOne({ contact });
      if (isContactExists) {
        return res.status(400).json({ flag: 0, message: "Contact number already exists!" });
      }

      const image = req.files?.profile_image;
      let profile_image = "";

      if (image) {
        profile_image = getImageFileName(image.name);
        const destination = `./public/profile-images/${profile_image}`;
        await image.mv(destination);
      }

      const newContact = new ContactModel({ name, email, contact, user, profile_image });
      await newContact.save();

      res.status(201).json({ flag: 1, message: "Contact saved successfully." });
    } catch (error) {
      res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedContact = await ContactModel.findByIdAndUpdate(id, req.body, { new: true });

      if (!updatedContact) {
        return res.status(404).json({ flag: 0, message: "No contact found!" });
      }

      res.status(200).json({ flag: 1, message: "Contact updated successfully!" });
    } catch (error) {
      res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedContact = await ContactModel.findByIdAndDelete(id);

      if (!deletedContact) {
        return res.status(404).json({ flag: 0, message: "No contact found!" });
      }

      res.status(201).json({flag:1,message:"Contact deleted successfully!"}); 
    } catch (error) {
      res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
  },

  profileImageDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const contact = await ContactModel.findById(id);

      if (!contact || !contact.profile_image) {
        return res.status(404).json({ flag: 0, message: "Profile image not found!" });
      }

      fs.unlink(`./public/profile-images/${contact.profile_image}`, () => {});
      contact.profile_image = "";
      await contact.save();

      res.status(200).json({ flag: 1, message: "Profile image deleted!" });
    } catch (error) {
      res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
  },

  profileUpload: async (req, res) => {
    try {
      const { id } = req.params;
      const image = req.files?.profile_image;

      if (!image) {
        return res.status(400).json({ flag: 0, message: "Image is required!" });
      }

      const contact = await ContactModel.findById(id);
      if (!contact) {
        return res.status(404).json({ flag: 0, message: "Contact not found!" });
      }

      const image_name = getImageFileName(image.name);
      const destination = `./public/profile-images/${image_name}`;
      await image.mv(destination);

      // Delete the old profile image
      if (contact.profile_image) {
        fs.unlink(`./public/profile-images/${contact.profile_image}`, () => {});
      }

      contact.profile_image = image_name;
      await contact.save();

      res.status(200).json({ flag: 1, message: "Profile image updated successfully!", image_name });
    } catch (error) {
      res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
  },
};

module.exports = ContactController;
