import { redirect } from "next/navigation";
import React from "react";

const layout = () => {
  return redirect("/unauthorized");
};

export default layout;
