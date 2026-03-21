import { Camera } from "lucide-react";
import Popper from "~/components/Popper/Popper";
import { useEffect, useRef, useState } from "react";
import { cn } from "~/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CategoryModel } from "~/types/categoryModel";
import { getCategories } from "~/services/categoryService";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import Location from "~/components/Location/locations";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "sonner";
import { listenEvent } from "~/utils/event";
import { createPost } from "~/services/postService";
import { da } from "zod/v4/locales";
interface IFile extends File {
  preview: string;
}

const createPostSchema = z.object({
  category_id: z.coerce.number("Vui lòng chọn danh mục bđs"),
  address: z.string().min(1, "Vui lòng nhập địa chỉ"),
  administrative_address: z.string().min(1, "Vui lòng nhập địa chỉ hành chính"),
  bedrooms: z
    .string()
    .min(1, "Vui lòng nhập số phòng ngủ")
    .pipe(
      z.coerce.number({
        error: "Số phòng ngủ không hợp lệ",
      }),
    )
    .pipe(z.number().min(0, "Số phòng ngủ phải lớn hơn hoặc bằng 0")),
  bathrooms: z
    .string()
    .min(1, "Vui lòng nhập số phòng tắm")
    .pipe(
      z.coerce.number({
        error: "Số phòng tắm không hợp lệ",
      }),
    )
    .pipe(z.number().min(0, "Số phòng tắm phải lớn hơn hoặc bằng 0")),
  balcony: z.string().min(1, "Vui lòng nhập hướng ban công"),
  main_door: z.string().min(1, "Vui lòng nhập hướng cửa chính"),
  legal_documents: z.string().min(1, "Vui lòng nhập loại giấy tờ pháp lý"),
  interior_status: z.string().min(1, "Vui lòng nhập tình trạng nội thất"),
  area: z
    .string()
    .min(1, "Vui lòng nhập diện tích")
    .pipe(
      z.coerce.number({
        error: "Diện tích không hợp lệ",
      }),
    )
    .pipe(z.number().min(0, "Diện tích phải lớn hơn hoặc bằng 0")),
  price: z
    .string()
    .min(1, "Vui lòng nhập giá bán")
    .pipe(
      z.coerce.number({
        error: "Giá không hợp lệ",
      }),
    )
    .pipe(z.number().min(0, "Giá phải lớn hơn hoặc bằng 0"))
    .transform(String),
  deposit: z
    .string()
    .min(1, "Vui lòng nhập số tiền cọc")
    .pipe(
      z.coerce.number({
        error: "Tiền cọc không hợp lệ",
      }),
    )
    .pipe(z.number().min(0, "Tiền cọc phải lớn hơn hoặc bằng 0"))
    .transform(String),
  title: z.string().min(1, "Vui lòng nhập tiêu đề"),
  description: z.string().min(1, "Vui lòng nhập mô tả"),
});
const CreatePost = () => {
  const [images, setImages] = useState<IFile[]>([]);
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [type, setType] = useState<"sell" | "rent">("sell");
  const [role, setRole] = useState<"user" | "agent">("user");
  const inputImageRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createPostSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();

        setCategories(response.data);
        if (response.data.length > 0) {
          setValue("category_id", response.data[0].id);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [setValue]);

  //giải phóng dung lượng ảnh tạm khi component unmount
  useEffect(() => {
    return () => {
      images.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const removeEvent = listenEvent("location:apply", ({ detail }) => {
      setValue(
        "administrative_address",
        Object.values(detail)
          .filter(Boolean)
          .reverse()
          .join(", ")
          .replace(/^(quận|huyện|thị xã|thành phố)\s+/i, ""),
      );
    });
    return () => {
      removeEvent();
    };
  }, [setValue]);

  const handleUploadImage = () => {
    inputImageRef.current?.click();
  };
  const handleUploadFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const filesWithPreview = files.map((file) => {
      return Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
    });

    setImages((prev) => [...prev, ...filesWithPreview]);

    //cho phép user tải file lên với tên giống nhau
    e.target.value = "";
  };
  const submitHandler = async (data: z.infer<typeof createPostSchema>) => {
    try {
      if (data.administrative_address.split(", ").length < 3) {
        setError("administrative_address", {
          type: "manual",
          message: "Vui lòng chọn địa chỉ đầy đủ",
        });
        return;
      }

      if (images.length === 0) {
        toast.error("Vui lòng tải lên ít nhất một hình ảnh");
        return;
      }
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
      const uploadResults = await Promise.all(
        images.map((image) => uploadToCloudinary(image, "real_estate")),
      );

      const createPostData = {
        title: data.title,
        description: data.description,
        category_id: data.category_id,
        address: data.address,
        administrative_address: data.administrative_address,
        images: JSON.stringify(
          uploadResults.map((result) => result.secure_url),
        ),
        project_type: type,
        role: role,
        details: {
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          balcony: data.balcony,
          main_door: data.main_door,
          legal_documents: data.legal_documents,
          interior_status: data.interior_status,
          area: data.area,
          price: data.price,
          deposit: data.deposit,
        },
      };

      const response = await createPost(createPostData);

      toast.success("Đăng bài thành công");
      reset();
      setImages([]);
      setType("sell");
      setRole("user");
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response?.data?.message);
      }
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  return (
    <Popper className="container mx-auto xl:max-w-7xl grid grid-cols-12 gap-3 mt-4">
      <div className="col-span-12 md:col-span-3">
        <p>Hình ảnh bất động sản</p>
        <input
          type="file"
          hidden
          accept="image/*"
          ref={inputImageRef}
          onChange={handleUploadFileChange}
          multiple
        />

        <div className="w-full flex flex-wrap gap-1">
          <div
            className={cn(
              "w-full aspect-square bg-gray-200 rounded-lg border border-primary border-dashed flex justify-center items-center flex-col gap-1 ",
              { "h-20 w-20": images.length > 0 },
            )}
            onClick={handleUploadImage}
          >
            <Camera></Camera>
            <p className={cn({ hidden: images.length > 0 })}>Thêm hình ảnh</p>
          </div>
          {images.map((image, index) => (
            <div key={index} className="w-20 h-20 relative overflow-hidden">
              <img src={image.preview} alt={image.name} />
              <button
                className="absolute -top-1 -right-1 rounded-full bg-gray-300 w-5 h-5 flex items-center justify-center"
                onClick={() => {
                  URL.revokeObjectURL(image.preview);
                  setImages((prev) => prev.filter((_, i) => i !== index));
                }}
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-12 md:col-span-9">
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="flex flex-col gap-3"
        >
          <div>
            <p>Danh mục tin đăng</p>
            <select
              id="category"
              className="w-full rounded-md p-2 border border-gray-300"
              {...register("category_id")}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <span className="text-red-500 text-sm">
                {errors.category_id.message}
              </span>
            )}
          </div>
          <div className="flex flex-col ">
            <label htmlFor="">Danh mục bất động sản</label>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => setType("sell")}
                variant={type === "sell" ? "default" : "secondary"}
              >
                Cần bán
              </Button>
              <Button
                type="button"
                onClick={() => setType("rent")}
                variant={type === "rent" ? "default" : "secondary"}
              >
                Cho thuê
              </Button>
            </div>
          </div>

          <div>
            <label>Địa chỉ bất động sản</label>
            <Input
              className="mt-1"
              {...register("address")}
              placeholder="Tên tòa nhà/khu dân cư/dự án"
            />
            {errors.address && (
              <span className="text-red-500 text-sm">
                {errors.address.message}
              </span>
            )}
          </div>

          <div className="flex gap-2 items-center">
            <Location></Location>
            <div className="flex flex-col w-full">
              <Input
                {...register("administrative_address")}
                placeholder="Địa chỉ bất động sản"
                readOnly
              />
              {errors.administrative_address && (
                <span className="text-red-500 text-sm">
                  {errors.administrative_address.message}
                </span>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="">Thông tin chi tiết</label>
            <div className="flex items-center gap-2 w-full">
              <div className="flex flex-col w-full">
                <Input
                  placeholder="Số phòng ngủ"
                  {...register("bedrooms")}
                ></Input>
                {errors.bedrooms && (
                  <span className="text-red-500 text-sm">
                    {errors.bedrooms.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col w-full">
                <Input
                  placeholder="Số phòng vệ sinh"
                  {...register("bathrooms")}
                ></Input>
                {errors.bathrooms && (
                  <span className="text-red-500 text-sm">
                    {errors.bathrooms.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex flex-col w-full">
                <Input
                  placeholder="Hướng ban công"
                  {...register("balcony")}
                ></Input>
                {errors.balcony && (
                  <span className="text-red-500 text-sm">
                    {errors.balcony.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col w-full">
                <Input
                  placeholder="Hướng cửa chính"
                  {...register("main_door")}
                ></Input>
                {errors.main_door && (
                  <span className="text-red-500 text-sm">
                    {errors.main_door.message}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="">Thông tin khác</label>
            <div className="flex items-center gap-2">
              <div className="flex flex-col w-full">
                <Input
                  placeholder="Giấy tờ pháp lý"
                  {...register("legal_documents")}
                ></Input>
                {errors.legal_documents && (
                  <span className="text-red-500 text-sm">
                    {errors.legal_documents.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col w-full">
                <Input
                  placeholder="Tình trạng nội thất"
                  {...register("interior_status")}
                ></Input>
                {errors.interior_status && (
                  <span className="text-red-500 text-sm">
                    {errors.interior_status.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="">Diện tích & Giá</label>
            <Input
              className="mt-2"
              placeholder="Diện tích(m²)"
              {...register("area")}
            ></Input>
            {errors.area && (
              <span className="text-red-500 text-sm">
                {errors.area.message}
              </span>
            )}

            <Input
              className="mt-2"
              placeholder="Giá bán(VNĐ)"
              {...register("price")}
            ></Input>
            {errors.price && (
              <span className="text-red-500 text-sm">
                {errors.price.message}
              </span>
            )}
            <Input
              className="mt-2"
              placeholder="Tiền cọc(VNĐ)"
              {...register("deposit")}
            ></Input>
            {errors.deposit && (
              <span className="text-red-500 text-sm">
                {errors.deposit.message}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="">Tiêu đề tin đăng & Mô tả chi tiết</label>
            <Input
              className="mt-2"
              placeholder="Tiêu đề tin đăng"
              {...register("title")}
            ></Input>
            {errors.title && (
              <span className="text-red-500 text-sm">
                {errors.title.message}
              </span>
            )}
            <Textarea
              className="mt-2"
              placeholder="Mô tả chi tiết"
              {...register("description")}
            ></Textarea>
            {errors.description && (
              <span className="text-red-500 text-sm">
                {errors.description.message}
              </span>
            )}
          </div>

          <div className="flex flex-col ">
            <label htmlFor="">Bạn là:</label>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => setRole("user")}
                variant={role === "user" ? "default" : "secondary"}
              >
                Người bán
              </Button>
              <Button
                type="button"
                onClick={() => setRole("agent")}
                variant={role === "agent" ? "default" : "secondary"}
              >
                Môi giới
              </Button>
            </div>
          </div>

          <Button className="mt-6" type="submit" disabled={isSubmitting}>
            Đăng tin
          </Button>
        </form>
      </div>
    </Popper>
  );
};

export default CreatePost;
