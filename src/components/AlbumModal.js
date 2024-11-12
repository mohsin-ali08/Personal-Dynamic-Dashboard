// AlbumModal.js
import { useState } from "react";
import { Modal, Input, Form, Button } from "antd";
import { db } from "../config/firebaseConfig";  // Ensure this imports correctly
import { collection, addDoc } from "firebase/firestore";

function AlbumModal({ onClose }) {
  const [form] = Form.useForm();  // Ant Design form hook
  const [isLoading, setIsLoading] = useState(false);  // Loading state for submit button

  // Handle form submission and add album to Firestore
  const handleSubmit = async (values) => {
    setIsLoading(true);  // Set loading state to true during submit
    try {
      // Add a new document to the 'albums' collection in Firestore
      await addDoc(collection(db, "albums"), {
        title: values.title,          // Album title
        description: values.description,  // Album description
        coverImage: values.coverImage,    // Cover image URL
      });

      form.resetFields();  // Reset the form fields after successful submit
      onClose();  // Close the modal
    } catch (error) {
      console.error("Error adding album: ", error);  // Log any errors
    } finally {
      setIsLoading(false);  // Set loading state back to false
    }
  };

  return (
    <Modal
      title="Add New Album"
      visible  // Modal will always be visible
      onCancel={onClose}  // Close modal on cancel
      footer={null}  // Remove default footer buttons
      centered  // Center the modal on the screen
      className="p-6 rounded-lg"
    >
      <Form
        form={form}
        layout="vertical"  // Vertical layout for form fields
        onFinish={handleSubmit}  // Trigger handleSubmit on form submit
        className="space-y-4"
      >
        <Form.Item
          name="title"
          label="Album Title"
          rules={[{ required: true, message: "Please enter the album title" }]}  // Title is required
        >
          <Input className="p-2" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter a description" }]}  // Description is required
        >
          <Input.TextArea rows={3} className="p-2" />
        </Form.Item>

        <Form.Item
          name="coverImage"
          label="Cover Image URL"
          rules={[{ required: true, message: "Please enter a cover image URL" }]}  // Cover image URL is required
        >
          <Input className="p-2" />
        </Form.Item>

        <div className="flex justify-end space-x-2">
          {/* Cancel Button */}
          <Button
            onClick={onClose}
            className="text-green-600 border-green-600 hover:text-white hover:bg-green-600"
          >
            Cancel
          </Button>

          {/* Submit Button */}
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}  // Display loading spinner while submitting
            className="bg-green-600 border-none hover:bg-green-700"
          >
            Add Album
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default AlbumModal;
