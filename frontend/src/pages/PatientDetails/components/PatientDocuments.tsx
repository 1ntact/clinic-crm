import { useAppDispatch, useAppSelector } from "@/app/store/hook";
import { ButtonPage } from "@/components/button/ButtonsPage";
import { getVisits } from "@/features/visits/thunks/getVisitsThunk";
import { buttonStyles } from "@/shared/styles/formButtonStyles";
import { useEffect } from "react";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiPlus,
  FiPrinter,
  FiSearch,
} from "react-icons/fi";

export const PatientDocuments = () => {
  const {currentVisits, visits} = useAppSelector(state=>state.visit)
 const dispatch = useAppDispatch()
 
  useEffect(() => {
    
    const getAllVisits = async () => {
      try {
        await dispatch(getVisits())
      }
      catch (e) {
        console.log(e)
        
      }
    }
    getAllVisits()
  },[dispatch])
  const files = [
    {
      name: "Panoramic teeth",
      type: "X-ray",
      date: "10.01.2026",
      size: "2.4 MB",
    },
    {
      name: "Molar roots",
      type: "CT Scan",
      date: "15.01.2024",
      size: "2.4 MB",
    },
    {
      name: "Incisor alignment",
      type: "PDF",
      date: "20.01.2024",
      size: "2.4 MB",
    },
    {
      name: "Tooth extraction",
      type: "MRI",
      date: "25.01.2024",
      size: "2.9 MB",
    },
    {
      name: "Gum assessment",
      type: "X-ray",
      date: "30.01.2024",
      size: "2.2 MB",
    },
    {
      name: "Panoramic tooth 34",
      type: "CT Scan",
      date: "30.01.2024",
      size: "2.2 MB",
    },
  ];

  const notes = [
    {
      date: "12.03.2024",
      title: "Initial examination - tooth 36",
      doctor: "Dr.Linda Brown",
      avatar: "https://i.pravatar.cc/40?img=47",
    },
    {
      date: "12.06.2024",
      title: "Endodontic treatment - tooth 24",
      doctor: "Dr.Linda Brown",
      avatar: "https://i.pravatar.cc/40?img=32",
    },
    {
      date: "12.03.2024",
      title: "Root canal treatment - tooth 34",
      doctor: "Dr.Linda Brown",
      avatar: "https://i.pravatar.cc/40?img=32",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-[1.45fr_1fr]">
       {/* ===================== CLINICAL NOTES ===================== */}

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[12px] font-semibold uppercase text-gray-700">
            Clinical Notes (5)
          </h2>

          <ButtonPage
            type="button"
            disabled={!currentVisits}
            className={buttonStyles.addNote}
          >
            <FiPlus size={14} />
            Add note
          </ButtonPage>
        </div>

        {/* Search */}
        <div className="mb-5 flex h-10 items-center gap-3 rounded-lg border border-gray-200 px-3">
          <FiSearch
            size={15}
            className="shrink-0 text-gray-500"
          />

          <span className="text-xs text-gray-500">
            Search notes
          </span>
        </div>

        {/* Notes */}
       {visits.length !==0 && <div>
          {visits.map((note) => (
            <div
              key={note.id}
              className="border-b border-gray-100 py-3.5"
            >
              {/* Date + Status */}
              <div className="mb-1 flex items-center justify-between gap-3">
                <span className="text-[10px] font-medium uppercase text-gray-500">
                  Visit note • {note.mainTreatment}
                </span>

                <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-[10px] font-medium text-gray-700">
                  Completed
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-semibold text-gray-900">
                {note.additionalTreatment_1}
              </h3>

              {/* Doctor + Details */}
              <div className="mt-3 flex items-center justify-between">
                {/* Doctor */}
                <div className="flex items-center gap-2">
                  <img
                    src={note.avatar}
                    alt=""
                    className="h-5 w-5 rounded-full object-cover"
                  />

                  <span className="text-[11px] text-gray-500">
                    {note.doctor}
                  </span>
                </div>

                {/* More details */}
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs font-medium text-blue-600 transition hover:text-blue-700"
                >
                  More details
                  <FiChevronDown size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>}

        {/* Notes Pagination */}
        <div className="mt-4 flex justify-end">
          <div className="flex items-center gap-1">
            {/* Previous */}
            <button
              type="button"
              className="flex h-8 items-center gap-1 px-2 text-xs text-gray-700 transition hover:text-blue-600"
            >
              <FiChevronLeft size={14} />
              Previous
            </button>

            {/* 1 */}
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-xs text-gray-700"
            >
              1
            </button>

            {/* 2 */}
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center text-xs text-gray-700"
            >
              2
            </button>

            {/* Next */}
            <button
              type="button"
              className="flex h-8 items-center gap-1 px-2 text-xs text-gray-700 transition hover:text-blue-600"
            >
              Next
              <FiChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>
      {/* ===================== FILES ===================== */}

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-[12px] font-semibold uppercase text-gray-700">
            Files \ Documents (12)
          </h2>
        </div>

        {/* Upload */}
        <div className="mb-5 flex h-[120px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50">
          <p className="text-sm font-medium text-gray-700">
            Drop your files here or{" "}
            <button
              type="button"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              browse
            </button>
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Maximum size: 50MB
          </p>
        </div>

        {/* Table */}
        <div className="overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1.5fr_1.2fr_1fr_55px] items-center bg-gray-100 px-2 py-2.5">
            <span className="text-[10px] font-medium uppercase text-gray-500">
              Name
            </span>

            <span className="text-[10px] font-medium uppercase text-gray-500">
              Type
            </span>

            <span className="text-[10px] font-medium uppercase text-gray-500">
              Date
            </span>

            <span className="text-[10px] font-medium uppercase text-gray-500">
              Size
            </span>

            <span className="text-[10px] font-medium uppercase text-gray-500">
              Action
            </span>
          </div>

          {/* Files */}
          {files.map((file) => (
            <div
              key={file.name}
              className="grid grid-cols-[2fr_1.5fr_1.2fr_1fr_55px] items-center border-b border-gray-100 px-2 py-2.5"
            >
              <span className="truncate text-[12px] font-medium text-gray-800">
                {file.name}
              </span>

              <span className="text-[12px] text-gray-500">
                {file.type}
              </span>

              <span className="text-[12px] text-gray-500">
                {file.date}
              </span>

              <span className="text-[12px] text-gray-500">
                {file.size}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="text-gray-700 transition hover:text-blue-600"
                >
                  <FiDownload size={15} />
                </button>

                <button
                  type="button"
                  className="text-gray-700 transition hover:text-blue-600"
                >
                  <FiPrinter size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Files Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[11px] text-gray-500">
            01 pages of 05
          </span>

          <div className="flex items-center gap-1">
            {/* Previous */}
            <button
              type="button"
              className="flex h-8 items-center gap-1 px-2 text-xs text-gray-700 transition hover:text-blue-600"
            >
              <FiChevronLeft size={14} />
              Previous
            </button>

            {/* 1 */}
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-xs text-gray-700"
            >
              1
            </button>

            {/* 2 */}
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center text-xs text-gray-700"
            >
              2
            </button>

            {/* 3 */}
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center text-xs text-gray-700"
            >
              3
            </button>

            {/* ... */}
            <span className="flex h-8 w-8 items-center justify-center text-xs text-gray-400">
              ...
            </span>

            {/* 5 */}
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center text-xs text-gray-700"
            >
              5
            </button>

            {/* Next */}
            <button
              type="button"
              className="flex h-8 items-center gap-1 px-2 text-xs text-gray-700 transition hover:text-blue-600"
            >
              Next
              <FiChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

     
    </div>
  );
};