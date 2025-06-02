'use client';

export const Info = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="rounded-lg bg-gray-50 p-4 text-sm text-primary">
      <p className="mb-1 font-medium">{title}</p>
      <p>{description}</p>
    </div>
  );
};
