"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

type Announcement = {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId?: string;
  date: string;
  type: "prayer" | "event" | "reminder" | "general";
  target: "all" | "teachers" | "students" | "staff";
};

export default function AnnouncementsPage() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    type: "general" as "prayer" | "event" | "reminder" | "general",
    target: "all" as "all" | "teachers" | "students" | "staff",
  });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const islamicAnnouncements: Announcement[] = [
      {
        id: "1",
        title: "Jumu'ah Prayer Schedule",
        content:
          "The Jumu'ah prayer will be held at 1:30 PM in the main musalla. All students and staff are encouraged to attend.",
        author: "Imam Abdullah",
        authorId: "admin1", // Mock author ID
        date: new Date().toISOString().split("T")[0],
        type: "prayer",
        target: "all",
      },
      {
        id: "2",
        title: "Quran Competition",
        content:
          "Annual Quran memorization competition will be held next month. Registration opens next week.",
        author: "Principal",
        authorId: "admin2", // Mock author ID
        date: "2023-06-10",
        type: "event",
        target: "students",
      },
      {
        id: "3",
        title: "Ramadan Preparation Meeting",
        content:
          "All teachers are required to attend the Ramadan preparation meeting this Friday after Dhuhr prayer.",
        author: "School Admin",
        authorId: "admin3", // Mock author ID
        date: "2023-03-01",
        type: "reminder",
        target: "teachers",
      },
      {
        id: "4",
        title: "Islamic History Seminar",
        content:
          "Guest speaker Sheikh Ibrahim will deliver a seminar on 'The Golden Age of Islam' next Wednesday.",
        author: "Academic Dept",
        authorId: "teacher1", // Mock author ID
        date: "2023-04-15",
        type: "event",
        target: "all",
      },
    ];
    setAnnouncements(islamicAnnouncements);
  }, []);

  const handleCreateAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) return;

    const announcement: Announcement = {
      id: Date.now().toString(),
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      author: currentUser?.email || "Unknown",
      authorId: currentUser?.id, // Store the current user's ID
      date: new Date().toISOString().split("T")[0],
      type: newAnnouncement.type,
      target: newAnnouncement.target,
    };

    setAnnouncements([announcement, ...announcements]);
    setNewAnnouncement({
      title: "",
      content: "",
      type: "general",
      target: "all",
    });
    setIsCreating(false);
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter((ann) => ann.id !== id));
  };

  // Determine who can create announcements
  const canCreateAnnouncement =
    currentUser?.role === "SUPER_ADMIN" ||
    currentUser?.role === "SCHOOL_ADMIN" ||
    currentUser?.role === "TEACHER";

  // Check if user can delete a specific announcement
  const canDeleteAnnouncement = (announcement: Announcement) => {
    return (
      currentUser?.role === "SUPER_ADMIN" ||
      currentUser?.role === "SCHOOL_ADMIN" ||
      announcement.authorId === currentUser?.id
    );
  };

  // Filter announcements based on user role and target
  const filteredAnnouncements = announcements.filter((announcement) => {
    // Super admins can see everything
    if (currentUser?.role === "SUPER_ADMIN") return true;

    // School admins can see all except super-admin specific announcements
    if (currentUser?.role === "SCHOOL_ADMIN") {
      return true; // School admins can see all announcements
    }

    // Teachers can see all, teachers-only, and general announcements
    if (currentUser?.role === "TEACHER") {
      return (
        announcement.target === "all" ||
        announcement.target === "teachers" ||
        announcement.target === "staff"
      );
    }

    // Students can see all and students-only announcements
    if (currentUser?.role === "STUDENT") {
      return (
        announcement.target === "all" || announcement.target === "students"
      );
    }

    // Staff can see all and staff-only announcements
    if (currentUser?.role === "STAFF") {
      return announcement.target === "all" || announcement.target === "staff";
    }

    return false;
  });

  const badgeRibbonColors = {
    prayer: "green",
    event: "blue",
    reminder: "gold",
    general: "gray",
  };

  return (
    <div className="container mx-auto p-3 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Announcements</h1>
        {canCreateAnnouncement && (
          <Button onClick={() => setIsCreating(!isCreating)} className="cursor-pointer">
            {isCreating ? "Cancel" : "New Announcement"}
          </Button>
        )}
      </div>

      {isCreating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Announcement</CardTitle>
            <CardDescription>
              Share important updates with the community
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Title (e.g., 'Ramadan Schedule')"
              value={newAnnouncement.title}
              onChange={(e) =>
                setNewAnnouncement({
                  ...newAnnouncement,
                  title: e.target.value,
                })
              }
            />
            <textarea
              className="w-full p-2 border rounded-md min-h-[100px]"
              placeholder="Content (e.g., 'The Taraweeh prayers will begin at 8:30 PM...')"
              value={newAnnouncement.content}
              onChange={(e) =>
                setNewAnnouncement({
                  ...newAnnouncement,
                  content: e.target.value,
                })
              }
              rows={4}
            />
            <div className="flex gap-4 flex-wrap">
              <select
                className="border rounded-md p-2 flex-1"
                value={newAnnouncement.type}
                onChange={(e) =>
                  setNewAnnouncement({
                    ...newAnnouncement,
                    type: e.target.value as any,
                  })
                }
              >
                <option value="prayer">Prayer Announcement</option>
                <option value="event">Islamic Event</option>
                <option value="reminder">Important Reminder</option>
                <option value="general">General Announcement</option>
              </select>
              <select
                className="border rounded-md p-2 flex-1"
                value={newAnnouncement.target}
                onChange={(e) =>
                  setNewAnnouncement({
                    ...newAnnouncement,
                    target: e.target.value as any,
                  })
                }
              >
                <option value="all">Everyone</option>
                <option value="teachers">Teachers Only</option>
                <option value="students">Students Only</option>
                <option value="staff">Staff Only</option>
              </select>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCreateAnnouncement} className="cursor-pointer">
              Publish Announcement
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No announcements yet. Check back later for updates.
          </p>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <Badge.Ribbon
              key={announcement.id}
              text={
                announcement.type.charAt(0).toUpperCase() +
                announcement.type.slice(1)
              }
              color={badgeRibbonColors[announcement.type]}
            >
              <Card className="hover:shadow-lg transition-shadow rounded-lg border border-gray-200 relative">
                {canDeleteAnnouncement(announcement) && (
                  <span
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                    className="absolute bottom-4 right-4 text-red-500 font-medium hover:text-red-700 transition-colors cursor-pointer"
                    aria-label="Delete announcement"
                  >Delete</span>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start gap-2 flex-wrap">
                    <CardTitle>{announcement.title}</CardTitle>
                  </div>
                  <CardDescription className="flex flex-wrap gap-2 items-center">
                    <span>{announcement.date}</span>
                    <span>•</span>
                    <span>Posted by {announcement.author}</span>
                    {announcement.target !== "all" && (
                      <>
                        <span>•</span>
                        <span>For {announcement.target}</span>
                      </>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line text-gray-700">
                    {announcement.content}
                  </p>
                </CardContent>
              </Card>
            </Badge.Ribbon>
          ))
        )}
      </div>
    </div>
  );
}
