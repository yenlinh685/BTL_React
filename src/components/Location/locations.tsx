import axios from "axios";
import HeadlessTippy from "huanpenguin-tippy-react/headless";
import { ChevronLeft } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { sendEvent } from "~/utils/event";

interface Ward {
  name: string;
  pre: string;
}

interface District {
  name: string;
  pre: string;
  ward?: Ward[];
}

interface Province {
  code: string;
  file_path: string;
  district?: District[];
}

interface SelectData {
  type: "province" | "district" | "ward" | "";
  data: {
    [key: string]: Province;
  };
}

const Location = () => {
  const tippyInstanceRef = useRef(null);
  const [location, setLocation] = useState({
    province: "",
    district: "",
    ward: "",
  });

  const [selectedLocation, setSelectedLocation] = useState<SelectData>({
    type: "",
    data: {},
  });

  const handleSelect = async (type: "province" | "district" | "ward") => {
    switch (type) {
      case "province":
        {
          const { data } = await axios.get("/locations/index.json");

          setSelectedLocation({
            type: "province",
            data,
          });
        }
        break;
      case "district":
        const filePath = selectedLocation.data[location.province].file_path;

        const { data: district } = await axios.get(filePath);

        setSelectedLocation((prev) => {
          return {
            ...prev,
            type: "district",
            data: {
              ...prev.data,
              [location.province]: {
                ...prev.data[location.province],
                district: district.district,
              },
            },
          };
        });

        setSelectedLocation((prev) => {
          return {
            ...prev,
            type: "district",
          };
        });
        break;
      case "ward":
        setSelectedLocation((prev) => {
          return {
            ...prev,
            type: "ward",
            data: {
              ...prev.data,
              [location.district]: {
                ...prev.data[location.district],
                ward: prev.data[location.district]?.district?.find(
                  (item: District) => {
                    return item.pre + " " + item.name === location.district;
                  },
                )?.ward,
              },
            },
          };
        });
        break;
    }
  };

  const handleBack = () => {
    setSelectedLocation((prev) => {
      return {
        ...prev,
        type: "",
      };
    });
  };

  const handleChoose = (
    type: "province" | "district" | "ward" | "",
    item: string,
  ) => {
    setLocation((prev) => {
      return {
        ...prev,
        [type]: item,
      };
    });

    handleBack();
  };

  return (
    <HeadlessTippy
      trigger="click"
      interactive
      onHide={handleBack}
      onShow={(instance: any) => {
        tippyInstanceRef.current = instance;
      }}
      render={(attrs) => (
        <div
          className="bg-white p-2 shadow-sm w-100 flex flex-col gap-1 max-h-[calc(100dvh-200px)] overflow-auto "
          {...attrs}
        >
          {selectedLocation.type ? (
            <>
              <Button variant={"ghost"} size={"icon"} onClick={handleBack}>
                <ChevronLeft className="size-6" />
              </Button>

              {(() => {
                let data: string[] = [];

                switch (selectedLocation.type) {
                  case "province":
                    data = Object.keys(selectedLocation.data);
                    break;
                  case "district":
                    {
                      if (!location.province) {
                        toast.error("Vui lòng chọn tỉnh/thành phố trước");
                        return;
                      }

                      data = selectedLocation?.data[location.province]?.district
                        ?.map((item: District) => {
                          return item.pre + " " + item.name;
                        })
                        .filter(Boolean) as string[];

                      console.log(data);
                    }
                    break;
                  case "ward":
                    data = selectedLocation.data[location.province].district
                      ?.find((dis: District) => {
                        return dis.pre + " " + dis.name === location.district;
                      })
                      ?.ward?.map((item: Ward) => {
                        return item.pre + " " + item.name;
                      })
                      .filter(Boolean) as string[];

                    break;
                }

                return data.map((item) => {
                  return (
                    <Button
                      key={item}
                      variant={"outline"}
                      className="flex justify-start"
                      onClick={() => {
                        handleChoose(selectedLocation.type, item);
                      }}
                    >
                      {item}
                    </Button>
                  );
                });
              })()}
            </>
          ) : (
            <>
              <Button
                onClick={() => handleSelect("province")}
                variant="outline"
                className="border! border-border! text-left flex justify-start"
              >
                Chọn tỉnh/thành phố
                {location.province && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({location.province})
                  </span>
                )}
              </Button>

              <Button
                onClick={() => handleSelect("district")}
                variant="outline"
                className="border! border-border! text-left flex justify-start"
              >
                Chọn quận/huyện
                {location.district && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({location.district})
                  </span>
                )}
              </Button>

              <Button
                onClick={() => handleSelect("ward")}
                variant="outline"
                className="border! border-border! text-left flex justify-start"
              >
                Chọn xã/phường
                {location.ward && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({location.ward})
                  </span>
                )}
              </Button>
            </>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant={"outline"}
              className="flex-1"
              onClick={() => {
                setLocation({
                  province: "",
                  district: "",
                  ward: "",
                });
              }}
            >
              Xóa
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                sendEvent("location:apply", location);
                // @ts-ignore
                tippyInstanceRef.current?.hide();
              }}
            >
              Áp dụng
            </Button>
          </div>
        </div>
      )}
    >
      <div className="cursor-pointer px-4 py-2 bg-primary/40 rounded-2xl shrink-0 hidden md:block">
        Chọn vị trí
      </div>
    </HeadlessTippy>
  );
};

export default Location;
