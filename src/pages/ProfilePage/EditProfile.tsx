import React, { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Field, FieldError, FieldGroup } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import useCurrentUser from "~/zustand/useCurrentUser";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Camera, UploadCloud } from "lucide-react";
import { updateProfile } from "~/services/userService";

const editProfileSchema = z.object({
  full_name: z.string().min(1, "Tên không được để trống"),
  nickname: z.string().min(1, "Nickname không được để trống"),
  phone_number: z
    .string()
    .min(1, "Số điện thoại không được để trống")
    .regex(
      /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
      "Số điện thoại không đúng định dạng",
    ),
});
interface IFile extends File {
  preview?: string;
}
interface EditProfileProp {
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditProfile = ({ setIsEditOpen }: EditProfileProp) => {
  const currentUser = useCurrentUser((state) => state.user);
  const setCurrentUser = useCurrentUser((state) => state.setUser);
  const {
    register,
    handleSubmit,
    setValue,

    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(editProfileSchema),
    mode: "onChange",
    values: {
      full_name: currentUser?.full_name || "",
      nickname: currentUser?.nickname || "",
      phone_number: currentUser?.phone_number || "",
    },
  });

  const [avatar, setAvatar] = useState<IFile | null>(null);

  const onSubmit = async (data: z.infer<typeof editProfileSchema>) => {
    try {
      setIsEditOpen(false);
      const uploadToCloudinary = async (file: IFile, folder: string) => {
        const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);
        formData.append("folder", folder);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dkmwrkngj/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

        return await response.json();
      };
      let avatar_url = currentUser?.avatar || "";
      if (avatar) {
        const result = await uploadToCloudinary(avatar, "users");
        avatar_url = result.secure_url;
      }
      const response = await updateProfile({
        full_name: data.full_name,
        nickname: data.nickname,
        phone_number: data.phone_number,
        avatar_url,
      });
      toast.success("Cập nhật thành công");
      window.history.replaceState({}, "", `/user/${response.data.nickname}`);
      setCurrentUser(response.data);
    } catch (_) {
      toast.error("Failed to update profile");
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      );
    }
  };

  useEffect(() => {
    return () => {
      avatar?.preview && URL.revokeObjectURL(avatar.preview);
    };
  }, [avatar]);

  return (
    <DialogContent className="sm:max-w-sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
          <DialogDescription>
            Thực hiện thay đổi trên hồ sơ của bạn tại đây. Nhấn lưu khi bạn đã
            hoàn thành.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <div className="flex items-center justify-center">
            <Avatar className="shrink-0 w-30 h-30 mx-auto relative">
              <AvatarImage
                src={avatar?.preview || currentUser?.avatar || ""}
                alt="@shadcn"
              />
              <AvatarFallback>VN</AvatarFallback>
              <Label
                htmlFor="avatar"
                className="size-8 rounded-full bg-white flex items-center justify-center absolute bottom-0 right-0"
              >
                <Camera className="size-4" />
              </Label>
              <Input
                onChange={handleChange}
                type="file"
                id="avatar"
                className="hidden"
                accept="image/*"
              />
            </Avatar>
          </div>
          <Field>
            <Label htmlFor="full_name">Tên</Label>
            <Input
              id="full_name"
              defaultValue={currentUser?.full_name}
              {...register("full_name")}
            />
            {errors.full_name && (
              <FieldError>{errors.full_name.message}</FieldError>
            )}
          </Field>
          <Field>
            <Label htmlFor="nickname">Nickname</Label>
            <Input
              id="nickname"
              defaultValue={currentUser?.nickname}
              {...register("nickname")}
            />
            {errors.nickname && (
              <FieldError>{errors.nickname.message}</FieldError>
            )}
          </Field>
          <Field>
            <Label htmlFor="phone_number">Số điện thoại</Label>
            <Input
              id="phone_number"
              defaultValue={currentUser?.phone_number}
              {...register("phone_number")}
            />
            {errors.phone_number && (
              <FieldError>{errors.phone_number.message}</FieldError>
            )}
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant={"secondary"}>
              Hủy
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isSubmitting}>
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default EditProfile;
