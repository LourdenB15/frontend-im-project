"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API = process.env.NEXT_PUBLIC_API_URL;

const Onboarding = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({ first_name: "", last_name: "", age: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch existing profile data to pre-fill the form
    useEffect(() => {
        const fetchProfile = async () => {
             try {
                const res = await axios.get(`${API}/api/user/profile`, { withCredentials: true });
                setFormData({
                    first_name: res.data.first_name || "",
                    last_name: res.data.last_name || "",
                    age: res.data.age || ""
                });
            } catch (err) {
                console.error("Failed to fetch profile for onboarding");
            }
        };
        fetchProfile();
    }, []);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await axios.put(`${API}/api/user/onboard`, formData, { withCredentials: true });
            router.refresh();
            router.push("/");
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md">
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <CardTitle>Complete Your Profile</CardTitle>
                    <CardDescription>Please fill in the details below to continue.</CardDescription>
                     {error && <p className="text-sm text-destructive mt-2">{error}</p>}
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="first_name">First Name</Label>
                        <Input id="first_name" name="first_name" value={formData.first_name} onChange={onChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input id="last_name" name="last_name" value={formData.last_name} onChange={onChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input id="age" name="age" type="number" value={formData.age} onChange={onChange} required />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Saving..." : "Save and Continue"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default Onboarding;