import DriverRegister from "./register/page";
 
export default function DriversPage() {
  return (
<div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
<h1 className="text-3xl font-bold">Driver Registration</h1>
<DriverRegister />
</div>
  );
}