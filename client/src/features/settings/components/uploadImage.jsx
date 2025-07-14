import { useFile } from "@/shared/hooks/useFile";
import { RiCloseFill } from "@remixicon/react";
import { useState, useRef, useCallback, useEffect } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";

export default function UploadImage({ user }) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { selectedFile, setSelectedFile, handleFile, error, setError } =
    useFile();
  const fileInputRef = useRef(null);
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const actionError = fetcher.data?.error;

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success("Image uploaded successfully");
      setSelectedFile("");
      setUploadProgress(0);
    }
  }, [fetcher.data, setSelectedFile]);

  useEffect(() => {
    if (fetcher.state === "idle") {
      setIsUploading(false);
    } else if (fetcher.state === "submitting") {
      setIsUploading(true);
      setUploadProgress(0);
    }
  }, [fetcher.state]);

  useEffect(() => {
    let interval;
    if (isUploading) {
      let progress = 0;
      setUploadProgress(0);
      interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 5;
        if (progress >= 90) {
          progress = 90;
        }
        setUploadProgress(progress);
      }, 200);

      return () => {
        clearInterval(interval);
      };
    } else if (fetcher.data?.success) {
      setUploadProgress(100);
      setIsUploading(false);
      setSelectedFile("");
      setError("");
      const timeout = setTimeout(() => {
        setUploadProgress(0);
      }, 1000);

      return () => clearTimeout(timeout);
    } else if (fetcher.data?.error) {
      setError(fetcher.data.error);
    }
  }, [isUploading, fetcher.data, setSelectedFile, setError]);

  const onFormSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (selectedFile) {
        const formData = new FormData();
        formData.append("avatar", selectedFile);
        formData.append("title", "avatar");
        fetcher.submit(formData, {
          method: "patch",
          action: "/dashboard/settings/account",
          encType: "multipart/form-data",
        });
      }
    },
    [fetcher, selectedFile]
  );

  return (
    <>
      <h1 className="text-gray-600 font-bold">Your Photo</h1>
      <div className="mt-2 flex gap-4 items-center">
        <div className="avatar avatar-placeholder relative">
          <div className="w-20 rounded-full bg-gray-300 text-gray-600">
            {user?.avatar || selectedFile ? (
              <img
                src={selectedFile ? selectedFile : user?.avatar}
                alt={user?.fullname.split(" ")[0].charAt(0)}
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-xl">
                {user?.fullname
                  ?.split(" ")
                  .map((name) => name[0])
                  .join("")
                  .toUpperCase()}
              </span>
            )}
          </div>
          {selectedFile && (
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="absolute top-0 right-0 p-2 rounded-full bg-gray-300 text-gray-600 cursor-pointer"
              title="Remove image"
            >
              <RiCloseFill size={14} />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex flex-wrap items-center gap-2">
            {selectedFile ? (
              <fetcher.Form onSubmit={onFormSubmit}>
                <button
                  type="submit"
                  className="bg-blue-500 text-white font-bold border-[0.2px] border-gray-500 p-2 rounded-md cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Uploading..." : "Upload image"}
                </button>
              </fetcher.Form>
            ) : (
              <label htmlFor="avatar">
                <button
                  type="button"
                  onClick={handleImageClick}
                  className="text-sm font-bold border-[0.2px] border-gray-500 p-2 rounded-md cursor-pointer"
                >
                  Change image
                </button>
              </label>
            )}
            <p className="font-bol">JPG, PNG, GIF (max 5MB)</p>
          </div>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${uploadProgress}%`,
                  transition: "width 300ms ease-out",
                }}
              ></div>
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          id="avatar"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => {
            handleFile(e);
          }}
        />
        {(actionError || error) && (
          <p className="text-red-500">{actionError || error}</p>
        )}
      </div>
    </>
  );
}
