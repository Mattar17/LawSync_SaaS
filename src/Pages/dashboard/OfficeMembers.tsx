"use client";

import { UserX, Crown, Loader2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useUserStore } from "@/zustandStore/userStore";
import { useOfficeMembers, type OfficeMember } from "@/hooks/useOfficeMembers";
import OfficeInvites from "@/components/office/OfficeInvites";

function initials(name: string) {
  return name.trim().slice(0, 2);
}

export default function OfficeMembers() {
  const { user, currentOffice } = useUserStore();
  const { members, loading, loadingFetch, kickMember } = useOfficeMembers(
    currentOffice?.id,
  );

  const isOwner = currentOffice?.owner_id === user?.id;

  return (
    <div dir="rtl" className="dashboard-page">
      <div className="dashboard-container space-y-6">
        <div>
          <p className="dashboard-kicker">إدارة المكتب</p>
          <h1 className="dashboard-title">أعضاء المكتب</h1>
          <p className="dashboard-subtitle">
            إدارة المحامين وصلاحيات الوصول إلى مساحة العمل
          </p>
        </div>
        <Card className="dashboard-panel rounded-[14px] border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              أعضاء المكتب
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            {loading && (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-lg" />
                ))}
              </div>
            )}

            {!loading && members.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                لا يوجد أعضاء في هذا المكتب بعد
              </p>
            )}

            {!loading &&
              members.map((member: OfficeMember) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 rounded-lg">
                      <AvatarImage src={member.picture_url} alt={member.name} />
                      <AvatarFallback className="rounded-lg bg-blue-100 text-blue-700">
                        {initials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="leading-tight">
                      <p className="flex items-center gap-1 text-sm font-medium">
                        {member.name}
                        {member.role === "owner" && (
                          <Crown className="h-3.5 w-3.5 text-[#B8975A]" />
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        member.role === "owner"
                          ? "border-[#B8975A] text-[#B8975A]"
                          : ""
                      }
                    >
                      {member.role === "owner" ? "المالك" : "عضو"}
                    </Badge>

                    {/* Owner sees a Kick action on every other lawyer. Everyone else, including a plain member, sees the list with no controls. */}
                    {isOwner && member.role !== "owner" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-lg text-destructive hover:bg-destructive/10"
                            disabled={loadingFetch === member.id}
                          >
                            {loadingFetch === member.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <UserX className="h-4 w-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              إزالة {member.name} من المكتب؟
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              سيفقد هذا المحامي وصوله إلى المكتب فورًا. يمكنه
                              الانضمام مرة أخرى فقط بدعوة جديدة.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => kickMember(member.id)}
                            >
                              إزالة
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
        {/* OFFICE INVITES — owner only */}
        <div className="border-t border-[#e7e9ee] pt-6">
          <OfficeInvites officeId={currentOffice?.id ?? ""} />
        </div>
      </div>
    </div>
  );
}
