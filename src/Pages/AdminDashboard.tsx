"use client";

import { ReactNode, useEffect, useState } from "react";
import { createLawyer, getAllLawyersAdmin, deleteLawyer } from "@/api/lawyers";

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
  token: string;
  name: string;
  description: string;
  avatarUrl?: string;
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("create");

  const [name, setName] = useState("");
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);

  const [toast, setToast] = useState<string | null>(null);

  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState<string | null>(null);
  const [loadingFetch, setLoadingFetch] = useState(false);

  const [analytics] = useState({
    totalLawyers: 12,
    totalCases: 48,
    visits: 1342,
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    async function getLawyers() {
      setLoadingFetch(true);
      try {
        const data = await getAllLawyersAdmin();

        if (!data.success) {
          showToast(data.message || "Failed to fetch lawyers");
          return;
        }

        setLawyers(data.data);
      } catch (err) {
        showToast("Something went wrong");
      } finally {
        setLoadingFetch(false);
      }
    }
    getLawyers();
  }, []);

  const handleCreateLawyer = async () => {
    if (!name.trim()) return showToast("Name is required");

    const body = {
      id: `${Date.now()}`,
      name,
      description: "new Lawyer",
      profile_password: "0000",
      portal_password: "0000",
      avatarUrl: "",
    };

    setLoadingCreate(true);

    try {
      const res = await createLawyer(body);

      if (!res.success) {
        showToast(res.message || "Failed to create lawyer");
        return;
      }

      showToast(res.message || "Lawyer created");

      setLawyers((prev) => [...prev, res.data]);
      setName("");
      setActiveTab("manage");
    } catch (err) {
      showToast("Something went wrong");
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lawyer?")) return;

    setLoadingDelete(id);

    try {
      const res = await deleteLawyer(id);

      if (!res.success) {
        showToast(res.message || "Failed to delete");
        return;
      }

      showToast(res.message || "Deleted successfully");

      setLawyers((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      showToast("Something went wrong");
    } finally {
      setLoadingDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex justify-center p-6 relative">
      {/* TOAST */}
      {toast && (
        <div className="absolute top-2 mx-auto bg-black text-white px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}

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
                  disabled={loadingCreate}
                />
              </div>

              <Button
                onClick={handleCreateLawyer}
                className="w-full"
                disabled={loadingCreate}
              >
                {loadingCreate ? "Creating..." : "Create Lawyer"}
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
              <CardTitle className="text-xl font-semibold">
                Manage Lawyers
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {loadingFetch ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : lawyers.length === 0 ? (
                <p className="text-muted-foreground text-sm">No lawyers yet</p>
              ) : (
                lawyers.map((lawyer) => (
                  <div
                    key={lawyer.id}
                    className="flex items-center justify-between rounded-xl border bg-background p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={lawyer.avatarUrl} />
                        <AvatarFallback>{lawyer.name.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <div>
                        <p className="font-semibold">{lawyer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {lawyer.description}
                        </p>

                        <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                          {lawyer.token}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigator.clipboard.writeText(lawyer.token)
                        }
                        disabled={loadingDelete === lawyer.id}
                      >
                        Copy
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(lawyer.id)}
                        disabled={loadingDelete === lawyer.id}
                      >
                        {loadingDelete === lawyer.id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
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
