import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div>
        

      <div className="absolute top-40 left-60">     
      <SignUp />
      </div> 
    </div>
  );
}
