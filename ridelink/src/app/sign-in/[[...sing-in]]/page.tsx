import { SignIn } from "@clerk/nextjs";// Adjust the path as needed

export default function Page() {
  return (
    <div className="flex justify-center" >
      <SignIn appearance={{
        variables: {
          colorPrimary: 'blue',
          colorText: 'black',
        },
      }} />
    </div>
  );
}
