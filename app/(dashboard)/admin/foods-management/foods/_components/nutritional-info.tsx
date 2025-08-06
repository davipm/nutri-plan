// Helper component for nutritional information display
export function NutritionalInfo({
  label,
  value,
  unit,
}: {
  label: string;
  value: number | null;
  unit: string;
}) {
  return (
    <div>
      <p className="text-foreground/60 text-sm font-normal">{label}</p>
      <p className="text-sm font-medium">
        {value ?? 0} {unit}
      </p>
    </div>
  );
}
