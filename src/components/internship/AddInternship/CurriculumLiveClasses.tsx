"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaVideo,
  FaFileAlt,
  FaTasks,
  FaUpload,
} from "react-icons/fa";
import { FiPlusCircle, FiTrash2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { CurriculumLiveClassesProps, Lesson } from "@/types";
import { FaFileUpload, FaPlusCircle } from "react-icons/fa";
import ImageCoursesModal from "@/utils/ImageCoursesModal";
import VideoCourseModal from "@/utils/VideoCourseModal";
import PdfCoursesModal from "@/utils/PdfCoursesModal";

const CurriculumLiveClasses: React.FC<CurriculumLiveClassesProps> = ({
  courseDetails,
  setCourseDetails,
  uploadedMedia,
}) => {
  const [selectedMediaFromModal, setSelectedMediaFromModal] = useState("");
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number | null>(
    null,
  );
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number | null>(
    null,
  );
  const [selectedMediaType, setSelectedMediaType] = useState("");
  const [isModalImageOpen, setIsModalImageOpen] = useState(false);
  const [isModalVideoOpen, setIsModalVideoOpen] = useState(false);
  const [isModalPdfOpen, setIsModalPdfOpen] = useState(false);
  const [selectedModal, setSelectedModal] = useState("");
  const [index, setIndex] = useState("");

  // Open/close modals
  const openModal = (
    type: string,
    chapterIndex: number,
    lessonIndex: number,
  ) => {
    setCurrentChapterIndex(chapterIndex);
    setCurrentLessonIndex(lessonIndex);
    setSelectedModal(type);

    if (type === "video") {
      setIsModalVideoOpen(true);
      setSelectedMediaType("video");
    } else if (type === "notes") {
      setIsModalPdfOpen(true);
      setSelectedMediaType("notes");
    } else if (type === "assignment") {
      setIsModalPdfOpen(true);
      setSelectedMediaType("assignment");
    }
  };

  const closeModal = () => {
    setIsModalVideoOpen(false);
    setIsModalPdfOpen(false);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    {
      moduleIndex,
      chapterIndex,
      lessonIndex,
      projectIndex,
      field,
    }: {
      moduleIndex?: number;
      chapterIndex?: number;
      lessonIndex?: number;
      projectIndex?: number;
      field: string;
    },
  ) => {
    const { value } = event.target;
    const updatedCurriculum = [...courseDetails.curriculum];

    if (moduleIndex === undefined) return;

    if (field === "unitName") {
      updatedCurriculum[moduleIndex].unitName = value;
    }

    if (field === "chapter_name" && chapterIndex !== undefined) {
      updatedCurriculum[moduleIndex].chapters[chapterIndex].chapter_name =
        value;
    }

    if (
      field.startsWith("lesson_") &&
      chapterIndex !== undefined &&
      lessonIndex !== undefined
    ) {
      const lessonField = field.replace("lesson_", "") as string;

      if (lessonField === "isLiveClass") {
        updatedCurriculum[moduleIndex].chapters[chapterIndex].lessons[
          lessonIndex
        ][lessonField as keyof Lesson] = value === "true";
      } else {
        (
          updatedCurriculum[moduleIndex].chapters[chapterIndex].lessons[
            lessonIndex
          ] as any
        )[lessonField] = value;
      }
    }

    if (
      field.startsWith("liveClass_") &&
      chapterIndex !== undefined &&
      lessonIndex !== undefined
    ) {
      const liveClassField = field.replace("liveClass_", "") as string;
      (
        updatedCurriculum[moduleIndex].chapters[chapterIndex].lessons[
          lessonIndex
        ].liveClass as any
      )[liveClassField] = value;
    }

    if (field.startsWith("project_") && projectIndex !== undefined) {
      const projectField = field.replace("project_", "") as string;
      (updatedCurriculum[moduleIndex].project[projectIndex] as any)[
        projectField
      ] = value;
    }

    setCourseDetails({
      ...courseDetails,
      curriculum: updatedCurriculum,
    });
  };

  // Handle media selection from modal
  const handleVideoChange = useCallback(
    (chapterIndex: number | null, lessonIndex: number | null, url: string) => {
      if (chapterIndex === null || lessonIndex === null) return;

      const updatedCurriculum = [...courseDetails.curriculum];
      updatedCurriculum.forEach((module, modIndex) => {
        if (module.chapters[chapterIndex]) {
          module.chapters[chapterIndex].lessons[lessonIndex].video = url;
        }
      });

      setCourseDetails({
        ...courseDetails,
        curriculum: updatedCurriculum,
      });
    },
    [courseDetails, setCourseDetails],
  );
  const handleNotesChange = useCallback(
    (chapterIndex: number | null, lessonIndex: number | null, url: string) => {
      if (chapterIndex === null || lessonIndex === null) return;

      const updatedCurriculum = [...courseDetails.curriculum];
      updatedCurriculum.forEach((module, modIndex) => {
        if (module.chapters[chapterIndex]) {
          module.chapters[chapterIndex].lessons[lessonIndex].notes = url;
        }
      });

      setCourseDetails({
        ...courseDetails,
        curriculum: updatedCurriculum,
      });
    },
    [courseDetails, setCourseDetails],
  );

  const handleAssignmentChange = useCallback(
    (chapterIndex: number | null, lessonIndex: number | null, url: string) => {
      if (chapterIndex === null || lessonIndex === null) return;

      const updatedCurriculum = [...courseDetails.curriculum];
      updatedCurriculum.forEach((module, modIndex) => {
        if (module.chapters[chapterIndex]) {
          module.chapters[chapterIndex].lessons[lessonIndex].assignment = url;
        }
      });

      setCourseDetails({
        ...courseDetails,
        curriculum: updatedCurriculum,
      });
    },
    [courseDetails, setCourseDetails],
  );

  // const handleAssignmentChange = (
  //   chapterIndex: number | null,
  //   lessonIndex: number | null,
  //   url: string,
  // ) => {
  //   if (chapterIndex === null || lessonIndex === null) return;

  //   const updatedCurriculum = [...courseDetails.curriculum];
  //   updatedCurriculum.forEach((module, modIndex) => {
  //     if (module.chapters[chapterIndex]) {
  //       module.chapters[chapterIndex].lessons[lessonIndex].assignment = url;
  //     }
  //   });

  //   setCourseDetails({
  //     ...courseDetails,
  //     curriculum: updatedCurriculum,
  //   });
  // };

  useEffect(() => {
    if (
      selectedMediaFromModal &&
      selectedMediaType &&
      currentChapterIndex !== null &&
      currentLessonIndex !== null
    ) {
      if (selectedMediaType === "video") {
        handleVideoChange(
          currentChapterIndex,
          currentLessonIndex,
          selectedMediaFromModal,
        );
      } else if (selectedMediaType === "notes") {
        handleNotesChange(
          currentChapterIndex,
          currentLessonIndex,
          selectedMediaFromModal,
        );
      } else if (selectedMediaType === "assignment") {
        handleAssignmentChange(
          currentChapterIndex,
          currentLessonIndex,
          selectedMediaFromModal,
        );
      }
    }
    // Clear selected media and type after handling
    setSelectedMediaFromModal("");
    setSelectedMediaType("");
  }, [
    selectedMediaFromModal,
    selectedMediaType,
    currentChapterIndex,
    currentLessonIndex,
    handleVideoChange,
    handleNotesChange,
    handleAssignmentChange,
  ]);

  // Add new module
  const addModule = () => {
    setCourseDetails({
      ...courseDetails,
      curriculum: [
        ...courseDetails.curriculum,
        {
          unitName: "",
          chapters: [
            {
              chapter_name: "",
              lessons: [
                {
                  lesson_name: "",
                  duration: "",
                  video: "",
                  notes: "",
                  notesName: "",
                  assignment: "",
                  assignmentName: "",
                  isLiveClass: false,
                  liveClass: {
                    streamKey: "",
                    startDate: "",
                    endDate: "",
                  },
                },
              ],
            },
          ],
          project: [
            {
              title: "",
              startDate: "",
              endDate: "",
              projectInfoPdf: "",
              duration: "",
            },
          ],
        },
      ],
    });
  };

  // Add new chapter to a specific module
  const addChapter = (moduleIndex: number) => {
    const updatedCurriculum = [...courseDetails.curriculum];
    updatedCurriculum[moduleIndex]?.chapters?.push({
      chapter_name: "",
      lessons: [
        {
          lesson_name: "",
          duration: "",
          video: "",
          notes: "",
          notesName: "",
          assignment: "",
          assignmentName: "",
          isLiveClass: false,
          liveClass: {
            streamKey: "",
            startDate: "",
            endDate: "",
          },
        },
      ],
    });
    setCourseDetails({ ...courseDetails, curriculum: updatedCurriculum });
  };

  // Add new lesson to a specific chapter
  const addLesson = (
    moduleIndex: number,
    chapterIndex: number,
    lessonIndex: number,
  ) => {
    const updatedCurriculum = [...courseDetails.curriculum];

    const newLesson = {
      lesson_name: "",
      duration: "",
      video: "",
      notes: "",
      notesName: "",
      assignment: "",
      assignmentName: "",
      isLiveClass: false,
      liveClass: {
        streamKey: "",
        startDate: "",
        endDate: "",
      },
    };

    updatedCurriculum[moduleIndex].chapters[chapterIndex].lessons.splice(
      lessonIndex + 1,
      0,
      newLesson,
    );

    setCourseDetails({ ...courseDetails, curriculum: updatedCurriculum });
  };

  // Add new project to a specific module
  const addProject = (moduleIndex: number) => {
    const updatedCurriculum = courseDetails.curriculum.map((module, index) => {
      if (index === moduleIndex) {
        return {
          ...module,
          project: [
            ...(module.project || []),
            {
              title: "",
              duration: "",
              startDate: "",
              endDate: "",
              projectInfoPdf: "",
            },
          ],
        };
      }
      return module;
    });

    setCourseDetails({ ...courseDetails, curriculum: updatedCurriculum });
  };

  // Remove Module
  const removeModule = (moduleIndex: number) => {
    const updatedCurriculum = [...courseDetails.curriculum];
    updatedCurriculum.splice(moduleIndex, 1);
    setCourseDetails({ ...courseDetails, curriculum: updatedCurriculum });
  };

  // Remove Chapter
  const removeChapter = (moduleIndex: number, chapterIndex: number) => {
    const updatedCurriculum = [...courseDetails.curriculum];
    updatedCurriculum[moduleIndex].chapters.splice(chapterIndex, 1);
    setCourseDetails({ ...courseDetails, curriculum: updatedCurriculum });
  };

  // Remove Lesson
  const removeLesson = (
    moduleIndex: number,
    chapterIndex: number,
    lessonIndex: number,
  ) => {
    const updatedCurriculum = [...courseDetails.curriculum];
    updatedCurriculum[moduleIndex].chapters[chapterIndex].lessons.splice(
      lessonIndex,
      1,
    );
    setCourseDetails({ ...courseDetails, curriculum: updatedCurriculum });
  };

  // Remove Project
  const removeProject = (moduleIndex: number, projectIndex: number) => {
    const updatedCurriculum = [...courseDetails.curriculum];
    updatedCurriculum[moduleIndex].project.splice(projectIndex, 1);
    setCourseDetails({ ...courseDetails, curriculum: updatedCurriculum });
  };

  // format date
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
    exit: { y: -20, opacity: 0 },
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      {isModalImageOpen && (
        <ImageCoursesModal
          isModalImageOpen={isModalImageOpen}
          setIsModalImageOpen={setIsModalImageOpen}
          courseDetails={courseDetails}
          setCourseDetails={setCourseDetails}
          type={selectedModal}
          uploadedMedia={uploadedMedia}
          setSelectedMediaFromModal={setSelectedMediaFromModal}
        />
      )}
      {isModalVideoOpen && (
        <VideoCourseModal
          isModalVideoOpen={isModalVideoOpen}
          setIsModalVideoOpen={setIsModalVideoOpen}
          courseDetails={courseDetails}
          setCourseDetails={setCourseDetails}
          type={selectedModal}
          uploadedMedia={uploadedMedia}
          setSelectedMediaFromModal={setSelectedMediaFromModal}
        />
      )}
      {isModalPdfOpen && (
        <PdfCoursesModal
          isModalPdfOpen={isModalPdfOpen}
          setIsModalPdfOpen={setIsModalPdfOpen}
          courseDetails={courseDetails}
          setCourseDetails={setCourseDetails}
          type={selectedModal}
          uploadedMedia={uploadedMedia}
          setSelectedMediaFromModal={setSelectedMediaFromModal}
        />
      )}
      <motion.h1
        className="font-Montserrat text-3xl font-semibold text-green-600 dark:text-green-300"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Curriculum & Live Classes
      </motion.h1>

      <motion.div
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <AnimatePresence>
          <motion.div
            className="flex max-h-[calc(100vh-200px)] flex-col gap-6 overflow-y-auto scroll-smooth pr-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {courseDetails?.curriculum?.map((module, moduleIndex) => (
              <motion.div
                key={moduleIndex}
                variants={itemVariants}
                className="rounded-lg bg-gray-50 p-4 shadow-sm dark:bg-gray-700/30"
              >
                <div className="flex flex-col gap-4">
                  {/* Module Header */}
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Unit Name"
                      value={module.unitName}
                      onChange={(e) =>
                        handleInputChange(e, {
                          moduleIndex,
                          field: "unitName",
                        })
                      }
                      className="flex-1 rounded-lg border border-gray-300 bg-white p-3 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => addModule()}
                        className="p-2 text-green-600 transition-colors hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                        title="Add new unit"
                      >
                        <FaPlus size={18} />
                      </button>
                      <button
                        onClick={() => removeModule(moduleIndex)}
                        className="p-2 text-red-600 transition-colors hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete module"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 rounded-lg bg-blue-100 px-4 py-2 text-blue-700 transition-colors hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-800"
                      onClick={() => addChapter(moduleIndex)}
                    >
                      <FiPlusCircle size={18} />
                      <span>Add Chapter</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 rounded-lg bg-purple-100 px-4 py-2 text-purple-700 transition-colors hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:hover:bg-purple-800"
                      onClick={() => addProject(moduleIndex)}
                    >
                      <FiPlusCircle size={18} />
                      <span>Add Project</span>
                    </motion.button>
                  </div>

                  {/* Chapters */}
                  <div className="ml-4 grid grid-cols-1 gap-4 border-l-2 border-gray-200 pl-4 dark:border-gray-600">
                    <AnimatePresence>
                      {module?.chapters?.map((chapter, chapterIndex) => (
                        <motion.div
                          key={chapterIndex}
                          variants={itemVariants}
                          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                        >
                          <div className="flex flex-col gap-4">
                            {/* Chapter Header */}
                            <div className="flex items-center gap-3">
                              <input
                                type="text"
                                placeholder="Chapter Name"
                                value={chapter.chapter_name}
                                onChange={(e) =>
                                  handleInputChange(e, {
                                    moduleIndex,
                                    chapterIndex,
                                    field: "chapter_name",
                                  })
                                }
                                className="flex-1 rounded-lg border border-gray-300 bg-white p-3 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => addChapter(moduleIndex)}
                                  className="p-2 text-green-600 transition-colors hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                                  title="Add chapter"
                                >
                                  <FaPlus size={18} />
                                </button>
                                <button
                                  onClick={() =>
                                    removeChapter(moduleIndex, chapterIndex)
                                  }
                                  className="p-2 text-red-600 transition-colors hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                  title="Delete chapter"
                                >
                                  <FaTrash size={18} />
                                </button>
                              </div>
                            </div>

                            {/* Lessons */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <AnimatePresence>
                                {chapter?.lessons?.map(
                                  (lesson, lessonIndex) => (
                                    <motion.div
                                      key={lessonIndex}
                                      variants={itemVariants}
                                      className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700/30"
                                    >
                                      <div className="flex flex-col gap-3">
                                        {/* Lesson Type Selection */}
                                        <div className="mb-2 flex flex-wrap items-center gap-4">
                                          <label className="flex cursor-pointer items-center gap-2">
                                            <input
                                              type="radio"
                                              name={`isLiveClass-${moduleIndex}-${chapterIndex}-${lessonIndex}`}
                                              value="true"
                                              checked={
                                                lesson.isLiveClass === true
                                              }
                                              onChange={(e) =>
                                                handleInputChange(e, {
                                                  moduleIndex,
                                                  chapterIndex,
                                                  lessonIndex,
                                                  field: "lesson_isLiveClass",
                                                })
                                              }
                                              className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                                            />
                                            <span className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                              <FaVideo /> Live Class
                                            </span>
                                          </label>
                                          <label className="flex cursor-pointer items-center gap-2">
                                            <input
                                              type="radio"
                                              name={`isLiveClass-${moduleIndex}-${chapterIndex}-${lessonIndex}`}
                                              value="false"
                                              checked={
                                                lesson.isLiveClass === false
                                              }
                                              onChange={(e) =>
                                                handleInputChange(e, {
                                                  moduleIndex,
                                                  chapterIndex,
                                                  lessonIndex,
                                                  field: "lesson_isLiveClass",
                                                })
                                              }
                                              className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                                            />
                                            <span className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                              <FaFileAlt /> Regular Lesson
                                            </span>
                                          </label>
                                        </div>

                                        {/* Lesson Content */}
                                        <div className="flex flex-col gap-3">
                                          <div className="flex items-center gap-2">
                                            <input
                                              type="text"
                                              placeholder="Lesson Name"
                                              value={lesson.lesson_name}
                                              onChange={(e) =>
                                                handleInputChange(e, {
                                                  moduleIndex,
                                                  chapterIndex,
                                                  lessonIndex,
                                                  field: "lesson_name",
                                                })
                                              }
                                              className="flex-1 rounded border border-gray-300 bg-white p-2 transition-all focus:border-transparent focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                                            />
                                            <div className="flex gap-1">
                                              <button
                                                onClick={() =>
                                                  addLesson(
                                                    moduleIndex,
                                                    chapterIndex,
                                                    lessonIndex,
                                                  )
                                                }
                                                className="p-1.5 text-green-600 transition-colors hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                                                title="Add lesson"
                                              >
                                                <FiPlusCircle size={16} />
                                              </button>
                                              <button
                                                onClick={() =>
                                                  removeLesson(
                                                    moduleIndex,
                                                    chapterIndex,
                                                    lessonIndex,
                                                  )
                                                }
                                                className="p-1.5 text-red-600 transition-colors hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                                title="Delete lesson"
                                              >
                                                <FiTrash2 size={16} />
                                              </button>
                                            </div>
                                          </div>

                                          <input
                                            type="number"
                                            placeholder="Duration (minutes)"
                                            value={lesson.duration}
                                            onChange={(e) =>
                                              handleInputChange(e, {
                                                moduleIndex,
                                                chapterIndex,
                                                lessonIndex,
                                                field: "lesson_duration",
                                              })
                                            }
                                            className="rounded border border-gray-300 bg-white p-2 transition-all focus:border-transparent focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                                          />

                                          {/* Conditional Fields */}
                                          {lesson.isLiveClass ? (
                                            <div className="flex flex-col gap-2 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                                              <input
                                                type="url"
                                                placeholder="Streaming URL"
                                                value={
                                                  lesson.liveClass?.streamKey
                                                }
                                                onChange={(e) =>
                                                  handleInputChange(e, {
                                                    moduleIndex,
                                                    chapterIndex,
                                                    lessonIndex,
                                                    field:
                                                      "liveClass_streamKey",
                                                  })
                                                }
                                                className="rounded border border-blue-200 bg-white p-2 transition-all focus:border-transparent focus:ring-1 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800"
                                              />
                                              <input
                                                type="datetime-local"
                                                placeholder="Start Date"
                                                value={formatDate(
                                                  lesson.liveClass?.startDate,
                                                )}
                                                onChange={(e) =>
                                                  handleInputChange(e, {
                                                    moduleIndex,
                                                    chapterIndex,
                                                    lessonIndex,
                                                    field:
                                                      "liveClass_startDate",
                                                  })
                                                }
                                                className="rounded border border-blue-200 bg-white p-2 transition-all focus:border-transparent focus:ring-1 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800"
                                              />
                                              <input
                                                type="datetime-local"
                                                placeholder="End Date"
                                                value={formatDate(
                                                  lesson.liveClass?.endDate,
                                                )}
                                                onChange={(e) =>
                                                  handleInputChange(e, {
                                                    moduleIndex,
                                                    chapterIndex,
                                                    lessonIndex,
                                                    field: "liveClass_endDate",
                                                  })
                                                }
                                                className="rounded border border-blue-200 bg-white p-2 transition-all focus:border-transparent focus:ring-1 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800"
                                              />
                                            </div>
                                          ) : (
                                            <div className="flex items-center gap-2">
                                              <input
                                                type="text"
                                                placeholder="Video URL"
                                                value={lesson.video}
                                                onChange={(e) =>
                                                  handleInputChange(e, {
                                                    moduleIndex,
                                                    chapterIndex,
                                                    lessonIndex,
                                                    field: "lesson_video",
                                                  })
                                                }
                                                className="flex-1 rounded border border-gray-300 bg-white p-2 transition-all focus:border-transparent focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                                              />
                                              <button
                                                onClick={() =>
                                                  openModal(
                                                    "video",
                                                    chapterIndex,
                                                    lessonIndex,
                                                  )
                                                }
                                                className="p-2 text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                title="Upload video"
                                              >
                                                <FaUpload size={16} />
                                              </button>
                                            </div>
                                          )}

                                          {/* Notes and Assignment */}
                                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                            <div className="flex flex-col gap-1">
                                              <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                <FaFileAlt size={14} /> Notes
                                              </label>
                                              <input
                                                type="text"
                                                placeholder="Notes Name"
                                                value={lesson.notesName}
                                                onChange={(e) =>
                                                  handleInputChange(e, {
                                                    moduleIndex,
                                                    chapterIndex,
                                                    lessonIndex,
                                                    field: "lesson_notesName",
                                                  })
                                                }
                                                className="rounded border border-gray-300 bg-white p-2 transition-all focus:border-transparent focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                                              />
                                              <div className="flex items-center gap-2">
                                                <input
                                                  type="text"
                                                  placeholder="Notes URL"
                                                  value={lesson.notes}
                                                  onChange={(e) =>
                                                    handleInputChange(e, {
                                                      moduleIndex,
                                                      chapterIndex,
                                                      lessonIndex,
                                                      field: "lesson_notes",
                                                    })
                                                  }
                                                  className="flex-1 rounded border border-gray-300 bg-white p-2 transition-all focus:border-transparent focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                                                />
                                                <button
                                                  onClick={() =>
                                                    openModal(
                                                      "notes",
                                                      chapterIndex,
                                                      lessonIndex,
                                                    )
                                                  }
                                                  className="p-2 text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                  title="Upload notes"
                                                >
                                                  <FaUpload size={16} />
                                                </button>
                                              </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                              <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                <FaTasks size={14} /> Assignment
                                              </label>
                                              <input
                                                type="text"
                                                placeholder="Assignment Name"
                                                value={lesson.assignmentName}
                                                onChange={(e) =>
                                                  handleInputChange(e, {
                                                    moduleIndex,
                                                    chapterIndex,
                                                    lessonIndex,
                                                    field:
                                                      "lesson_assignmentName",
                                                  })
                                                }
                                                className="rounded border border-gray-300 bg-white p-2 transition-all focus:border-transparent focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                                              />
                                              <div className="flex items-center gap-2">
                                                <input
                                                  type="text"
                                                  placeholder="Assignment URL"
                                                  value={lesson.assignment}
                                                  onChange={(e) =>
                                                    handleInputChange(e, {
                                                      moduleIndex,
                                                      chapterIndex,
                                                      lessonIndex,
                                                      field:
                                                        "lesson_assignment",
                                                    })
                                                  }
                                                  className="flex-1 rounded border border-gray-300 bg-white p-2 transition-all focus:border-transparent focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                                                />
                                                <button
                                                  onClick={() =>
                                                    openModal(
                                                      "assignment",
                                                      chapterIndex,
                                                      lessonIndex,
                                                    )
                                                  }
                                                  className="p-2 text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                  title="Upload assignment"
                                                >
                                                  <FaUpload size={16} />
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </motion.div>
                                  ),
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Projects */}
                    <AnimatePresence>
                      {module?.project?.map((project, projectIndex) => (
                        <motion.div
                          key={projectIndex}
                          variants={itemVariants}
                          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                        >
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                              <div className="text-purple-600 dark:text-purple-400">
                                <FaTasks size={20} />
                              </div>
                              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                Project
                              </h3>
                              <div className="ml-auto flex gap-1">
                                <button
                                  onClick={() => addProject(moduleIndex)}
                                  className="p-1.5 text-green-600 transition-colors hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                                  title="Add project"
                                >
                                  <FiPlusCircle size={16} />
                                </button>
                                <button
                                  onClick={() =>
                                    removeProject(moduleIndex, projectIndex)
                                  }
                                  className="p-1.5 text-red-600 transition-colors hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                  title="Delete project"
                                >
                                  <FiTrash2 size={16} />
                                </button>
                              </div>
                            </div>

                            <div className="flex flex-col gap-3">
                              <textarea
                                placeholder="Project Title"
                                value={project.title}
                                onChange={(e) =>
                                  handleInputChange(e, {
                                    moduleIndex,
                                    projectIndex,
                                    field: "project_title",
                                  })
                                }
                                className="min-h-[80px] rounded border border-gray-300 bg-white p-2 transition-all focus:border-transparent focus:ring-1 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-800"
                              />

                              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                <input
                                  type="number"
                                  placeholder="Duration (minutes)"
                                  value={project.duration}
                                  onChange={(e) =>
                                    handleInputChange(e, {
                                      moduleIndex,
                                      projectIndex,
                                      field: "project_duration",
                                    })
                                  }
                                  className="rounded border border-gray-300 bg-white p-2 transition-all focus:border-transparent focus:ring-1 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-800"
                                />
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    placeholder="Project Info PDF URL"
                                    value={project.projectInfoPdf}
                                    onChange={(e) =>
                                      handleInputChange(e, {
                                        moduleIndex,
                                        projectIndex,
                                        field: "project_projectInfoPdf",
                                      })
                                    }
                                    className="flex-1 rounded border border-gray-300 bg-white p-2 transition-all focus:border-transparent focus:ring-1 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-800"
                                  />
                                  <button
                                    onClick={() => {
                                      setCurrentChapterIndex(null);
                                      setCurrentLessonIndex(null);
                                      setSelectedModal("projectPdf");
                                      setIsModalPdfOpen(true);
                                    }}
                                    className="p-2 text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                    title="Upload PDF"
                                  >
                                    <FaUpload size={16} />
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                <input
                                  type="datetime-local"
                                  placeholder="Start Date"
                                  value={formatDate(project.startDate)}
                                  onChange={(e) =>
                                    handleInputChange(e, {
                                      moduleIndex,
                                      projectIndex,
                                      field: "project_startDate",
                                    })
                                  }
                                  className="rounded border border-gray-300 bg-white p-2 transition-all focus:border-transparent focus:ring-1 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-800"
                                />
                                <input
                                  type="datetime-local"
                                  placeholder="End Date"
                                  value={formatDate(project.endDate)}
                                  onChange={(e) =>
                                    handleInputChange(e, {
                                      moduleIndex,
                                      projectIndex,
                                      field: "project_endDate",
                                    })
                                  }
                                  className="rounded border border-gray-300 bg-white p-2 transition-all focus:border-transparent focus:ring-1 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-800"
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CurriculumLiveClasses;
