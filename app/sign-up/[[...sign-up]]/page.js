import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div >
        <Image
              src="/uber.gif"
              alt="Vercel Logo"
              className="dark:invert"
              layout="fill"
              objectFit="cover"
            />

      <div className="absolute top-40 left-60">     
      <SignUp />
      </div> 
    </div>
  );
}
