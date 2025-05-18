type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  outline?: boolean;
};

export default function Button({ outline, className = "", ...props }: Props) {
  const base =
    "py-2 px-5 rounded-full font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";
  const filled = "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-400";
  const outlined =
    "border border-white text-white hover:bg-white/20 focus:ring-white";

  return (
    <button
      className={`${base} ${outline ? outlined : filled} ${className}`}
      {...props}
    />
  );
}
