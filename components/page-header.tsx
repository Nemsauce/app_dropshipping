type PageHeaderProps = {
  title: string;
  description: string;
  eyebrow?: string;
};

export function PageHeader({ title, description, eyebrow }: PageHeaderProps) {
  return (
    <section className="flex flex-col gap-2">
      {eyebrow ? (
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-demand">
          {eyebrow}
        </div>
      ) : null}
      <h1 className="text-3xl font-semibold tracking-normal text-foreground sm:text-4xl">
        {title}
      </h1>
      <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </section>
  );
}
