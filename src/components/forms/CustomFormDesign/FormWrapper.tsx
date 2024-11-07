import { z } from "zod"
import DynamicForm, { FieldDefinition } from "./DynamicForm"

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  age: z.number().min(18, "You must be at least 18 years old."),
  terms: z.boolean().refine((value) => value === true, "You must accept the terms and conditions."),
  role: z.enum(["user", "admin", "moderator"], {
    required_error: "Please select a role.",
  }),
  bio: z.string().optional(),
  profilePicture: z.any().optional(),
})

const fields: FieldDefinition[] = [
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    placeholder: "Enter your first name",
    customStyles: {
      wrapper: "mb-4",
      label: "text-sm font-medium text-gray-700",
      input: "mt-1",
    },
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    placeholder: "Enter your last name",
    customStyles: {
      wrapper: "mb-4",
      label: "text-sm font-medium text-gray-700",
      input: "mt-1",
    },
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    customStyles: {
      wrapper: "mb-4",
      label: "text-sm font-medium text-gray-700",
      input: "mt-1",
    },
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    customStyles: {
      wrapper: "mb-4",
      label: "text-sm font-medium text-gray-700",
      input: "mt-1",
    },
  },
  {
    name: "age",
    label: "Age",
    type: "number",
    placeholder: "Enter your age",
    customStyles: {
      wrapper: "mb-4",
      label: "text-sm font-medium text-gray-700",
      input: "mt-1",
    },
  },
  {
    name: "terms",
    label: "I accept the terms and conditions",
    type: "checkbox",
    customStyles: {
      wrapper: "mb-4",
    },
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    options: [
      { label: "User", value: "user" },
      { label: "Admin", value: "admin" },
      { label: "Moderator", value: "moderator" },
    ],
    customStyles: {
      wrapper: "mb-4",
      label: "text-sm font-medium text-gray-700",
      input: "mt-1",
    },
  },
  {
    name: "bio",
    label: "Bio",
    type: "textarea",
    placeholder: "Tell us about yourself",
    customStyles: {
      wrapper: "mb-4",
      label: "text-sm font-medium text-gray-700",
      input: "mt-1",
    },
  },
  {
    name: "profilePicture",
    label: "Profile Picture",
    type: "image",
    description: "Upload a profile picture",
    customStyles: {
      wrapper: "mb-4",
      label: "text-sm font-medium text-gray-700",
    },
  },
]

const layout = [
  {
    fields: ["firstName", "lastName"],
    customStyles: {
      wrapper: "mb-4",
      fieldsWrapper: "grid grid-cols-2 gap-4",
    },
  },
  {
    fields: ["email", "password", "age"],
    customStyles: {
      wrapper: "mb-4",

      fieldsWrapper: "grid grid-cols-3 gap-4",
    },
  },
  {
    fields: ["terms", "role"],
    customStyles: {
      wrapper: "mb-4",
      fieldsWrapper: "grid grid-cols-2 gap-4",
    },
  },
  {
    fields: ["bio", "profilePicture"],
    customStyles: {
      wrapper: "mb-4",
      fieldsWrapper: "grid grid-cols-1 gap-4",
    },
  },
]

const customStyles = {
  form: "max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md",
  submitButton: "w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded",
}

export default function FormWrapper() {
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    "use server"
    // Handle form submission on the server
    console.log(data)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Dynamic Form Example</h1>
      <DynamicForm
        schema={formSchema}
        fields={fields}
        layout={layout}
        onSubmit={onSubmit}
        customStyles={customStyles}
      />
    </div>
  )
}
