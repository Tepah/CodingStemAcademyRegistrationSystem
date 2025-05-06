import { Layout } from "@/app/layout";
import React, { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { AssignmentForm } from "@/components/forms/assignment/form";

export default function CreateAssignment() {
  const router = useRouter();
  const { class_id } = router.query;


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(`${config.backendUrl}/assignments`, {
        ...formData,
        class_id, // Include the class_id in the request
      });
      router.push(`/classes/${class_id}/assignments`); // Redirect to the assignments page
    } catch (err) {
      console.error("Error creating assignment:", err);
      setError("Failed to create assignment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Create Assignment">
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Create Assignment</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <AssignmentForm class_id={class_id} />
      </div>
    </Layout>
  );
}