import { Form, FormInput } from "@/components/Form";
import { useAppSelector } from "@/stores/store";
import { IUser } from "@/types/api";
import useAdmin from "@/utils/api/useAdmin";
import useUser from "@/utils/api/useUser";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import * as V from "@/utils/formFieldValidation";
import { Button, ButtonBorderOnly, ButtonInverted } from "@/components/Button";
import { currencyFormat } from "@/utils/currencyFormat";
import Link from "next/link";
import {
  dashboardProfileEditRoute,
  dashboardProfileRoute,
  profileEditRoute,
  profileRoute,
} from "@/routes";
import useUpdateUser from "@/utils/api/useUpdateUser";
import { useRouter } from "next/router";
import useAccountWithEmail from "@/utils/api/useAccountWithEmail";
import { toast } from "sonner";
import { LiaUserEditSolid } from "react-icons/lia";
import useCloudinary from "@/utils/api/useCloudinary";
import { setCookie } from "@/utils/cookies";
import { ButtonDanger } from "@/components/Button/Button";
import { encodeString } from "@/utils/stringEncoderDecoder";
import useUpdateAdmin from "@/utils/api/useUpdateAdmin";
import CopyTextIcon from "@/components/CopyTextIcon";
import StatCard from "@/components/Card/StatCard";

const LoadingDots = () => {
  return (
    <span className="loading loading-dots loading-lg absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 z-10 text-primary_red"></span>
  );
};

const Profile = ({ isEditable = false }: { isEditable?: boolean }) => {
  const router = useRouter();
  const roleID = useAppSelector((state) => state.roleID);
  const { user, isLoading: isLoadingUser, getUser } = useUser();
  const { admin, isLoading: isLoadingAdmin, getAdmin } = useAdmin();
  const [person, setPerson] = useState<Partial<IUser>>();
  const {
    user: updatedUser,
    isLoading: isUpdatingUserData,
    updateUserData,
  } = useUpdateUser();
  const {
    admin: updatedAdmin,
    isLoading: isUpdatingAdminData,
    updateAdminData,
  } = useUpdateAdmin();
  const { accountWithTheEmail, findAccountWithEmail } = useAccountWithEmail();
  const [isAnotherUserRegistered, setIsAnotherUserRegistered] = useState(false);
  const [isButtonFirstClicked, setIsButtonFirstClicked] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const { uploadedPhotoURL, uploadPhotoIsLoading, uploadPhotoToCloudinary } =
    useCloudinary();
  useEffect(() => {
    if (roleID.admin_id !== 0) {
      getAdmin(roleID.admin_id);
      return;
    }
    if (roleID.user_id !== 0) {
      getUser(roleID.user_id);
      return;
    }
  }, []);

  useEffect(() => {
    if (admin !== null) {
      setPerson(admin);
      return;
    }
    if (user !== null) {
      setPerson(user);
    }
  }, [user, admin]);

  useEffect(() => {
    if (person !== undefined) {
      setFullName(person.name!);
      setEmail(person.email!);
      setPhoneNum(person.phoneNumber!);
      setPhoto(person.photo!);
      return;
    }
  }, [person]);

  const handleErrorMessages = (
    inputType:
      | "email"
      | "fullname"
      | "phoneNum"
      | "refCodeFriend"
      | "password"
      | "confirmPassword"
  ) => {
    switch (inputType) {
      case "fullname":
        if (V.isFormFieldEmpty(fullName)) {
          return "Please enter your name";
        }
        if (!V.isNameValid(fullName)) {
          return "Name cannot contain any symbol or number";
        }
        break;
      case "email":
        if (V.isFormFieldEmpty(email)) {
          return "Please input email";
        }
        if (!V.isEmailValid(email)) {
          return "Wrong email format (ex: example@domain.com)";
        }
        if (isAnotherUserRegistered) {
          return "Account with same email is already registered";
        }
        break;
      case "phoneNum":
        if (V.isFormFieldEmpty(phoneNum)) {
          return "Please input phone number";
        }
        if (!V.isPhoneNumValid(phoneNum)) {
          return `Must be ${V.minPhoneNumDigit}-${V.maxPhoneNumDigit} digits and starts with "${V.phoneNumStartDigits}" `;
        }
        break;
    }

    return "This error is not shown";
  };

  const handleFormSubmit = () => {
    const isAllFieldValid =
      V.isAllFieldFilled([fullName, email, phoneNum]) &&
      V.isNameValid(fullName) &&
      V.isEmailValid(email) &&
      V.isPhoneNumValid(phoneNum);

    if (!isAllFieldValid) {
      return;
    }

    findAccountWithEmail(email);
  };

  useEffect(() => {
    if (
      !isButtonFirstClicked ||
      !V.isAllFieldFilled([fullName, email, phoneNum])
    ) {
      return;
    }
    if (accountWithTheEmail !== null && accountWithTheEmail !== undefined) {
      if (accountWithTheEmail.id !== person?.id) {
        setIsAnotherUserRegistered(true);
        return;
      }
    }
    setIsAnotherUserRegistered(false);
    handleUpdateData();
  }, [accountWithTheEmail]);

  const handleUpdateData = () => {
    const dataToBeUpdated: Partial<IUser> = {
      name: fullName,
      email: email,
      phoneNumber: phoneNum,
      photo: photo,
    };
    if (admin !== null) {
      updateAdminData(person!.id!, dataToBeUpdated);
    } else if (user !== null) {
      updateUserData(person!.id!, dataToBeUpdated);
    }
    if (uploadedPhotoURL !== null && !uploadPhotoIsLoading) {
      setCookie("PPURL", encodeString(uploadedPhotoURL.url), 1);
    }
  };

  useEffect(() => {
    if (updatedUser !== null || updatedAdmin !== null) {
      setTimeout(() => {
        toast.success("Profile changes have been saved", { duration: 1500 });
        router.push(admin !== null ? dashboardProfileRoute : profileRoute);
      }, 1000);
    }
  }, [updatedUser, updatedAdmin]);

  useEffect(() => {
    setIsButtonFirstClicked(false);
  }, [email]);

  const handleUploadPhotos = () => {
    if (photoFile !== null) {
      uploadPhotoToCloudinary(photoFile);
      return;
    }
  };

  useEffect(() => {
    handleUploadPhotos();
  }, [photoFile]);

  useEffect(() => {
    if (uploadedPhotoURL !== null && !uploadPhotoIsLoading) {
      setPhoto(uploadedPhotoURL.url);
    }
  }, [uploadedPhotoURL]);

  return (
    <>
      {(isLoadingAdmin ||
        isLoadingUser ||
        isUpdatingUserData ||
        isUpdatingAdminData) && <p>Loading</p>}
      {person !== undefined &&
        photo !== "" &&
        !isLoadingAdmin &&
        !isLoadingUser && (
          <div>
            <div className="flex justify-center my-4">
              <div className="relative">
                {uploadPhotoIsLoading && person.photo === photo && (
                  <LoadingDots />
                )}
                <div className="avatar flex justify-center ">
                  <div
                    className={`w-2/12 min-w-[10rem] rounded-full border-2 ${
                      isEditable
                        ? person.photo !== photo &&
                          "border-primary_red border-4"
                        : ""
                    } ${
                      uploadPhotoIsLoading && person.photo === photo
                        ? "opacity-50"
                        : ""
                    }`}
                  >
                    <Image
                      src={photo}
                      alt={`Photo of ${person.name}`}
                      width={200}
                      height={200}
                    />
                  </div>
                </div>
                {isEditable && (
                  <>
                    <div className="btn absolute -bottom-2 right-5 bg-[#d3d3d3] rounded-full p-2">
                      <label htmlFor="upload-photo" className="cursor-pointer">
                        <LiaUserEditSolid size={30} />
                      </label>
                    </div>
                    <div>
                      <input
                        className="hidden"
                        type="file"
                        id={"upload-photo"}
                        accept="image/png, image/jpeg"
                        onChange={(e) => {
                          const file = (e.target as HTMLInputElement).files;
                          if (file !== null) {
                            setPhotoFile(file[0]);
                            return;
                          }
                          setPhoto(photo);
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-row justify-between">
              <div className="flex flex-row gap-4">
                {person.refCode && (
                  <div className="w-60">
                    <StatCard
                      title="Your Referral Code:"
                      value={
                        <div className="flex flex-row  items-center gap-4">
                          <span>{person.refCode}</span>
                          <CopyTextIcon textToCopy={person.refCode} />
                        </div>
                      }
                      desc={`Number of Referred User: ${person.countRefCode}`}
                    />
                  </div>
                )}
                {person.balance !== undefined && (
                  <div className="w-fit min-w-[16rem]">
                    <StatCard
                      title="Your Balance:"
                      value={currencyFormat(person.balance)}
                    />
                  </div>
                )}
              </div>
              <div className="flex items-end gap-1">
                {!isEditable && (
                  <Link
                    href={
                      admin !== null
                        ? dashboardProfileEditRoute
                        : profileEditRoute
                    }
                  >
                    <ButtonBorderOnly
                      onClick={() => {}}
                      type="button"
                      withoutHoverEffect={true}
                    >
                      Edit Profile
                    </ButtonBorderOnly>
                  </Link>
                )}
                {isEditable && (
                  <>
                    <div>
                      <Button
                        onClick={() => {
                          setIsButtonFirstClicked(true);
                          setIsAnotherUserRegistered(false);
                          handleFormSubmit();
                        }}
                        type="submit"
                        withoutHoverEffect={true}
                      >
                        Save Changes
                      </Button>
                    </div>
                    <div>
                      <ButtonDanger
                        onClick={() => {
                          toast.warning(
                            "Edit profile is aborted. Discarding changes...",
                            {
                              duration: 1800,
                            }
                          );
                          setTimeout(() => {
                            router.push(
                              admin !== null
                                ? dashboardProfileRoute
                                : profileRoute
                            );
                          }, 1500);
                        }}
                        type="submit"
                        withoutHoverEffect={true}
                      >
                        Cancel
                      </ButtonDanger>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div>
              <Form formnovalidate={true}>
                <FormInput
                  type="text"
                  placeholder="Input your full name.."
                  titleText="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  errorText={handleErrorMessages("fullname")}
                  isError={
                    !V.isNameValid(fullName) || V.isFormFieldEmpty(fullName)
                  }
                  isDisabled={!isEditable}
                />
                <FormInput
                  type="email"
                  titleText="Email Address"
                  placeholder="Input your email address.."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  errorText={handleErrorMessages("email")}
                  isError={
                    (!V.isEmailValid(email) && !V.isFormFieldEmpty(email)) ||
                    V.isFormFieldEmpty(email) ||
                    (isAnotherUserRegistered && isButtonFirstClicked)
                  }
                  isDisabled={!isEditable || admin !== null}
                />
                <FormInput
                  type="string"
                  placeholder="Input your phone number.."
                  titleText="Phone Number"
                  value={phoneNum}
                  onChange={(e) => {
                    if (e.target.value.length <= V.maxPhoneNumDigit) {
                      setPhoneNum(e.target.value.replace(/[^\d]/g, ""));
                    }
                  }}
                  errorText={handleErrorMessages("phoneNum")}
                  isError={
                    (!V.isPhoneNumValid(phoneNum) &&
                      !V.isFormFieldEmpty(phoneNum)) ||
                    V.isFormFieldEmpty(phoneNum)
                  }
                  isDisabled={!isEditable || admin !== null}
                />
              </Form>
            </div>
          </div>
        )}
    </>
  );
};

export default Profile;
