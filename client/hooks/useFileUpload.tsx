import { ChangeEvent, useCallback, useState } from "react";
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
} from "react-hook-form";

import { toast } from "sonner";

export default function useUploadFile<T extends FieldValues>(
  form: UseFormReturn<T>,
) {
  const [isChecking, setIsChecking] = useState<Record<string, boolean>>({});
  const [files, setFiles] = useState<Record<string, File> | null>(null);
  const [preview, setPreview] = useState<Record<string, string> | null>(null);

  const handleFileChange = useCallback(
    (field: Path<T>, file: File) => {
      setFiles((prev) => ({
        ...prev!,
        [field]: file,
      }));
      form.setValue(field, file as PathValue<T, Path<T>>);
    },
    [form],
  );

  const handlePreviewChange = useCallback(
    (field: Path<T>, result: string | ArrayBuffer | null) => {
      setPreview((prev) => ({
        ...prev!,
        [field]: result as string,
      }));
      form.setValue(field, result as PathValue<T, Path<T>>);
    },
    [form],
  );

  const handleChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>, field: Path<T>) => {
      if (!e.target.files) return;

      const file = e.target.files[0];
      setIsChecking((prev) => ({ ...prev, [field]: true }));

      try {
        if (field !== "audio") {
          handleFileChange(field, file);

          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              handlePreviewChange(field, event.target?.result);
            }
          };
          reader.readAsDataURL(file);
        } else {
          handleFileChange(field, file);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong while uploading image");
        }
      } finally {
        setIsChecking((prev) => ({ ...prev, [field]: false }));
      }
    },
    [handleFileChange, handlePreviewChange],
  );

  return {
    files,
    setFiles,
    preview,
    setPreview,
    handleChange,
    isChecking,
    handleFileChange,
  };
}
