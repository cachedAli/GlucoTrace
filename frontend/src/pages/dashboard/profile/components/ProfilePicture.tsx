import Button from "@/components/ui/common/Button";
import BaseLoader from "@/components/ui/loader/BaseLoader";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useUserStore } from "@/store/useUserStore";
import imageCompression from "browser-image-compression";
import clsx from "clsx";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

const ProfilePicture = () => {
  const [profileImage, setProfileImage] = useState<string | undefined>(
    undefined
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // saved image
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    undefined
  ); // temporary
  const { user, setUser } = useUserStore();
  const { uploadImage, uploadImageLoading } = useDashboardStore();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (user?.profilePic) {
      setProfileImage(user.profilePic);
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setPreviewImage(base64);
    };
    reader.readAsDataURL(file);
  };
  
  const handleCommitImage = async () => {
    if (!user || !user.id || !selectedFile) return;
    
    
    try {
      const compressedFile = await imageCompression(selectedFile, {
        maxSizeMB: 1,
        maxWidthOrHeight: 512,
        useWebWorker: true,
      });

      // Assuming uploadImage accepts FormData now
      const success = await uploadImage(compressedFile);


      if (success) {
        // Create a preview URL for immediate UI update
        const previewUrl = URL.createObjectURL(compressedFile);

        const updatedUser = { ...user, profilePic: previewUrl };
        setUser(updatedUser);
        setProfileImage(previewUrl);
        setPreviewImage(undefined);
        setSelectedFile(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex w-full items-center justify-between">
      <div className="my-4 flex flex-col items-start gap-3">
        <label
          className={clsx(
            "text-headingSub mt-2 text-xl font-semibold",
            "dark:text-headingSub-dark"
          )}
        >
          Profile Picture
        </label>

        <div className="flex items-center gap-10 relative">
          <label htmlFor="profile-image-input" className="cursor-pointer">
            <img
              src={previewImage || profileImage || ""}
              alt=""
              className="w-24 h-24 rounded-full object-cover border dark:border-none"
            />
          </label>

          {!previewImage && (
            <span className="font-inter cursor-default select-none text-gray-400 font-medium dark:text-gray-300">
              Click on image to change
            </span>
          )}
        </div>

        <input
          id="profile-image-input"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      {previewImage && (
        <div className="flex w-[30%] items-center gap-3 flex-col">
          <Button
            variant="fill"
            onClick={handleCommitImage}
            disabled={uploadImageLoading}
          >
            {uploadImageLoading ? <BaseLoader /> : "Change Image"}
          </Button>
          <Button onClick={() => setPreviewImage(undefined)}>Cancel</Button>
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;
