interface EventsHeaderProps {
  title: string;
  subtitle: string;
}

const EventsHeader = ({ title, subtitle }: EventsHeaderProps) => {
  return (
    <header
      className="relative w-full h-[163px]"
      style={{
        background:
          "linear-gradient(170.67deg, var(--color-secondary) 40.44%, rgba(205, 58, 56, 0.9) 65.53%)",
      }}
    >
      <div className="absolute left-[25px] top-[46px] w-[8px] h-[71px] bg-primary" />

      <h1 className="absolute left-[42px] top-[45px] font-roboto font-bold text-[40px] leading-[47px] text-center tracking-[0.1px] text-white">
        {title}
      </h1>

      <p className="absolute left-[42px] top-[97px] w-full max-w-[476px] font-inter font-semibold text-[14px] leading-[16px] flex items-center text-white">
        {subtitle}
      </p>
    </header>
  );
};

export default EventsHeader;
