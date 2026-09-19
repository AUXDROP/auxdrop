import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SubmissionStatusSelect } from "./SubmissionStatusSelect";

export const metadata: Metadata = { title: "Submission Review — AUXDROP" };

export default async function SubmissionReviewPage() {
  const submissions = await prisma.submission.findMany({
    orderBy: { submittedAt: "desc" },
    take: 100,
    include: {
      track: { select: { title: true } },
      battle: { select: { title: true } },
    },
  });

  return (
    <div>
      <div className="border-b border-border px-12 py-6 font-sans text-xs text-faint">
        Page: /admin/submissions
      </div>
      <div className="p-12">
        <h1 className="mb-8 font-display text-3xl font-extrabold text-on-dark">
          Submission Review
        </h1>

        {submissions.length === 0 ? (
          <p className="font-sans text-[13px] text-faint">No submissions yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-border overflow-hidden rounded-input bg-border">
            {submissions.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between bg-elevated px-5 py-4"
              >
                <div className="flex items-center gap-4">
                  <span className="font-sans text-[13px] font-semibold text-on-dark">
                    {s.track.title}
                  </span>
                  <span className="font-sans text-xs text-faint">{s.battle.title}</span>
                </div>
                <SubmissionStatusSelect submissionId={s.id} status={s.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
