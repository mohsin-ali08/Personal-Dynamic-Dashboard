import { useState } from "react";
import { Input, Button, Form, notification } from "antd";
import BAScreenHeader from "../components/BAScreenHeader";
import apiInstance from "../config/apis/axiosconfig";

export default function UsersForm() {
  const [form] = Form.useForm();
  const [saveLoader, setSaveLoader] = useState(false);

  const openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
      placement: "topRight",
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      setSaveLoader(true);
      
      await apiInstance.post("users", values);
      setSaveLoader(false);

      openNotification("success", "User Saved", "User data has been saved successfully.");
      form.resetFields();
    } catch (error) {
      setSaveLoader(false);
      openNotification("error", "Save Failed", "An error occurred while saving the user data.");
      console.error("Error saving user:", error);
    }
  };

  return (
    <>
      <div className="md:p-2 pt-20">
        <BAScreenHeader
          title="Users Form"
          showBackButton={true}  // Show the back button
          actionButtons={[
            {
              display: () => (
                <Button type="none" className="px-5 py-2 bg-green-600 text-white  hover:bg-gray-800" onClick={save} loading={saveLoader}>
                  Save
                </Button>
              ),
            },
          ]}
        />
      </div>
      <div className="flex justify-center items-center">
        <div className="w-full max-w-md">
          <Form
            form={form}
            className="px-6 py-4 bg-gray-100 shadow-md rounded-lg"
            layout="vertical"
            style={{ width: "100%" }}
          >
            <Form.Item
              label="Name :"
              name="name"
              rules={[
                { 
                  validator: (_, value) =>
                    value && value.trim().length >= 3
                      ? Promise.resolve()
                      : Promise.reject("Name must be at least 3 characters."),
                },
              ]}
            >
              <Input placeholder="Enter name" />
            </Form.Item>
            <Form.Item
              label="Email :"
              name="email"
              rules={[
                { 
                  validator: (_, value) =>
                    value && /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)
                      ? Promise.resolve()
                      : Promise.reject("Please enter a valid email address."),
                },
              ]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>
            <Form.Item
              label="Phone :"
              name="phone"
              rules={[
                { 
                  validator: (_, value) =>
                    value && /^\d{10,15}$/.test(value)
                      ? Promise.resolve()
                      : Promise.reject("Phone number should be 10 to 15 digits."),
                },
              ]}
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>
            <Form.Item
              label="Website :"
              name="website"
              rules={[
                { 
                  validator: (_, value) =>
                    value && /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,7}(\/[\w-]*)*$/.test(value)
                      ? Promise.resolve()
                      : Promise.reject("Please enter a valid URL."),
                },
              ]}
            >
              <Input placeholder="Enter website" />
            </Form.Item>
            <Form.Item>
              <Button type="none" className="px-5 py-2 bg-green-600 text-white  hover:bg-gray-800" onClick={save} loading={saveLoader}>
                Save
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
}
