"use client";

import React, { useCallback, useEffect, useState } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { RiUploadCloud2Line } from "react-icons/ri";
import { useTheme } from "next-themes";
import VideoCourseModal from "@/utils/VideoCourseModal";
import PdfCoursesModal from "@/utils/PdfCoursesModal";
import { CourseType } from "@/types";

interface LiveClass {
  startDate: string;
  endDate: string;
  meetingLink: string;
}

interface Lesson {
  lesson_name: string;
  video: string;
  notes: string;
  notesName: string;
  assignment: string;
  assignmentName: string;
  transcript: string;
  duration: string;
  isLiveClass: boolean;
  liveClass: LiveClass;
}

interface Project {
  title: string;
  projectInfoPdf: string;
  duration: number;
  startDate: string;
  endDate: string;
}

interface Chapter {
  chapter_name: string;
  lessons: Lesson[];
  project: Project[];
}

interface CurriculumLiveClassesProps {
  courseDetails: CourseType;
  setCourseDetails: React.Dispatch<React.SetStateAction<CourseType>>;
  uploadedMedia?: any;
  needToUpdate?: boolean;
}

const CurriculumLiveClasses: React.FC<CurriculumLiveClassesProps> = ({
  courseDetails,
  setCourseDetails,
  uploadedMedia,
  needToUpdate = false,
}) => {
  const { theme } = useTheme();
  const [selectedMediaFromModal, setSelectedMediaFromModal] = useState("");
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number | null>(
    null,
  );
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number | null>(
    null,
  );
  const [currentProjectIndex, setCurrentProjectIndex] = useState<number | null>(
    null,
  );
  const [selectedMediaType, setSelectedMediaType] = useState("");
  const [isModalVideoOpen, setIsModalVideoOpen] = useState(false);
  const [isModalPdfOpen, setIsModalPdfOpen] = useState(false);
  const [selectedModal, setSelectedModal] = useState("");

  // Modal handlers
  const openModal = (type: string) => {
    setSelectedModal(type);
    setIsModalVideoOpen(true);
  };

 const closeModal = useCallback(() => {
   setIsModalVideoOpen(false);
 }, []);

  const closePdfModal = useCallback(() => {
    setIsModalPdfOpen(false);
  }, []);
  const openPdfModal = (type: string) => {
    setSelectedModal(type);
    setIsModalPdfOpen(true);
  };




  // Input change handler
  // const handleInputChange = useCallback(
  //   (
  //     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  //     options: {
  //       chapterIndex: number;
  //       lessonIndex?: number;
  //       projectIndex?: number;
  //       field: string;
  //     },
  //   ) => {
  //     const { value } = e.target;
  //     const { chapterIndex, lessonIndex, projectIndex, field } = options;

  //     setCourseDetails((prev) => {
  //       const updatedCurriculum = [...prev.curriculum];

  //       if (lessonIndex !== undefined) {
  //         // Handle lesson fields
  //         const lesson = updatedCurriculum[chapterIndex].lessons[lessonIndex];
  //         if (!lesson) return prev;

  //         switch (field) {
  //           case "lesson_name":
  //             lesson.lesson_name = value;
  //             break;
  //           case "lesson_video":
  //             lesson.video = value;
  //             break;
  //           case "lesson_duration":
  //             lesson.duration = value;
  //             break;
  //           case "lesson_notesName":
  //             lesson.notesName = value;
  //             break;
  //           case "lesson_notesUrl":
  //             lesson.notes = value;
  //             break;
  //           case "lesson_assignmentName":
  //             lesson.assignmentName = value;
  //             break;
  //           case "lesson_assignmentUrl":
  //             lesson.assignment = value;
  //             break;
  //           case "lesson_transcript":
  //             lesson.transcript = value;
  //             break;
  //           case "lesson_liveClass_meetingLink":
  //             lesson.liveClass.meetingLink = value;
  //             break;
  //           case "lesson_liveClass_startDate":
  //             lesson.liveClass.startDate = value;
  //             break;
  //           case "lesson_liveClass_endDate":
  //             lesson.liveClass.endDate = value;
  //             break;
  //         }
  //       } else if (projectIndex !== undefined) {
  //         // Handle project fields
  //         const project = updatedCurriculum[chapterIndex].project[projectIndex];
  //         if (!project) return prev;

  //         switch (field) {
  //           case "project_title":
  //             project.title = value;
  //             break;
  //           case "project_startDate":
  //             project.startDate = value;
  //             break;
  //           case "project_duration":
  //             project.duration = Number(value);
  //             break;
  //           case "project_endDate":
  //             project.endDate = value;
  //             break;
  //           case "project_infoPdf":
  //             project.projectInfoPdf = value;
  //             break;
  //         }
  //       } else {
  //         // Handle chapter fields
  //         updatedCurriculum[chapterIndex].chapter_name = value;
  //       }

  //       return { ...prev, curriculum: updatedCurriculum };
  //     });
  //   },
  //   [setCourseDetails], // Only setCourseDetails is a dependency
  // );


  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      options: {
        chapterIndex: number;
        lessonIndex?: number;
        projectIndex?: number;
        field: string;
      },
    ) => {
      const { value } = e.target;
      const { chapterIndex, lessonIndex, projectIndex, field } = options;

      setCourseDetails((prev) => {
        if (!prev.curriculum[chapterIndex]) return prev;

        const updatedCurriculum = [...prev.curriculum];
        const updatedChapter = { ...updatedCurriculum[chapterIndex] };

        // Handle lesson fields
        if (typeof lessonIndex === "number") {
          if (!updatedChapter.lessons[lessonIndex]) return prev;

          const updatedLessons = [...updatedChapter.lessons];
          const updatedLesson = { ...updatedLessons[lessonIndex] };

          switch (field) {
            case "lesson_name":
              updatedLesson.lesson_name = value;
              break;
            case "lesson_video":
              updatedLesson.video = value;
              break;
            case "lesson_duration":
              updatedLesson.duration = value;
              break;
            case "lesson_notesName":
              updatedLesson.notesName = value;
              break;
            case "lesson_notesUrl":
              updatedLesson.notes = value;
              break;
            case "lesson_assignmentName":
              updatedLesson.assignmentName = value;
              break;
            case "lesson_assignmentUrl":
              updatedLesson.assignment = value;
              break;
            case "lesson_transcript":
              updatedLesson.transcript = value;
              break;
            case "lesson_liveClass_meetingLink":
              updatedLesson.liveClass = {
                ...updatedLesson.liveClass,
                meetingLink: value,
              };
              break;
            case "lesson_liveClass_startDate":
              updatedLesson.liveClass = {
                ...updatedLesson.liveClass,
                startDate: value,
              };
              break;
            case "lesson_liveClass_endDate":
              updatedLesson.liveClass = {
                ...updatedLesson.liveClass,
                endDate: value,
              };
              break;
            default:
              return prev;
          }

          updatedLessons[lessonIndex] = updatedLesson;
          updatedChapter.lessons = updatedLessons;
        }
        // Handle project fields
        else if (typeof projectIndex === "number") {
          if (!updatedChapter.project[projectIndex]) return prev;

          const updatedProjects = [...updatedChapter.project];
          const updatedProject = { ...updatedProjects[projectIndex] };

          switch (field) {
            case "project_title":
              updatedProject.title = value;
              break;
            case "project_startDate":
              updatedProject.startDate = value;
              break;
            case "project_duration":
              updatedProject.duration = Number(value);
              break;
            case "project_endDate":
              updatedProject.endDate = value;
              break;
            case "project_infoPdf":
              updatedProject.projectInfoPdf = value;
              break;
            default:
              return prev;
          }

          updatedProjects[projectIndex] = updatedProject;
          updatedChapter.project = updatedProjects;
        }
        // Handle chapter fields
        else {
          updatedChapter.chapter_name = value;
        }

        updatedCurriculum[chapterIndex] = updatedChapter;
        return { ...prev, curriculum: updatedCurriculum };
      });
    },
    [setCourseDetails],
  );



  // First useEffect - Handles media selection from modal
  useEffect(() => {
    if (
      !selectedMediaFromModal ||
      !selectedMediaType ||
      currentChapterIndex === null
    )
      return;

    const fieldMap: Record<string, string> = {
      video: "lesson_video",
      notes: "lesson_notesUrl",
      assignment: "lesson_assignmentUrl",
      project_infoPdf: "project_infoPdf",
    };

    const field = fieldMap[selectedMediaType];
    if (!field) return;

    if (currentLessonIndex !== null) {
      // For lessons
      handleInputChange(
        {
          target: { value: selectedMediaFromModal },
        } as React.ChangeEvent<HTMLInputElement>,
        {
          chapterIndex: currentChapterIndex,
          lessonIndex: currentLessonIndex,
          field,
        },
      );
    } else if (currentProjectIndex !== null) {
      // For projects
      handleInputChange(
        {
          target: { value: selectedMediaFromModal },
        } as React.ChangeEvent<HTMLInputElement>,
        {
          chapterIndex: currentChapterIndex,
          projectIndex: currentProjectIndex,
          field,
        },
      );
    }

    setSelectedMediaFromModal("");
    closeModal();
    closePdfModal();
  }, [
    selectedMediaFromModal,
    selectedMediaType,
    currentChapterIndex,
    currentLessonIndex,
    currentProjectIndex,
    handleInputChange,
    closeModal,
    closePdfModal,
  ]);

  // Second useEffect - Backup/alternative media handling with different conditions
  useEffect(() => {
    if (
      !selectedMediaFromModal ||
      !selectedMediaType ||
      currentChapterIndex === null ||
      (currentLessonIndex === null && currentProjectIndex === null)
    )
      return;

    // Different approach for handling media - could be used for special cases
    const handleSpecialMediaCase = () => {
      const fieldMap: Record<string, string> = {
        video: "lesson_video",
        notes: "lesson_notesUrl",
        assignment: "lesson_assignmentUrl",
        project_infoPdf: "project_infoPdf",
      };

      const field = fieldMap[selectedMediaType];
      if (!field) return;

      setCourseDetails((prev) => {
        const updatedCurriculum = [...prev.curriculum];

        if (currentLessonIndex !== null) {
          const lesson =
            updatedCurriculum[currentChapterIndex].lessons[currentLessonIndex];
          if (field === "lesson_video") lesson.video = selectedMediaFromModal;
          else if (field === "lesson_notesUrl")
            lesson.notes = selectedMediaFromModal;
          else if (field === "lesson_assignmentUrl")
            lesson.assignment = selectedMediaFromModal;
        } else if (currentProjectIndex !== null) {
          const project =
            updatedCurriculum[currentChapterIndex].project[currentProjectIndex];
          if (field === "project_infoPdf")
            project.projectInfoPdf = selectedMediaFromModal;
        }

        return { ...prev, curriculum: updatedCurriculum };
      });

      setSelectedMediaFromModal("");
      closeModal();
      closePdfModal();
    };

    // Only run this alternative handler for specific conditions
    if (
      selectedMediaType === "video" ||
      selectedMediaType === "project_infoPdf"
    ) {
      handleSpecialMediaCase();
    }
  }, [
    selectedMediaFromModal,
    selectedMediaType,
    currentChapterIndex,
    currentLessonIndex,
    currentProjectIndex,
    setCourseDetails,
    closeModal,
    closePdfModal,
  ]);
  // Chapter management
  const addChapter = (insertAfterIndex: number) => {
    setCourseDetails((prev) => {
      const newChapter: Chapter = {
        chapter_name: "",
        lessons: [createNewLesson()],
        project: [createNewProject()],
      };

      const updatedCurriculum = [...prev.curriculum];
      updatedCurriculum.splice(insertAfterIndex + 1, 0, newChapter);
      return { ...prev, curriculum: updatedCurriculum };
    });
  };

  const removeChapter = (chapterIndex: number) => {
    setCourseDetails((prev) => ({
      ...prev,
      curriculum: prev.curriculum.filter((_, i) => i !== chapterIndex),
    }));
  };

  // Lesson management
  const createNewLesson = (): Lesson => ({
    lesson_name: "",
    video: "",
    notes: "",
    notesName: "",
    assignment: "",
    assignmentName: "",
    transcript: "",
    duration: "30",
    isLiveClass: false,
    liveClass: {
      startDate: "",
      endDate: "",
      meetingLink: "",
    },
  });

  const addLesson = (chapterIndex: number, insertAfterIndex?: number) => {
    setCourseDetails((prev) => {
      const updatedCurriculum = [...prev.curriculum];
      const insertIndex =
        insertAfterIndex !== undefined
          ? insertAfterIndex + 1
          : updatedCurriculum[chapterIndex].lessons.length;
      updatedCurriculum[chapterIndex].lessons.splice(
        insertIndex,
        0,
        createNewLesson(),
      );
      return { ...prev, curriculum: updatedCurriculum };
    });
  };

  const removeLesson = (chapterIndex: number, lessonIndex: number) => {
    setCourseDetails((prev) => {
      const updatedCurriculum = [...prev.curriculum];
      updatedCurriculum[chapterIndex].lessons = updatedCurriculum[
        chapterIndex
      ].lessons.filter((_, i) => i !== lessonIndex);
      return { ...prev, curriculum: updatedCurriculum };
    });
  };

  const handleIsLiveClass = (
    chapterIndex: number,
    lessonIndex: number,
    isLive: boolean,
  ) => {
    setCourseDetails((prev) => {
      const updatedCurriculum = [...prev.curriculum];
      updatedCurriculum[chapterIndex].lessons[lessonIndex].isLiveClass = isLive;
      return { ...prev, curriculum: updatedCurriculum };
    });
  };

  // Project management
  const createNewProject = (): Project => ({
    title: "",
    projectInfoPdf: "",
    duration: 0,
    startDate: "",
    endDate: "",
  });

  const addProject = (chapterIndex: number, insertAfterIndex?: number) => {
    setCourseDetails((prev) => {
      const updatedCurriculum = [...prev.curriculum];
      const insertIndex =
        insertAfterIndex !== undefined
          ? insertAfterIndex + 1
          : updatedCurriculum[chapterIndex].project.length;
      updatedCurriculum[chapterIndex].project.splice(
        insertIndex,
        0,
        createNewProject(),
      );
      return { ...prev, curriculum: updatedCurriculum };
    });
  };

  const removeProject = (chapterIndex: number, projectIndex: number) => {
    setCourseDetails((prev) => {
      const updatedCurriculum = [...prev.curriculum];
      updatedCurriculum[chapterIndex].project = updatedCurriculum[
        chapterIndex
      ].project.filter((_, i) => i !== projectIndex);
      return { ...prev, curriculum: updatedCurriculum };
    });
  };

  // Helper functions
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  // Styling based on theme
  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-gray-800" : "bg-green-50";
  const cardBgColor = isDark ? "bg-gray-700" : "bg-white";
  const textColor = isDark ? "text-white" : "text-gray-800";
  const borderColor = isDark ? "border-gray-600" : "border-green-200";
  const inputClass = `w-full rounded-lg p-2 border ${borderColor} ${isDark ? "bg-gray-700 text-white" : "bg-white text-gray-800"}`;
  const buttonClass = `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isDark ? "bg-purple-600 hover:bg-purple-700" : "bg-green-500 hover:bg-green-600"} text-white`;
  const deleteButtonClass = `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-red-500 hover:bg-red-600 text-white`;

  return (
    <div className="h-screen space-y-6 overflow-y-auto p-6">
      {/* Modals */}
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

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-Montserrat mb-6 text-2xl font-semibold text-green-600 md:text-3xl">
          Curriculum & Live Classes
        </h2>
        <button
          onClick={() => addChapter(courseDetails.curriculum.length - 1)}
          className={buttonClass}
        >
          <FaPlus /> Add Chapter
        </button>
      </div>

      {/* Curriculum List */}
      <div className="space-y-6">
        {courseDetails.curriculum.map((chapter, chapterIndex) => (
          <div
            key={chapterIndex}
            className={`rounded-xl p-4 ${bgColor} shadow-md`}
          >
            {/* Chapter Header */}
            <div className="mb-4 flex items-center justify-between">
              <input
                type="text"
                placeholder="Chapter Name"
                value={chapter.chapter_name}
                onChange={(e) =>
                  handleInputChange(e, { chapterIndex, field: "chapter_name" })
                }
                className={`text-xl font-bold ${inputClass}`}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => addChapter(chapterIndex)}
                  className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
                >
                  <FaPlus />
                </button>
                <button
                  onClick={() => removeChapter(chapterIndex)}
                  className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            {/* Lessons and Projects */}
            <div className="space-y-4">
              {/* Lessons */}
              <div className="space-y-3">
                <h3 className={`text-lg font-semibold ${textColor}`}>
                  Lessons
                </h3>
                {chapter.lessons.map((lesson, lessonIndex) => (
                  <div
                    key={lessonIndex}
                    className={`rounded-lg p-4 ${cardBgColor} shadow-sm`}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className={`font-medium ${textColor}`}>
                        Lesson {lessonIndex + 1}
                      </h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => addLesson(chapterIndex, lessonIndex)}
                          className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
                        >
                          <FaPlus />
                        </button>
                        <button
                          onClick={() =>
                            removeLesson(chapterIndex, lessonIndex)
                          }
                          className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Lesson Name */}
                      <div>
                        <label className={`mb-1 block ${textColor}`}>
                          Lesson Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter lesson name"
                          value={lesson.lesson_name}
                          onChange={(e) =>
                            handleInputChange(e, {
                              chapterIndex,
                              lessonIndex,
                              field: "lesson_name",
                            })
                          }
                          className={inputClass}
                        />
                      </div>

                      {/* Duration */}
                      <div>
                        <label className={`mb-1 block ${textColor}`}>
                          Duration (minutes)
                        </label>
                        <input
                          type="number"
                          placeholder="Duration"
                          value={lesson.duration}
                          onChange={(e) =>
                            handleInputChange(e, {
                              chapterIndex,
                              lessonIndex,
                              field: "lesson_duration",
                            })
                          }
                          className={inputClass}
                        />
                      </div>

                      {/* Live Class Toggle */}
                      <div className="flex items-center gap-4">
                        <label
                          className={`flex items-center gap-2 ${textColor}`}
                        >
                          <input
                            type="radio"
                            checked={!lesson.isLiveClass}
                            onChange={() =>
                              handleIsLiveClass(
                                chapterIndex,
                                lessonIndex,
                                false,
                              )
                            }
                            className="h-4 w-4"
                          />
                          Recorded Lesson
                        </label>
                        <label
                          className={`flex items-center gap-2 ${textColor}`}
                        >
                          <input
                            type="radio"
                            checked={lesson.isLiveClass}
                            onChange={() =>
                              handleIsLiveClass(chapterIndex, lessonIndex, true)
                            }
                            className="h-4 w-4"
                          />
                          Live Class
                        </label>
                      </div>

                      {/* Content based on lesson type */}
                      {lesson.isLiveClass ? (
                        <div className="space-y-3">
                          <div>
                            <label className={`mb-1 block ${textColor}`}>
                              Start Date & Time
                            </label>
                            <input
                              type="datetime-local"
                              value={formatDate(lesson.liveClass.startDate)}
                              onChange={(e) =>
                                handleInputChange(e, {
                                  chapterIndex,
                                  lessonIndex,
                                  field: "lesson_liveClass_startDate",
                                })
                              }
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className={`mb-1 block ${textColor}`}>
                              End Date & Time
                            </label>
                            <input
                              type="datetime-local"
                              value={formatDate(lesson.liveClass.endDate)}
                              onChange={(e) =>
                                handleInputChange(e, {
                                  chapterIndex,
                                  lessonIndex,
                                  field: "lesson_liveClass_endDate",
                                })
                              }
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className={`mb-1 block ${textColor}`}>
                              Meeting Link
                            </label>
                            <input
                              type="text"
                              placeholder="Enter meeting link"
                              value={lesson.liveClass.meetingLink}
                              onChange={(e) =>
                                handleInputChange(e, {
                                  chapterIndex,
                                  lessonIndex,
                                  field: "lesson_liveClass_meetingLink",
                                })
                              }
                              className={inputClass}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div>
                            <label className={`mb-1 block ${textColor}`}>
                              Video URL
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Enter video URL"
                                value={lesson.video}
                                onChange={(e) =>
                                  handleInputChange(e, {
                                    chapterIndex,
                                    lessonIndex,
                                    field: "lesson_video",
                                  })
                                }
                                className={inputClass}
                              />
                              <button
                                onClick={() => {
                                  setCurrentChapterIndex(chapterIndex);
                                  setCurrentLessonIndex(lessonIndex);
                                  setSelectedMediaType("video");
                                  openModal("video");
                                }}
                                className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
                              >
                                <RiUploadCloud2Line />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      <div className="space-y-2">
                        <label className={`mb-1 block ${textColor}`}>
                          Notes
                        </label>
                        <input
                          type="text"
                          placeholder="Notes Name"
                          value={lesson.notesName}
                          onChange={(e) =>
                            handleInputChange(e, {
                              chapterIndex,
                              lessonIndex,
                              field: "lesson_notesName",
                            })
                          }
                          className={inputClass}
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Notes URL"
                            value={lesson.notes}
                            onChange={(e) =>
                              handleInputChange(e, {
                                chapterIndex,
                                lessonIndex,
                                field: "lesson_notesUrl",
                              })
                            }
                            className={inputClass}
                          />
                          <button
                            onClick={() => {
                              setCurrentChapterIndex(chapterIndex);
                              setCurrentLessonIndex(lessonIndex);
                              setSelectedMediaType("notes");
                              openPdfModal("notes");
                            }}
                            className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
                          >
                            <RiUploadCloud2Line />
                          </button>
                        </div>
                      </div>

                      {/* Assignment */}
                      <div className="space-y-2">
                        <label className={`mb-1 block ${textColor}`}>
                          Assignment
                        </label>
                        <input
                          type="text"
                          placeholder="Assignment Name"
                          value={lesson.assignmentName}
                          onChange={(e) =>
                            handleInputChange(e, {
                              chapterIndex,
                              lessonIndex,
                              field: "lesson_assignmentName",
                            })
                          }
                          className={inputClass}
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Assignment URL"
                            value={lesson.assignment}
                            onChange={(e) =>
                              handleInputChange(e, {
                                chapterIndex,
                                lessonIndex,
                                field: "lesson_assignmentUrl",
                              })
                            }
                            className={inputClass}
                          />
                          <button
                            onClick={() => {
                              setCurrentChapterIndex(chapterIndex);
                              setCurrentLessonIndex(lessonIndex);
                              setSelectedMediaType("assignment");
                              openPdfModal("assignment");
                            }}
                            className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
                          >
                            <RiUploadCloud2Line />
                          </button>
                        </div>
                      </div>

                      {/* Transcript */}
                      <div>
                        <label className={`mb-1 block ${textColor}`}>
                          Transcript
                        </label>
                        <textarea
                          placeholder="Enter transcript"
                          value={lesson.transcript}
                          onChange={(e) =>
                            handleInputChange(e, {
                              chapterIndex,
                              lessonIndex,
                              field: "lesson_transcript",
                            })
                          }
                          className={`${inputClass} min-h-[100px]`}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Projects */}
              <div className="space-y-3">
                <h3 className={`text-lg font-semibold ${textColor}`}>
                  Projects
                </h3>
                {chapter.project?.map((project, projectIndex) => (
                  <div
                    key={projectIndex}
                    className={`rounded-lg p-4 ${cardBgColor} shadow-sm`}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className={`font-medium ${textColor}`}>
                        Project {projectIndex + 1}
                      </h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => addProject(chapterIndex, projectIndex)}
                          className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
                        >
                          <FaPlus />
                        </button>
                        <button
                          onClick={() =>
                            removeProject(chapterIndex, projectIndex)
                          }
                          className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Project Title */}
                      <div>
                        <label className={`mb-1 block ${textColor}`}>
                          Project Title
                        </label>
                        <input
                          type="text"
                          placeholder="Enter project title"
                          value={project.title}
                          onChange={(e) =>
                            handleInputChange(e, {
                              chapterIndex,
                              projectIndex,
                              field: "project_title",
                            })
                          }
                          className={inputClass}
                        />
                      </div>

                      {/* Project Duration */}
                      <div>
                        <label className={`mb-1 block ${textColor}`}>
                          Duration (days)
                        </label>
                        <input
                          type="number"
                          placeholder="Duration in days"
                          value={project.duration}
                          onChange={(e) =>
                            handleInputChange(e, {
                              chapterIndex,
                              projectIndex,
                              field: "project_duration",
                            })
                          }
                          className={inputClass}
                        />
                      </div>

                      {/* Project Dates */}
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div>
                          <label className={`mb-1 block ${textColor}`}>
                            Start Date
                          </label>
                          <input
                            type="datetime-local"
                            value={formatDate(project.startDate)}
                            onChange={(e) =>
                              handleInputChange(e, {
                                chapterIndex,
                                projectIndex,
                                field: "project_startDate",
                              })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={`mb-1 block ${textColor}`}>
                            End Date
                          </label>
                          <input
                            type="datetime-local"
                            value={formatDate(project.endDate)}
                            onChange={(e) =>
                              handleInputChange(e, {
                                chapterIndex,
                                projectIndex,
                                field: "project_endDate",
                              })
                            }
                            className={inputClass}
                          />
                        </div>
                      </div>

                      {/* Project Info PDF */}
                      <div>
                        <label className={`mb-1 block ${textColor}`}>
                          Project Info PDF
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="PDF URL"
                            value={project.projectInfoPdf}
                            onChange={(e) =>
                              handleInputChange(e, {
                                chapterIndex,
                                projectIndex,
                                field: "project_infoPdf",
                              })
                            }
                            className={inputClass}
                          />
                          <button
                            onClick={() => {
                              setCurrentChapterIndex(chapterIndex);
                              setCurrentProjectIndex(projectIndex);
                              setSelectedMediaType("project_infoPdf");
                              openPdfModal("project_infoPdf");
                            }}
                            className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
                          >
                            <RiUploadCloud2Line />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurriculumLiveClasses;
