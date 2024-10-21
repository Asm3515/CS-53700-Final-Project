import { SignUp } from "@clerk/nextjs";// Adjust the path as needed

export default function Page() {
  return (
    <div className="flex justify-center">
      <SignUp />
    </div>
  );
}
