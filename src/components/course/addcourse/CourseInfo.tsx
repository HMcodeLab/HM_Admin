"use client";

import React, { useState, ChangeEvent } from "react";

import { CourseInfoProps } from "@/types";
import InputBox from "./InputBox";

const CourseInfo: React.FC<CourseInfoProps> = ({
  courseDetails,
  setCourseDetails,
}) => {
  const [categories, setCategories] = useState<Record<string, string[]>>({
    "Web Development": ["Front-End Development", "Back-End Development"],
    "Mobile App Development": ["Cross-Platform Development"],
    "Cloud Computing": ["AWS Architecture"],
    Cybersecurity: ["Ethical Hacking"],
    "Data Science": ["Statistical Analysis", "Deep Learning"],
    "Artificial Intelligence": ["Python Libraries"],
    "Digital Marketing": ["SEO & Web Analytics"],
    "Financial Marketing": ["Finance Sector Marketing"],
    "Career Development": ["Job Application Skills", "Networking"],
    "Personal Development": ["Mindset", "Personal Branding"],
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState<string>("");
  const [newSubcategory, setNewSubcategory] = useState<string>("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCourseDetails((prev) => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewCategory(value);
    setSelectedCategory(value);
    setCourseDetails((prev) => ({ ...prev, category: value }));

    if (categories[value]) {
      setSubcategories(categories[value]);
    } else {
      setSubcategories([]);
    }
  };

  const handleSubcategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewSubcategory(value);
    setCourseDetails((prev) => ({ ...prev, subcategory: value }));
  };

  const addCategory = () => {
    if (newCategory && !categories[newCategory]) {
      setCategories((prev) => ({
        ...prev,
        [newCategory]: [],
      }));
      setCourseDetails((prev) => ({
        ...prev,
        category: newCategory,
        subcategory: "",
      }));
      setNewCategory("");
    }
  };

  const addSubcategory = () => {
    if (
      newSubcategory &&
      selectedCategory &&
      !categories[selectedCategory]?.includes(newSubcategory)
    ) {
      setCategories((prev) => ({
        ...prev,
        [selectedCategory]: [...prev[selectedCategory], newSubcategory],
      }));
      setCourseDetails((prev) => ({ ...prev, subcategory: newSubcategory }));
      setNewSubcategory("");
    }
  };

  return (
    <fieldset className="flex flex-col gap-6 px-4 py-6 md:px-[5%]">
      <h1 className="font-Montserrat text-2xl font-semibold text-green-700 md:text-3xl">
        Course Details
      </h1>

      <div className="grid grid-cols-1 gap-6 rounded-md border p-6 shadow-md sm:grid-cols-2">
        <InputBox
          label="Course ID"
          type="text"
          placeholder="Course ID"
          name="courseID"
          value={courseDetails.courseID}
          onChange={handleInputChange}
        />

        <InputBox
          label="Title"
          type="text"
          placeholder="Title"
          name="title"
          value={courseDetails.title}
          onChange={handleInputChange}
        />

        {/* Category */}
        <div className="flex flex-col gap-1">
          <label htmlFor="category" className="font-semibold text-gray-700">
            Category
          </label>
          <input
            type="text"
            id="category"
            placeholder="Type or select a Category"
            value={courseDetails.category || newCategory}
            onChange={handleCategoryChange}
            onBlur={addCategory}
            onKeyDown={(e) => e.key === "Enter" && addCategory()}
            list="category-list"
            className="rounded-md border p-2"
          />
          <datalist id="category-list">
            {Object.keys(categories).map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
        </div>

        {/* Subcategory */}
        <div className="flex flex-col gap-1">
          <label htmlFor="subcategory" className="font-semibold text-gray-700">
            Subcategory
          </label>
          <input
            type="text"
            id="subcategory"
            placeholder="Type or select a Subcategory"
            value={courseDetails.subcategory || newSubcategory}
            onChange={handleSubcategoryChange}
            onBlur={addSubcategory}
            onKeyDown={(e) => e.key === "Enter" && addSubcategory()}
            list="subcategory-list"
            className="rounded-md border p-2"
          />
          <datalist id="subcategory-list">
            {subcategories.map((sub) => (
              <option key={sub} value={sub} />
            ))}
          </datalist>
        </div>

        <InputBox
          label="Course Start Date"
          name="courseStartDate"
          type="datetime-local"
          placeholder="Start Date"
          value={formatDate(courseDetails.courseStartDate)}
          onChange={handleInputChange}
        />

        <InputBox
          label="Duration (weeks)"
          name="duration"
          type="number"
          placeholder="Duration"
          value={courseDetails.duration}
          onChange={handleInputChange}
        />
      </div>
    </fieldset>
  );
};

export default CourseInfo;
