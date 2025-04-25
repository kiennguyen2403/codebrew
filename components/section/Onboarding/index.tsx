import { Stack, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import OnboardingForm from "./OnboardingForm";
import AvatarSelection from "./AvatarSelection";
import { RegisterUser } from "@/utils/types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { getLocationName } from "@/store/slices/locationSlice";
import { registerUser } from "@/store/slices/authSlice";
const Onboarding = () => {
  const dispatch: AppDispatch = useDispatch();

  const [currStep, setCurrStep] = useState(2);
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
      dispatch(registerUser({ clerkId: "", userData: onboardingData }));
      console.log(onboardingData);
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
