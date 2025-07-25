import Modal from "@/components/modal";
import { useFile } from "@/hooks/useFile";
import { RiCloseFill, RiUploadCloud2Line } from "@remixicon/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";

export default function UploadPayment({ payment, isOpen, onClose }) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { selectedFile, setSelectedFile, handleFile, error, setError } =
    useFile();
  const fileInputRef = useRef(null);
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const actionError = fetcher.data?.error || error;

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (fetcher.data?.success) {
      setShowSuccess(true);
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
        formData.append("receipt", selectedFile);
        formData.append("paymentId", payment._id);
        fetcher.submit(formData, {
          method: "patch",
          action: "/dashboard/patient-payments",
          encType: "multipart/form-data",
        });
      }
    },
    [fetcher, payment._id, selectedFile]
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        id="uploadPaymentModal"
        classname="bg-white p-4 rounded-xl shadow-lg w-[90%] max-w-[600px] mx-auto"
        title={`${
          payment?.receipt ? "Update Payment Receipt" : "Upload Payment Receipt"
        }`}
        showClose
        onClose={onClose}
      >
        <div className="flex flex-col gap-4 items-center justify-center min-h-[300px]">
          {!showSuccess ? (
            <div>
              <div className="my-4 flex flex-col items-center gap-2 border border-dashed border-gray-500 p-2 rounded-md">
                {selectedFile || payment?.receipt ? (
                  <>
                    <fetcher.Form
                      onSubmit={onFormSubmit}
                      className="flex flex-col items-center gap-2 w-[80%] h-[250px] relative"
                    >
                      <img
                        src={selectedFile || payment?.receipt}
                        alt="receipt"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <button
                        type="submit"
                        className="bg-blue-500 text-white font-bold border-[0.2px] border-gray-500 p-2 rounded-md cursor-pointer"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Uploading..." : "Upload image"}
                      </button>
                      {selectedFile && (
                        <button
                          type="button"
                          onClick={() => setSelectedFile(null)}
                          className="absolute top-1 right-2 p-2 rounded-full bg-gray-300 text-gray-600 cursor-pointer"
                          title="Remove image"
                        >
                          <RiCloseFill size={14} />
                        </button>
                      )}
                    </fetcher.Form>
                  </>
                ) : (
                  <>
                    <label htmlFor="receipt">
                      <button
                        type="button"
                        onClick={handleImageClick}
                        className="text-sm font-bold cursor-pointer"
                      >
                        <RiUploadCloud2Line
                          size={80}
                          className="text-blue-500"
                        />
                      </button>
                    </label>
                    <p className="text-sm font-bold">Upload receipt</p>
                    <p className="font-bol">JPG, PNG, GIF (max 5MB)</p>
                  </>
                )}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-[50%] bg-gray-200 rounded-full h-2.5 overflow-hidden">
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
                accept="image/jpeg, image/png, image/gif, image/jpg"
                id="receipt"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => {
                  handleFile(e);
                }}
              />
              {actionError && <p className="text-red-500">{actionError}</p>}
            </div>
          ) : (
            <div className="p-4 text-center max-w-[300px] mx-auto">
              <img
                src="/Success.svg"
                alt="success"
                className="w-full h-[250px]"
              />
              <h1 className="text-2xl font-bold">Congratulations!</h1>
              <p className="text-gray-600">{fetcher.data?.message}</p>
              <button
                onClick={onClose}
                className="my-4 btn bg-blue-500 hover:bg-blue-600 text-white"
              >
                Go back to Payments
              </button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
