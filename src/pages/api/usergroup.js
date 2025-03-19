import { authMiddleware } from "@/lib/authMiddleware";
import conn from "@/lib/conn";
import User from "@/model/user";
import UserGroup from "@/model/usergroup";
import { generateToken, verifyToken } from "@/utils/jwt";
import sendMail from "@/utils/mail";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Assistant from "@/model/assistant";

export default authMiddleware(async function handler(req, res) {
  await conn();
  const { method } = req;
  const userId = req.user.id || req.user.userId.id;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  switch (method) {
    case "POST": {
      const { action } = req.query;

      if (action == "createGroup") {
        try {
          const user = await User.findById(userId);
          if (!user) {
            return res
              .status(401)
              .json({ success: false, message: "Unauthorized" });
          }
          if (user.role == "student") {
            return res
              .status(400)
              .json({ success: false, message: "Unauthorized" });
          }

          const { name, description } = req.body;
          const group = new UserGroup({
            name,
            description,
            groupAdmin: userId,
          });
          await group.save();

          if (!user.groups) {
            user.groups = [];
          }
          user.groups.push(group._id);
          await user.save();

          return res
            .status(200)
            .json({ success: true, message: "Group created", group });
        } catch (error) {
          console.log(error);
          return res
            .status(500)
            .json({ success: false, message: "Failed to create group" });
        }
      } else if (action == "addUser") {
        try {
          const { groupId, userIdToAdd } = req.body;

          const group = await UserGroup.findById(groupId);
          if (!group) {
            return res
              .status(404)
              .json({ success: false, message: "Group not found" });
          }

          const user = await User.findById(userId);
          if (!user) {
            return res
              .status(401)
              .json({ success: false, message: "Unauthorized" });
          }

          const isAdmin = group.groupAdmin.equals(userId);
          const isManager = group.groupManagers.some((manager) =>
            manager.manager.equals(userId)
          );

          if (!isAdmin && !isManager) {
            return res
              .status(403)
              .json({
                success: false,
                message:
                  "Unauthorized: Only group admin or manager can add users",
              });
          }

          const userToAdd = await User.findById(userIdToAdd);
          if (!userToAdd) {
            return res
              .status(404)
              .json({ success: false, message: "User not found" });
          }

          group.users.push({ user: userIdToAdd, joinedAt: new Date() });
          await group.save();

          return res
            .status(200)
            .json({ success: true, message: "User added to group", group });
        } catch (error) {
          console.log(error);
          return res
            .status(500)
            .json({ success: false, message: "Failed to add user to group" });
        }
      } else if (action == "inviteUser") {
        try {
          const { groupId, email } = req.body;
          console.log(req.body);
          const group = await UserGroup.findById(groupId);
          if (!group) {
            return res
              .status(404)
              .json({ success: false, message: "Group not found" });
          }

          const user = await User.findById(userId);
          if (!user) {
            return res
              .status(401)
              .json({ success: false, message: "Unauthorized" });
          }

          const isAdmin = group.groupAdmin.equals(userId);
          const isManager = group.groupManagers.some((manager) =>
            manager.manager.equals(userId)
          );

          const userToInvite = await User.findOne({ email });
          if (!userToInvite) {
            return res
              .status(400)
              .json({
                success: false,
                message: "Failed to send Invitation. Please check your email.",
              });
          }

          if (!isAdmin && !isManager) {
            return res
              .status(403)
              .json({
                success: false,
                message:
                  "Unauthorized: Only group admin or manager can add users",
              });
          }

          // Check if the user is already in the group
          const isUserInGroup = group.users.some((user) =>
            user.user.equals(userToInvite._id)
          );
          if (isUserInGroup) {
            return res
              .status(200)
              .json({
                success: false,
                message: "User is already in the group.",
              });
          }

          // Generating a JWT token
          const Token = jwt.sign(
            {
              email: email,
              group: groupId,
            },
            process.env.JWT_SECRET, // Token expires in 15 day
            { expiresIn: "15d" }
          );

          const inviteLink = `${process.env.NEXT_PUBLIC_URL}/group-invitation/${Token}`;
          // Email content
          const subject = `You're Invited to Join ${group.name} group - Ivy AI Tutor`;
          const html = `
  <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f9f9f9; padding: 20px; border-radius: 10px; max-width: 400px; margin: auto;">
    <h2 style="color: #333;">You're Invited to Join <strong>${group.name}</strong></h2>
    <p style="color: #555; font-size: 16px;">${group.description}</p>
    <a href="${inviteLink}" style="display: inline-block; padding: 12px 24px; font-size: 18px; font-weight: bold; 
        border: none; border-radius: 8px; background: #4CAF50; color: white; text-decoration: none; margin: 20px 0;">
      Accept Invitation
    </a>
    <p style="margin-top: 20px; color: #777; font-size: 14px;">This invitation is valid for 15 Days.</p>
    <p style="color: #777; font-size: 14px;">If you did not request this, please ignore this email.</p>
  </div>
`;

          // Send OTP email
          const mailRes = await sendMail(email, subject, html);
          if (mailRes) {
            return res
              .status(200)
              .json({
                success: true,
                message: "Invitation sent successfully.",
              });
          } else {
            return res
              .status(400)
              .json({
                success: false,
                message: "Failed to send Invitation. Please check your email.",
              });
          }
        } catch (error) {
          console.log(error);
          return res
            .status(500)
            .json({ success: false, message: "Failed to add user to group" });
        }
      } else if (action == "acceptInvitation") {
        try {
          const { token } = req.body;
          const decoded = await jwt.verify(token, process.env.JWT_SECRET);

          if (!decoded) {
            return res
              .status(400)
              .json({ success: false, message: "Invalid or expired Link" });
          }

          const { email, group } = decoded;
          const user = await User.findOne({ email });

          if (!user) {
            return res
              .status(404)
              .json({ success: false, message: "User not found" });
          }

          const userGroup = await UserGroup.findById(group);

          if (!userGroup) {
            return res
              .status(404)
              .json({ success: false, message: "Group not found" });
          }

          // Check if the user is already in the group
          const isUserInGroup = userGroup.users.some((u) =>
            u.user.equals(user._id)
          );
          if (isUserInGroup) {
            return res
              .status(200)
              .json({
                success: false,
                message: "User is already in the group.",
              });
          }

          userGroup.users.push({ user: user._id, joinedAt: new Date() });
          await userGroup.save();

          if (!user.groups) {
            user.groups = [];
          }

          user.groups.push(userGroup._id);
          await user.save();

          return res
            .status(200)
            .json({ success: true, message: "User added to group" });
        } catch (error) {
          console.log(error);
          return res
            .status(500)
            .json({ success: false, message: "Failed to accept invitation" });
        }
      } else if (action == "addManager") {
        try {
          const { groupId, managerId } = req.body;

          const group = await UserGroup.findById(groupId);
          if (!group) {
            return res
              .status(404)
              .json({ success: false, message: "Group not found" });
          }

          const manager = await User.findById(managerId);
          if (!manager) {
            return res
              .status(404)
              .json({ success: false, message: "Manager not found" });
          }

          group.groupManagers.push({ manager: managerId, addedAt: new Date() });
          await group.save();

          return res
            .status(200)
            .json({ success: true, message: "Manager added", group });
        } catch (error) {
          console.log(error);
          return res
            .status(500)
            .json({ success: false, message: "Failed to add manager" });
        }
      } else if (action == "shareFiles") {
        try {
          const { groupId, fileId } = req.body;

          const group = await UserGroup.findById(groupId);
          if (!group) {
            return res
              .status(404)
              .json({ success: false, message: "Group not found" });
          }

          const user = await User.findById(userId);
          if (!user) {
            return res
              .status(401)
              .json({ success: false, message: "Unauthorized" });
          }

          const isAdmin = group.groupAdmin.equals(userId);
          const isManager = group.groupManagers.some((manager) =>
            manager.manager.equals(userId)
          );

          if (!isAdmin && !isManager) {
            return res
              .status(403)
              .json({
                success: false,
                message:
                  "Unauthorized: Only group admin or manager have access",
              });
          }

          // Ensure all fileIds exist in the Assistant model
          const existingFiles = await Assistant.find({
            _id: { $in: fileId },
          }).distinct("_id"); // Get valid file IDs
          if (existingFiles.length !== fileId.length) {
            return res
              .status(400)
              .json({ success: false, message: "Some files do not exist" });
          }

          // Avoid duplicate entries in `accessMaterials`
          const uniqueFiles = [
            ...new Set([
              ...group.accessMaterials,
              ...existingFiles.map((id) => id.toString()),
            ]),
          ];

          // Update the group with unique file IDs
          group.accessMaterials = uniqueFiles;
          await group.save();

          return res
            .status(200)
            .json({ success: true, message: "Files shared in the group" });
        } catch (error) {
          console.log(error);
          return res
            .status(500)
            .json({ success: false, message: "Failed to share file" });
        }
      } else {
        return res
          .status(405)
          .json({ success: false, message: "Invalid Action" });
      }
    }

    case "GET": {
      const { action } = req.query;

      if (action == "getGroup") {
        try {
          console.log("user id : ", userId);
          const user = await User.findById(userId).populate("groups");

          const groups = user.groups.filter(
            (group) =>
              group.groupAdmin.equals(userId) ||
              group.groupManagers.some((manager) =>
                manager.manager.equals(userId)
              ) ||
              group.users.some((user) => user.user.equals(userId))
          );
          return res.status(200).json({ success: true, group: groups });
        } catch (error) {
          console.log(error);
          return res
            .status(500)
            .json({ success: false, message: "Failed to fetch group" });
        }
      } else if (action === "getGroupMembers") {
        const { groupId } = req.query;

        try {
          const group = await UserGroup.findById(groupId).populate(
            "users.user",
            "name email"
          );
          if (!group) {
            return res
              .status(404)
              .json({ success: false, message: "Group not found" });
          }

          const members = group.users.map((user) => ({
            email: user.user.email,
            joinedAt: user.joinedAt,
          }));

          return res.status(200).json({ success: true, members });
        } catch (error) {
          console.error(error);
          return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
        }
      } else if (action === "getSharedFile") {

        try {
          const user = await User.findById(userId).populate(
            "groups",
            "name accessMaterials"
          );
          if (!user) {
            return res
              .status(401)
              .json({ success: false, message: "Unauthorized" });
          }

         // Extract all file IDs and their associated group names
  const fileIds = user.groups.flatMap((group) =>
    group.accessMaterials.map((fileId) => ({
      fileId,
      groupName: group.name,
    }))
  );

  // Fetch corresponding file details from Assistant collection
  const files = await Assistant.find({ _id: { $in: fileIds.map((item) => item.fileId) } });

  // Create a mapping of file IDs to their names
  const fileMap = new Map(files.map((file) => [file._id.toString(), file.name]));

  // Format the response with fileId, fileName, and groupName
  const formattedFiles = fileIds.map(({ fileId, groupName }) => ({
    _id: fileId.toString(),
    fileName: fileMap.get(fileId.toString()) || "Unknown File",
    groupName,
  }));

  return res.status(200).json({ success: true, files: formattedFiles });
        } catch (error) {
          console.error(error);
          return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
        }
      } else {
        return res
          .status(405)
          .json({ success: false, message: "Invalid Action" });
      }
    }

    case "PUT": {
      // ...existing code...
    }

    case "DELETE": {
      // ...existing code...
    }

    default:
      return res
        .status(405)
        .json({ success: false, message: "Method not allowed" });
  }
});
