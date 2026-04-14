type Props = {
  calLink: string;
};

export function CalEmbed({ calLink }: Props) {
  return (
    <div className="min-h-[640px]" id="cal-embed">
      <iframe
        src={`https://cal.com/${calLink}?theme=dark&brandColor=D4A057`}
        title="Book a discovery call"
        className="h-[640px] w-full border-0"
        loading="lazy"
      />
    </div>
  );
}
