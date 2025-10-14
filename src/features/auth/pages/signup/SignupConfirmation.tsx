import {
  selectUserFullName,
  selectUserStatus,
  useAppSelector,
} from "@/shared/store";
import type { UserStatus } from "@/shared/types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {ErrorScreen , InfoScreen, SuccessScreen } from "tccd-ui";

export default function SignupConfirmation() {
  const navigate = useNavigate();
  const userStatus: UserStatus = useAppSelector(selectUserStatus);
  const userFullName: string = useAppSelector(selectUserFullName);
  const userFirstName: string = userFullName.substring(
    0,
    userFullName.indexOf(" ")
  );

  useEffect(() => {
    if (userStatus === "Approved") {
      const timer = setTimeout(() => {
        navigate("/"); //speculatory home page sublink
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [userStatus, navigate]);

  // if (!userStatus) {
  //   return (
  //     <ErrorScreen
  //       title="Error Logging In"
  //       message="There was an error loggin you in, please try again later or contact support"
  //     />
  //   );
  // }

  switch (userStatus) {
    case "Pending":
      return (
        <InfoScreen
          title="Account Under Review"
          message="Thank you for signing up! Your account is currently under review. You will receive an email notification once your account has been approved."
        />
      );

    case "Rejected":
      return (
        <ErrorScreen
          title="Account Registration Rejected"
          message="Your account registration has been rejected. If you wish to appeal this decision, please contact support."
          showAdditionalInfo={false}
        />
      );

    case "Banned":
      return (
        <ErrorScreen
          title="Account Banned"
          message="Your account has been banned due to breaking Community Guidelines. If you wish to appeal this decision, please contact support."
          showAdditionalInfo={false}
        />
      );

    case "Approved":
      return (
        <SuccessScreen
          title={`Welcome, ${userFirstName}!`}
          message="Your account has been successfully created. You will be redirected to the home page shortly."
        />
      );

    default:
      return (
        <SuccessScreen
          title={`Welcome, ${userFirstName}!`}
          message="Your account has been successfully created. You will be redirected to the home page shortly."
        />
      );
  }
}
