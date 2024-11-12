import React from "react";
import { Avatar, Button } from "antd";

function PhotoCard({ photo, selectedUser }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <img
        src={photo.imageUrl}
        alt={photo.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 truncate">{photo.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{photo.description}</p>

        {/* Display selected user's profile */}
        {selectedUser && (
          <div className="flex items-center space-x-2 mt-2">
            <Avatar src={`https://www.gravatar.com/avatar/${selectedUser.email}`} />
            <span>{selectedUser.name}</span>
            <Button
              type="link"
              className="text-blue-500"
            >
              Edit Profile
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PhotoCard;
