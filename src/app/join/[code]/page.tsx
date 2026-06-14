"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  fetchPublicClass,
  submitEnrollment,
  type PublicClassInfo,
} from "@/services/classEnrollmentApi";

type AxiosishError = {
  response?: { data?: { msg?: string; message?: string; errors?: Record<string, string[]> } };
};

const getErrMsg = (e: unknown, fallback: string): string => {
  const err = e as AxiosishError;
  const data = err?.response?.data;
  if (data?.errors) {
    const first = Object.values(data.errors)[0];
    if (first && first[0]) return first[0];
  }
  return data?.msg || data?.message || fallback;
};

export default function JoinClassPage() {
  const params = useParams();
  const code = useMemo(() => {
    const c = params?.code;
    return Array.isArray(c) ? c[0] : (c ?? "");
  }, [params]);

  const [loading, setLoading] = useState(true);
  const [classInfo, setClassInfo] = useState<PublicClassInfo | null>(null);
  const [invalid, setInvalid] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("");
  const [password, setPassword] = useState("");
  const [needsSupport, setNeedsSupport] = useState<boolean | null>(null);
  const [supportDetails, setSupportDetails] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [done, setDone] = useState<{ user_name: string; class_name: string } | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const info = await fetchPublicClass(code);
        if (active) setClassInfo(info);
      } catch {
        if (active) setInvalid(true);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!firstName.trim() || !lastName.trim()) {
      setFormError("Please enter your first and last name.");
      return;
    }
    if (password.length < 6) {
      setFormError("Please choose a password of at least 6 characters.");
      return;
    }
    if (needsSupport === null) {
      setFormError("Please tell us if you need extra support.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await submitEnrollment(code, {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        gender: gender || undefined,
        nationality: nationality.trim() || undefined,
        password,
        needs_support: needsSupport,
        support_details: needsSupport ? supportDetails.trim() : undefined,
      });
      setDone(res);
    } catch (err) {
      setFormError(getErrMsg(err, "Something went wrong. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-[15px] text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";
  const labelClass = "mb-1.5 block text-sm font-semibold text-slate-700";

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4 py-10">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-5 flex items-center justify-center gap-2 text-emerald-700">
          <span className="text-2xl">🎓</span>
          <span className="text-lg font-extrabold tracking-tight">OSTEPS</span>
        </div>

        <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xl shadow-emerald-900/5">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
              <p className="text-sm text-slate-500">Loading your class…</p>
            </div>
          ) : invalid ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-2xl">
                ⚠️
              </div>
              <h1 className="m-0 text-xl font-bold text-slate-800">Link not valid</h1>
              <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                This join link is invalid or has expired. Please ask your teacher for a new link.
              </p>
            </div>
          ) : done ? (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl">
                ✅
              </div>
              <h1 className="m-0 text-2xl font-bold text-slate-800">You&apos;re all set!</h1>
              <p className="mx-auto mt-2 max-w-sm text-[15px] text-slate-600">
                Your details were sent for <span className="font-semibold">{done.class_name}</span>. Your
                teacher will confirm your place soon.
              </p>
              <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-emerald-100 bg-emerald-50/60 px-5 py-4 text-left">
                <p className="m-0 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Save your login
                </p>
                <p className="m-0 mt-1 text-sm text-slate-600">
                  Username: <span className="font-bold text-slate-900">{done.user_name}</span>
                </p>
                <p className="m-0 mt-0.5 text-sm text-slate-600">
                  Password: <span className="font-semibold text-slate-900">the one you just chose</span>
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-br from-emerald-600 to-teal-600 px-6 py-7 text-white">
                <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                  Join your class
                </p>
                <h1 className="m-0 mt-1 text-2xl font-bold">{classInfo?.class_name}</h1>
                <p className="m-0 mt-1 text-sm text-white/85">
                  {classInfo?.school_name}
                  {classInfo?.year_name ? ` · ${classInfo.year_name}` : ""}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>First name</label>
                    <input
                      className={inputClass}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Ahmed"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Last name</label>
                    <input
                      className={inputClass}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Khan"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Gender</label>
                    <select
                      className={inputClass}
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="">Select…</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Nationality</label>
                    <input
                      className={inputClass}
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      placeholder="e.g. Emirati"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Choose a password</label>
                  <input
                    type="password"
                    className={inputClass}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                  />
                  <p className="mt-1 text-xs text-slate-400">You&apos;ll use this to log in later.</p>
                </div>

                <div>
                  <label className={labelClass}>
                    Do you feel you need extra support in lessons?
                  </label>
                  <div className="flex gap-3">
                    {[
                      { label: "No", value: false },
                      { label: "Yes", value: true },
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt.label}
                        onClick={() => setNeedsSupport(opt.value)}
                        className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                          needsSupport === opt.value
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-slate-300 bg-white text-slate-600 hover:border-emerald-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {needsSupport === true && (
                  <div>
                    <label className={labelClass}>
                      If yes, what kind of support helps you most?
                    </label>
                    <textarea
                      className={`${inputClass} min-h-[90px] resize-y`}
                      value={supportDetails}
                      onChange={(e) => setSupportDetails(e.target.value)}
                      placeholder="Tell us what helps you learn best…"
                    />
                  </div>
                )}

                {formError && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700">
                    {formError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-[15px] font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60"
                >
                  {submitting ? "Submitting…" : "Submit my details"}
                </button>
                <p className="text-center text-xs text-slate-400">
                  Your teacher will review and confirm your place in the class.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
