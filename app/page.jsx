import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Logout from "@/components/Logout";
import { Button } from "@/components/ui/button";

const API = process.env.NEXT_PUBLIC_API_URL;

// This function fetches the user's profile on the server side.
// It needs the token to make an authenticated request.
const getProfile = async (token) => {
  try {
    const res = await fetch(`${API}/api/user/profile`, {
      headers: {
        Cookie: `token=${token}`,
      },
      cache: 'no-store', // Ensures fresh data is fetched on every request
    });

    if (!res.ok) {
      // If the response is not OK (e.g., 401 Unauthorized), the token is invalid.
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return null;
  }
};

const HomePage = async () => {
  // 1. Get the token from the browser's cookies.
  const cookieStore = await cookies();
  const token = await cookieStore.get("token")?.value;

  // 2. If no token is found, redirect to the login page immediately.
  if (!token) {
    redirect("/login");
  }

  // 3. Fetch the user's profile using the token.
  const user = await getProfile(token);

  // 4. If the profile fetch fails (invalid token), redirect to login.
  if (!user) {
    redirect("/login");
  }

  if (!user.onboarding_complete) {
    redirect("/onboard");
  }
  return (
    
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white shadow-md rounded-lg text-center">
        <h1 className="text-3xl font-bold mb-2">
          Welcome, {user.first_name}!
        </h1>
        <p className="text-gray-600 mb-6">
          You have successfully logged in.
        </p>
        <div className="flex justify-center items-center gap-4">
          <Link href="/profile" passHref>
            <Button>Manage Profile</Button>
          </Link>
          <Logout />
        </div>
      </div>
    </div>
    
  );
};

export default HomePage;