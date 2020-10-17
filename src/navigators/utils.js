import React from "react";
import {
  InsertUser,
  QrVerification,
  UserQRCode,
  InsertRole
} from "../components";
import CertificateNavigator from "./CertificateNavigator";

export const getTabScreens = (role, Tab) => {
  if (role == "admin") {
    return (
      <>
        <Tab.Screen name="Admin" component={InsertRole} />
        <Tab.Screen name="Certificates">
          {() => <CertificateNavigator role='admin'/>}
        </Tab.Screen>
        <Tab.Screen name="Verify" component={QrVerification} />
      </>
    );
  } else if (role == "health") {
    return (
      <>
        <Tab.Screen name="Insert" component={InsertUser} />
        <Tab.Screen name="QR Code" component={UserQRCode} />
        <Tab.Screen name="Certificates" component={CertificateNavigator} />
        <Tab.Screen name="Verify" component={QrVerification} />
      </>
    );
  } else if (role == "verifier") {
    return (
      <>
        <Tab.Screen name="QR Code" component={UserQRCode} />
        <Tab.Screen name="Certificates" component={CertificateNavigator} />
        <Tab.Screen name="Verify" component={QrVerification} />
      </>
    );
  } else if (role == "user") {
    return (
      <>
        <Tab.Screen name="QR Code" component={UserQRCode} />
        <Tab.Screen name="Certificates" component={CertificateNavigator} />
        <Tab.Screen name="Verify" component={QrVerification} />
      </>
    );
  }
};
