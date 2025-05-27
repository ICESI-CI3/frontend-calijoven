import { Button } from '@/components/Button';

export default function PublicationsTabs({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: { value: string; label: string }[];
  activeTab: string;
  onTabChange: (value: string) => void;
}) {
  return (
    <div className="mb-6 flex gap-2">
      {tabs.map((tab) => (
        <Button
          key={tab.value}
          variant={activeTab === tab.value ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onTabChange(tab.value)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
} 