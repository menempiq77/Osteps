"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Spin, Breadcrumb, message, Tooltip, Button } from "antd";
import Link from "next/link";
import {
  claimCertificate,
  fetchMyClaimedCertificates,
  fetchTrackers,
} from "@/services/trackersApi";
import { FilePdfOutlined, TrophyOutlined } from "@ant-design/icons";
import { IMG_BASE_URL } from "@/lib/config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Tracker = {
  id: string;
  class_id: number;
  name: string;
  type?: string;
  status: string;
  progress: string[];
  lastUpdated?: string;
  tracker_id: string;
  tracker: {
    claim_certificate: number;
    name: string;
    status: string;
  };
};

export default function TrackerList() {
  const { classId } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTrackerId, setActiveTrackerId] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const requestCertificateMutation = useMutation({
    mutationFn: claimCertificate,

    onMutate: (trackerId: string) => {
      setActiveTrackerId(trackerId);
    },

    onSuccess: () => {
      messageApi.success("Request Certificate submitted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["claimed-certificates"],
      });
    },

    onError: () => {
      messageApi.error("Failed to request certificate.");
    },

    onSettled: () => {
      setActiveTrackerId(null);
    },
  });

 const queryClient = useQueryClient();

  const {
    data: claimedCertificates = [],
    isLoading: certificatesLoading,
  } = useQuery({
    queryKey: ["claimed-certificates"],
    queryFn: fetchMyClaimedCertificates,
  });

  const loadTrackers = async () => {
    try {
      setLoading(true);
      const data = await fetchTrackers(Number(classId));
      setTrackers(
        data.map((tracker: any) => ({
          ...tracker,
          id: tracker.id.toString(),
          tracker_id: tracker.tracker_id.toString(),
          lastUpdated: new Date().toISOString().split("T")[0],
        }))
      );
      queryClient.invalidateQueries({
        queryKey: ["claimed-certificates"],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!classId) return;
    loadTrackers();
  }, [classId]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDownloadCertificate = (certificatePath: string) => {
    const url = `${IMG_BASE_URL}/storage/${certificatePath}`;
    window.open(url, "_blank");
  };

  const isCertificateClaimed = (trackerId: string | number) => {
    return claimedCertificates.some(
      (c) => Number(c.tracker_id) === Number(trackerId)
    );
  };

  const getCertificatePath = (trackerId: string | number) => {
    const cert = claimedCertificates.find(
      (c) => Number(c.tracker_id) === Number(trackerId)
    );
    return cert?.certificate_path;
  };

  const handleTrackerClick = (trackerId: string) => {
    router.push(`/dashboard/trackers/${classId}/${trackerId}`);
  };

  if (loading)
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );

  return (
    <>
      {contextHolder}
      <Breadcrumb
        items={[
          {
            title: <Link href="/dashboard">Dashboard</Link>,
          },
          {
            title: <span>Trackers</span>,
          },
        ]}
        className="!mb-2"
      />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Trackers</h1>
      </div>

      <div className="relative overflow-auto">
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full bg-white border border-gray-300 mb-20">
            <thead>
              <tr className="bg-primary text-center text-xs md:text-sm font-thin text-white">
                <th className="p-2 md:p-4">
                  <span className="block py-2 px-3 border-r border-gray-300">
                    Tracker Name
                  </span>
                </th>
                <th className="p-2 md:p-4">
                  <span className="block py-2 px-3 border-r border-gray-300">
                    Last Updated
                  </span>
                </th>
                <th className="p-2 md:p-4">
                  <span className={`block py-2 px-3 border-r border-gray-300`}>
                    Status
                  </span>
                </th>
                <th className="p-2 md:p-4">
                  <span
                    className={`block py-2 px-3 ${
                      currentUser?.role !== "STUDENT" ? "border-r" : ""
                    } border-gray-300`}
                  >
                    Request Certificate
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {trackers?.length > 0 ? (
                trackers?.map((tracker) => (
                  <tr
                    key={tracker.id}
                    className="border-b border-gray-300 text-xs md:text-sm text-center text-gray-800 hover:bg-[#E9FAF1] even:bg-[#E9FAF1] odd:bg-white"
                  >
                    <td
                      onClick={() => handleTrackerClick(tracker.tracker_id)}
                      className="p-2 md:p-4 cursor-pointer hover:underline text-green-600 hover:text-green-800 font-medium"
                    >
                      {tracker?.tracker?.name}
                    </td>
                    <td className="p-2 md:p-4">{tracker.lastUpdated}</td>
                    <td className="p-2 md:p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          tracker.status
                        )}`}
                      >
                        {tracker?.tracker?.status}
                      </span>
                    </td>
                    <td className="p-2 md:p-4 flex justify-center gap-2">
                      {isCertificateClaimed(tracker.tracker_id) ? (
                        <Tooltip title="View Certificate">
                          <FilePdfOutlined
                            className="text-red-600 text-xl cursor-pointer"
                            onClick={() =>
                              handleDownloadCertificate(
                                getCertificatePath(tracker.tracker_id)!
                              )
                            }
                          />
                        </Tooltip>
                      ) : (
                        <Button
                          size="small"
                          icon={<TrophyOutlined />}
                          loading={
                            requestCertificateMutation.isPending &&
                            activeTrackerId === tracker.tracker_id
                          }
                          onClick={() => requestCertificateMutation.mutate(tracker.tracker_id)}
                          disabled={tracker.tracker.claim_certificate === 0}
                        >
                          Request
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="p-2 md:p-4 text-center text-gray-500"
                  >
                    No trackers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
