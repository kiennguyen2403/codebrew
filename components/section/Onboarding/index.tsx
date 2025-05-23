import { Stack, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import OnboardingForm from "./OnboardingForm";
import AvatarSelection from "./AvatarSelection";
import { RegisterUser } from "@/utils/types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { getLocationName } from "@/store/slices/locationSlice";
import { registerUser } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";

const Onboarding = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const [currStep, setCurrStep] = useState(1);
  const [validStep1, setValidStep1] = useState(false);

  const [onboardingData, setOnboardingData] = useState<RegisterUser>({
    name: "",
    gender: "",
    whatsappNumber: "",
    location: { lon: 0, lat: 0 },
    hobbies: [],
    avatar: "",
  });

  const setName = (name: string) => {
    setOnboardingData({ ...onboardingData, name });
  };

  const setGender = (gender: string) => {
    setOnboardingData({ ...onboardingData, gender });
  };

  const setWhatsappNumber = (whatsappNumber: string) => {
    setOnboardingData({ ...onboardingData, whatsappNumber });
  };

  const setLocation = (location: { lon: number; lat: number }) => {
    setOnboardingData({ ...onboardingData, location });
  };

  const setHobbies = (hobbies: string[]) => {
    setOnboardingData({ ...onboardingData, hobbies });
  };

  const setAvatar = (avatar: string) => {
    setOnboardingData({ ...onboardingData, avatar });
  };

  useEffect(() => {
    if (
      onboardingData.location.lon === 0 &&
      onboardingData.location.lat === 0
    ) {
      dispatch(
        getLocationName(
          onboardingData.location.lat,
          onboardingData.location.lon
        )
      );
    }
  }, [onboardingData.location]);

  useEffect(() => {
    if (
      onboardingData.name !== "" &&
      onboardingData.gender !== "" &&
      onboardingData.whatsappNumber !== "" &&
      onboardingData.location.lon !== 0 &&
      onboardingData.location.lat !== 0
    ) {
      setValidStep1(true);
    }
  }, [onboardingData]);

  const handleNext = () => {
    if (currStep === 1) {
      setCurrStep(2);
    }
  };

  const handleBack = () => {
    if (currStep === 2) {
      setCurrStep(1);
    }
  };

  const handleSubmit = () => {
    if (validStep1) {
      dispatch(
        registerUser({
          userData: onboardingData,
          onSuccess: () => {
            router.push("/garden");
            notifications.show({
              title: "Success",
              message: "Profile created successfully",
              color: "green",
            });
          },
        })
      );
    }
  };

  return (
    <Stack align="center">
      <Title c={"primary"} fw={700} ta={"center"}>
        Create your Urbanteria Profile
      </Title>
      {currStep === 1 && (
        <OnboardingForm
          setName={setName}
          setGender={setGender}
          setWhatsappNumber={setWhatsappNumber}
          setLocation={setLocation}
          setHobbies={setHobbies}
          validStep={validStep1}
          handleNext={handleNext}
        />
      )}
      {currStep === 2 && (
        <AvatarSelection
          setAvatar={setAvatar}
          selectedAvatar={onboardingData.avatar}
          handleBack={handleBack}
          handleSubmit={handleSubmit}
        />
      )}
    </Stack>
  );
};

export default Onboarding;
