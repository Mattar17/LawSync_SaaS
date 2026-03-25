"use client";

import { ReactNode, useEffect, useState } from "react";
import { createLawyer, getAllLawyers, deleteLawyer } from "@/api/lawyers";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

type TabButtonProps = {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
};

function TabButton({ active, onClick, children }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
        active ? "bg-black text-white" : "bg-muted hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );
}

type Lawyer = {
  id: string;
  name: string;
  description: string;
  avatarUrl?: string;
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("create");

  const [name, setName] = useState("");
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);

  // Fake analytics
  const [analytics] = useState({
    totalLawyers: 12,
    totalCases: 48,
    visits: 1342,
  });

  const fetchLawyers = async () => {
    try {
      const data = await getAllLawyers();
      setLawyers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLawyers();
  }, []);

  const handleCreateLawyer = async () => {
    if (!name.trim()) return alert("Name is required");

    const body = {
      id: `${Date.now()}`,
      name,
      description: "new Lawyer",
      profile_password: "0000",
      portal_password: "0000",
      avatarUrl: "",
    };

    try {
      await createLawyer(body);
      setName("");
      fetchLawyers();
      setActiveTab("manage");
    } catch (err) {
      console.error(err);
      alert("Error creating lawyer");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lawyer?")) return;

    try {
      await deleteLawyer(id);
      fetchLawyers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex justify-center p-6">
      <div className="w-full max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>

          <div className="flex gap-2">
            <TabButton
              active={activeTab === "create"}
              onClick={() => setActiveTab("create")}
            >
              Add Lawyer
            </TabButton>
            <TabButton
              active={activeTab === "manage"}
              onClick={() => setActiveTab("manage")}
            >
              Manage Lawyers
            </TabButton>
            <TabButton
              active={activeTab === "analytics"}
              onClick={() => setActiveTab("analytics")}
            >
              Analytics
            </TabButton>
          </div>
        </div>

        <Separator />

        {/* ================= CREATE ================= */}
        {activeTab === "create" && (
          <Card>
            <CardHeader>
              <CardTitle>Create Lawyer</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Lawyer Name</label>
                <Input
                  placeholder="Enter lawyer name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <Button onClick={handleCreateLawyer} className="w-full">
                Create Lawyer
              </Button>

              <div className="text-sm text-muted-foreground border rounded-md p-3">
                <p className="font-medium">Defaults:</p>
                <p>Description: "new Lawyer"</p>
                <p>Profile Password: 0000</p>
                <p>Portal Password: 0000</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ================= MANAGE ================= */}
        {activeTab === "manage" && (
          <Card>
            <CardHeader>
              <CardTitle>Manage Lawyers</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {lawyers.length === 0 ? (
                <p className="text-muted-foreground">No lawyers yet</p>
              ) : (
                lawyers.map((lawyer) => (
                  <div
                    key={lawyer.id}
                    className="flex items-center justify-between border rounded-lg p-3 hover:shadow-sm transition"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={lawyer.avatarUrl} />
                        <AvatarFallback>{lawyer.name.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <div>
                        <p className="font-medium">{lawyer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {lawyer.description}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(lawyer.id)}
                    >
                      Delete
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {/* ================= ANALYTICS ================= */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Lawyers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{analytics.totalLawyers}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{analytics.totalCases}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Website Visits</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{analytics.visits}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
