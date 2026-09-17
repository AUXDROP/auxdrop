import { Badge, Button, Card, CardBody, CardTitle, Input } from "@/components/ui";
import { AudioPlayerBar, Waveform } from "@/components/audio";

const colorSwatches = [
  { name: "canvas", hex: "#050506", className: "bg-canvas" },
  { name: "primary", hex: "#09090B", className: "bg-primary" },
  { name: "elevated", hex: "#18181B", className: "bg-elevated" },
  { name: "on-dark", hex: "#F7F7F5", className: "bg-on-dark" },
  { name: "border", hex: "#27272A", className: "bg-border" },
  { name: "signal", hex: "#FF3B30", className: "bg-signal" },
  { name: "accent", hex: "#7C3AED", className: "bg-accent" },
  { name: "muted", hex: "#A1A1AA", className: "bg-muted" },
  { name: "faint", hex: "#71717A", className: "bg-faint" },
];

const statusSwatches = [
  { name: "open", label: "OPEN" },
  { name: "upcoming", label: "UPCOMING" },
  { name: "pending", label: "PENDING" },
  { name: "error", label: "ERROR" },
  { name: "licensing", label: "LICENSING REVIEW" },
  { name: "completed", label: "COMPLETED" },
] as const;

const commercialBadges = [
  { status: "licensing", label: "OFFICIAL DSP RELEASE" },
  { status: "pending", label: "SOUND KIT CONTRIBUTOR" },
  { status: "open", label: "LICENSE AVAILABLE: NON-EXCLUSIVE" },
  { status: "upcoming", label: "SYNC ROSTER QUALIFIED" },
] as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-16">
      <h2 className="mb-4 font-sans text-xs font-bold tracking-[0.1em] text-faint uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function ComponentLibraryPage() {
  return (
    <div className="mx-auto max-w-[1440px] border-x border-border px-8 py-16">
      <h1 className="mb-2 font-display text-3xl font-extrabold text-on-dark">
        Auxdrop Component Library
      </h1>
      <p className="mb-12 max-w-2xl font-sans text-sm text-muted">
        Internal dev reference — design tokens and shared components from{" "}
        <code className="text-faint">docs/02-design-system.md</code>. Not a
        shipped route.
      </p>

      <Section title="Colors">
        <div className="flex flex-wrap gap-4">
          {colorSwatches.map((c) => (
            <div key={c.name} className="w-28">
              <div className={`h-16 rounded-card border border-border ${c.className}`} />
              <div className="mt-2 font-sans text-xs font-semibold text-on-dark">{c.name}</div>
              <div className="font-sans text-xs text-faint">{c.hex}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <div className="flex flex-col gap-3">
          <div className="font-display text-4xl font-extrabold text-on-dark">
            Syne 800 — Display headline
          </div>
          <div className="font-display text-xl font-bold text-on-dark">
            Syne 700 — Section heading
          </div>
          <div className="font-sans text-sm font-semibold text-on-dark">
            Manrope 600 — UI text, labels, buttons
          </div>
          <div className="font-sans text-sm text-muted">
            Manrope 400 — Body copy sits here, at a comfortable line height.
          </div>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </Section>

      <Section title="Status Badges">
        <div className="flex flex-wrap gap-3">
          {statusSwatches.map((s) => (
            <Badge key={s.name} status={s.name}>
              {s.label}
            </Badge>
          ))}
        </div>
      </Section>

      <Section title="Commercial Asset Badges">
        <div className="flex flex-wrap gap-3">
          {commercialBadges.map((b) => (
            <Badge key={b.label} status={b.status}>
              {b.label}
            </Badge>
          ))}
        </div>
      </Section>

      <Section title="Cards">
        <Card className="max-w-xs">
          <CardTitle>Card title</CardTitle>
          <CardBody>Card body copy sits here, at a comfortable line height.</CardBody>
        </Card>
      </Section>

      <Section title="Form Inputs">
        <div className="flex max-w-xs flex-col gap-3">
          <Input placeholder="Default input" />
          <Input placeholder="Error input" error />
          <Input placeholder="Disabled input" disabled />
        </div>
      </Section>

      <Section title="Audio Player & Waveform">
        <div className="flex max-w-xl flex-col gap-4">
          <AudioPlayerBar src="/audio/demo-silence.wav" title="Demo track" />
          <div className="rounded-card border border-border bg-elevated p-4">
            <div className="mb-2 font-sans text-xs text-faint">waveform-mini</div>
            <Waveform size="mini" progress={0.35} />
          </div>
        </div>
      </Section>
    </div>
  );
}
