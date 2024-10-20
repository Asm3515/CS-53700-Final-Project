import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div className="bg-uber-png ">

        {/* Some COde has been editted here */}

  <div className="absolute top-60 left-60">     
  <SignIn />
  </div> 
</div>
  );
}