import React, { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import TextEditor from "../../components/TextEditor";
import { LegalSkeleton } from "../../components/shimmer/LegalSkeleton";
import {
  useGetTermsQuery,
  useUpdateTermsMutation,
} from "../../redux/api/profileApi";

const CONTENT_TYPE = "terms_and_condition";

export default function TermsConditionsManagement() {
  const [content, setContent] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { data, isLoading, refetch } = useGetTermsQuery();
  const [saveContent, { isLoading: isSaving }] = useUpdateTermsMutation();

  useEffect(() => {
    if (!data) return;

    const rawData = data?.data ?? data;
    const serverContent =
      (typeof rawData === "string" ? rawData : null) ??
      rawData?.content ??
      rawData?.termsAndConditions ??
      rawData?.terms_and_condition ??
      rawData?.terms ??
      rawData?.description ??
      (Array.isArray(rawData)
        ? rawData[0]?.content || rawData[0]?.description
        : null) ??
      data?.content ??
      "";

    if (!initialized) {
      if (serverContent) {
        setContent(serverContent);
      }
      setInitialized(true);
    }
  }, [data, initialized]);

  const handleSave = async () => {
    try {
      await saveContent({
        content,
        type: CONTENT_TYPE,
        termsAndConditions: content,
        description: content,
      }).unwrap();
      setShowSuccess(true);
      refetch();
      toast.success("Terms & Conditions saved successfully");
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to save changes");
    }
  };

  if (isLoading) return <LegalSkeleton />;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6 md:p-12 font-sans text-slate-800">
      <div className="w-full max-w-225 mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Terms & Conditions
        </h1>
        <p className="text-gray-500 text-sm">
          Manage the legal agreement between you and your users.
        </p>
      </div>

      <div className="w-full max-w-225">
        <div className="w-full mb-6">
          <TextEditor
            content={content}
            onChange={(html) => setContent(html)}
            placeholder="Type your Terms & Conditions content here..."
            minHeight="450px"
          />
        </div>

        <div
          className={`h-8 flex justify-center transition-opacity duration-300 ${
            showSuccess ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full text-sm font-bold border border-emerald-100">
            <CheckCircle2 size={16} /> Terms & Conditions updated successfully
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full mt-6 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-[0.99] cursor-pointer ${
            isSaving
              ? "bg-amber-300 text-white cursor-not-allowed"
              : "bg-[#F7B115] text-white hover:bg-[#e0a012]"
          }`}
        >
          {isSaving ? "Saving..." : "Save Terms & Conditions"}
        </button>
      </div>
    </div>
  );
}