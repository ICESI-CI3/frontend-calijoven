"use client";

import { useParams, useRouter } from "next/navigation";
import { PublicationDetail } from "@/modules/publications/components/PublicationDetail";
import { Button } from "@/components/Button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function PublicationDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => router.back()}>
        <ArrowLeftIcon className="mr-2 h-5 w-5 inline" /> Volver
      </Button>
      <PublicationDetail id={id as string} />
    </div>
  );
} 