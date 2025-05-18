import Button from "@/components/ui/common/Button";
import { useUserStore } from "@/store/useUserStore";
import clsx from "clsx";
import React, { useEffect, useState } from "react";

const ProfilePicture = () => {
  const [profileImage, setProfileImage] = useState<string | undefined>(
    undefined
  ); // saved image
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    undefined
  ); // temporary
  const { user, setUser } = useUserStore();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parseUser = JSON.parse(storedUser);
      setProfileImage(parseUser?.profilePic || undefined);
    } else if (user?.profilePic) {
      setProfileImage(user.profilePic);
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setPreviewImage(base64); // only preview for now
    };
    reader.readAsDataURL(file);
  };

  const handleCommitImage = () => {
    if (!user || !user.id || !previewImage) return;

    const updatedUser = { ...user, profilePic: previewImage };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setProfileImage(previewImage); // update previewed image as actual
    setPreviewImage(undefined); // clear preview state
  };

  const handleResetImage = () => {
    if (!user || !user.id) return;

    const originalPic = user.profilePic ?? undefined;
    setProfileImage(originalPic);
    setPreviewImage(undefined);

    const updatedUser = { ...user, profilePic: originalPic };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
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

        <div className="flex items-center gap-10">
          <label htmlFor="profile-image-input" className="cursor-pointer">
            <img
              src={previewImage || profileImage || ""}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border"
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
          <Button variant="fill" onClick={handleCommitImage}>
            Change Image
          </Button>
          <Button onClick={() => setPreviewImage(undefined)}>Cancel</Button>
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;
