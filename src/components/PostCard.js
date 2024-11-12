import React, { useState } from "react";
import { Card, Button, Modal, Input, Upload } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  LikeOutlined,
  MessageOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";

const PostCard = ({ post, onEdit, onDelete }) => {
  const { id, content, profileUrl, postImage } = post;
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(content);
  const [newImage, setNewImage] = useState(postImage);
  const [isExpanded, setIsExpanded] = useState(false); // State for Read More / Read Less

  // Handle Edit
  const handleSaveEdit = () => {
    if (newContent !== content || newImage !== postImage) {
      onEdit(id, newContent, newImage);
    }
    setIsEditing(false);
  };

  // Handle Delete
  const handleDelete = () => {
    onDelete(id);
  };

  // Handle Image Upload for editing
  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => setNewImage(reader.result);
    reader.readAsDataURL(file);
    return false; // Prevent default upload behavior
  };

  // Toggle Read More/Read Less
  const toggleReadMore = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <Card hoverable className="shadow-lg rounded-xl max-w-lg mx-auto">
    <div className="border-b pb-2">
      <div className="flex items-center space-x-3 bg-gray-50 rounded-full">
        <img
          src={profileUrl}
          alt="Profile"
          className="rounded-full w-10 h-10"
        />
        <div>
          <h3 className="font-semibold text-md">Admin!</h3>
          <p className="text-xs text-gray-500">10/11/2024 - 10:34</p>
        </div>
      </div>
    </div>
  
    {/* Post Content with Read More/Read Less */}
    <div className="py-2 text-gray-800">
      {isEditing ? (
        <>
          <Input.TextArea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={4}
          />
          <Upload beforeUpload={handleImageUpload} showUploadList={false}>
            <Button>Upload New Image</Button>
          </Upload>
        </>
      ) : (
        <div>
          <p>
            {isExpanded ? content : `${content.slice(0, 100)}...`}{" "}
            {/* Truncate content */}
          </p>
          <Button
            type="link"
            onClick={toggleReadMore}
            className="text-blue-500"
          >
            {isExpanded ? "Read Less" : "Read More"} {/* Toggle text */}
          </Button>
        </div>
      )}
    </div>
  
    {/* Post Image */}
    {postImage && !isEditing && (
      <div className="w-full h-64 overflow-hidden rounded-md">
        <img
          alt="Post Image"
          src={postImage}
          className="w-full h-full object-cover "
          style={{ objectFit: 'cover' }}
        />
      </div>
    )}
  
    {/* Actions */}
    <div className="flex items-center justify-between mt-4 text-gray-600 border-t ">
      <Button
        className="text-sm px-2 text-gray-600"
        type="link"
        icon={<LikeOutlined />}
      >
        Like
      </Button>
      <Button
        className="text-sm px-2 text-gray-600"
        type="link"
        icon={<MessageOutlined />}
      >
        Comment
      </Button>
      <Button
        className="text-sm px-2 text-gray-600"
        type="link"
        icon={<ShareAltOutlined />}
      >
        Share
      </Button>
    </div>
  
    {/* Edit and Delete Buttons at the Bottom */}
    <div className="flex justify-center  border-t  bg-gray-50 rounded-full">
      {!isEditing && (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => setIsEditing(true)}
            className="text-blue-500"
          >
            Edit
          </Button>
          <Button
            type="link"
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            className="text-red-500"
          >
            Delete
          </Button>
        </>
      )}
    </div>
  

      {/* Edit Modal */}
      <Modal
        title="Edit Post"
        visible={isEditing}
        onOk={handleSaveEdit}
        onCancel={() => setIsEditing(false)}
        okText="Save"
        bodyStyle={{ padding: '10px' , }}
        cancelText="Cancel"
      >
        <div className="space-y-5">
          <div>
            <label className="block font-medium pb-3">Content :</label>
            <Input.TextArea className="bg-gray-50"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Edit post content"
              rows={4}
            />
          </div>
          <div>
            <label className="block font-medium">Post Image</label>
            <Upload beforeUpload={handleImageUpload} showUploadList={false}>
              <Button className="bg-gray-100" >Upload New Post Image</Button>
            </Upload>
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default PostCard;
