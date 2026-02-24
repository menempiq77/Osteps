"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Spin, Breadcrumb, message, Tooltip, Button } from "antd";
import Link from "next/link";
import {
  claimCertificate,
  fetchCertificateEligibility,
  fetchMyClaimedCertificates,
  fetchTrackers,
} from "@/services/trackersApi";
import { FilePdfOutlined, TrophyOutlined, CalendarOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { IMG_BASE_URL } from "@/lib/config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DeadlineCountdown } from "@/components/common/DeadlineCountdown";

type Tracker = {
  id: string;
  class_id: number;
  name: string;
  type?: string;
  status: string;
  progress: string[];
  deadline?: string | null;
  tracker_id: string;
  tracker: {
    claim_certificate: number;
    name: string;
    status: string;
    deadline?: string | null;
    deadline_at?: string | null;
    deadline_date?: string | null;
    last_updated?: string | null;
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
          deadline:
            tracker?.tracker?.deadline ??
            tracker?.tracker?.deadline_at ??
            tracker?.tracker?.deadline_date ??
            tracker?.tracker?.last_updated ??
            null,
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

  const { data: eligibilityMap = {} } = useQuery({
    queryKey: ["certificate-eligibility", trackers.map(t => t.tracker_id)],
    queryFn: async () => {
      const results = await Promise.all(
        trackers?.map(async (t) => {
          const res = await fetchCertificateEligibility(Number(t.tracker_id));
          return [t.tracker_id, res];
        })
      );

      return Object.fromEntries(results);
    },
    enabled: trackers.length > 0,
  });

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
    <div className="premium-page rounded-2xl p-3 md:p-4">
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
      <div className="premium-hero flex items-center justify-between mb-6 rounded-xl px-4 py-3">
        <h1 className="text-2xl font-bold">Trackers</h1>
      </div>

      <div className="premium-card relative overflow-auto rounded-xl p-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3 p-3">
          {trackers?.length > 0 ? (
            trackers?.map((tracker) => (
              <div
                key={tracker.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg hover:border-green-300 transition-all duration-300 overflow-hidden group"
              >
                <div className="p-3 md:p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    {/* Left Section: Tracker Info */}
                    <div className="flex-1 min-w-0">
                      <h3
                        onClick={() => handleTrackerClick(tracker.tracker_id)}
                        className="text-base md:text-lg font-bold text-green-600 hover:text-green-800 cursor-pointer transition-colors mb-2 group-hover:underline"
                      >
                        {tracker?.tracker?.name}
                      </h3>

                      <div className="space-y-1">
                        {/* Deadline */}
                        <div className="flex items-center gap-2 text-gray-700">
                          <CalendarOutlined className="text-blue-500 text-sm flex-shrink-0" />
                          <div>
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                              Deadline
                            </p>
                            <p className="text-xs md:text-sm font-medium">
                              <DeadlineCountdown deadline={tracker.deadline} showDate />
                            </p>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-2">
                          <CheckCircleOutlined className="text-green-500 text-sm flex-shrink-0" />
                          <div>
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                              Status
                            </p>
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold mt-0.5 ${getStatusColor(
                                tracker.status
                              )}`}
                            >
                              {tracker?.tracker?.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section: Action Button */}
                    <div className="flex md:flex-col items-center justify-end gap-2 md:justify-start">
                      {isCertificateClaimed(tracker.tracker_id) ? (
                        <Tooltip title="Download Certificate">
                          <Button
                            type="primary"
                            icon={<FilePdfOutlined className="text-base" />}
                            size="small"
                            className="!bg-red-600 !border-red-600 hover:!bg-red-700 !text-white !font-semibold"
                            onClick={() =>
                              handleDownloadCertificate(
                                getCertificatePath(tracker.tracker_id)!
                              )
                            }
                          >
                            Certificate
                          </Button>
                        </Tooltip>
                      ) : (
                        <Tooltip
                          title={
                            !eligibilityMap?.[tracker.tracker_id]?.eligible
                              ? "Complete tracker requirements to become eligible"
                              : "Request Certificate"
                          }
                        >
                          <Button
                            type="primary"
                            icon={<TrophyOutlined className="text-base" />}
                            size="small"
                            className={`!font-semibold ${
                              tracker.tracker.claim_certificate === 0 ||
                              !eligibilityMap?.[tracker.tracker_id]?.eligible
                                ? "!opacity-50 !cursor-not-allowed"
                                : "!bg-green-600 !border-green-600 hover:!bg-green-700"
                            } !text-white`}
                            loading={
                              requestCertificateMutation.isPending &&
                              activeTrackerId === tracker.tracker_id
                            }
                            onClick={() =>
                              requestCertificateMutation.mutate(
                                tracker.tracker_id
                              )
                            }
                            disabled={
                              tracker.tracker.claim_certificate === 0 ||
                              !eligibilityMap?.[tracker.tracker_id]?.eligible
                            }
                          >
                            Request
                          </Button>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Accent Border */}
                <div className="h-0.5 bg-gradient-to-r from-green-400 via-green-500 to-transparent"></div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 text-sm">No trackers found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
